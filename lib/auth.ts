import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getDb } from '@/lib/db/index';
import { users, loginAttempts } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: '用户名', type: 'text' },
        password: { label: '密码', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('请输入用户名和密码');
        }

        const db = getDb();

        // 检查失败次数
        const failCount = await db.select({ count: sql<number>`count(*)` })
          .from(loginAttempts)
          .where(
            and(
              eq(loginAttempts.username, credentials.username),
              eq(loginAttempts.success, false),
              sql`attempt_time > datetime('now', '-15 minutes')`
            )
          )
          .get();

        if (failCount && failCount.count >= 5) {
          throw new Error('登录失败次数过多，请15分钟后再试');
        }

        // 查询用户
        const user = await db.select()
          .from(users)
          .where(eq(users.username, credentials.username))
          .get();

        if (!user) {
          await db.insert(loginAttempts).values({
            username: credentials.username,
            success: false,
          });
          throw new Error('用户名或密码错误');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          await db.insert(loginAttempts).values({
            username: credentials.username,
            success: false,
          });
          throw new Error('用户名或密码错误');
        }

        // 登录成功
        await db.insert(loginAttempts).values({
          username: credentials.username,
          success: true,
        });

        return {
          id: String(user.id),
          username: user.username,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.isAdmin = (user as any).isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
        (session.user as any).isAdmin = token.isAdmin;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

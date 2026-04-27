import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  driver: 'd1',
  dialect: 'sqlite',
} satisfies Config;

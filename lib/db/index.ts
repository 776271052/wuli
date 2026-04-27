import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

let db: ReturnType<typeof drizzle>;

export function getDb(d1Binding?: D1Database) {
  if (!db) {
    if (!d1Binding) {
      throw new Error('D1 binding is required to initialize database connection');
    }
    db = drizzle(d1Binding, { schema });
  }
  return db;
}

export function initDb(d1Binding: D1Database) {
  db = drizzle(d1Binding, { schema });
  return db;
}

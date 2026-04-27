import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  email: text('email'),
  password: text('password').notNull(),
  isAdmin: integer('is_admin', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(current_timestamp)`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(current_timestamp)`),
});

export const userAis = sqliteTable('user_ais', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  level: integer('level').default(1),
  exp: integer('exp').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(current_timestamp)`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(current_timestamp)`),
});

export const aiModels = sqliteTable('ai_models', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  provider: text('provider').notNull(),
  modelName: text('model_name').notNull(),
  apiEndpoint: text('api_endpoint').notNull(),
  apiKey: text('api_key').default(''),
  isActive: integer('is_active', { mode: 'boolean' }).default(false),
  inputPrice: text('input_price_per_1m').default('0'),
  outputPrice: text('output_price_per_1m').default('0'),
  priceCurrency: text('price_currency').default('CNY'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(current_timestamp)`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(current_timestamp)`),
});

export const roleConfigs = sqliteTable('role_configs', {
  roleName: text('role_name').primaryKey(),
  aggressionLevel: integer('aggression_level').default(5),
  toneDescription: text('tone_description'),
  enabled: integer('enabled', { mode: 'boolean' }).default(true),
});

export const sensitiveWords = sqliteTable('sensitive_words', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  word: text('word').unique().notNull(),
});

export const discussionMessages = sqliteTable('discussion_messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  category: text('category'),
  role: text('role'),
  content: text('content'),
  newsTitle: text('news_title'),
  newsUrl: text('news_url').default(''),
  parentId: integer('parent_id'),
  sourceType: text('source_type').default('auto'),
  generatedAt: integer('generated_at', { mode: 'timestamp' }).default(sql`(current_timestamp)`),
});

export const dataSources = sqliteTable('data_sources', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  category: text('category'),
  provider: text('provider'),
  apiEndpoint: text('api_endpoint'),
  apiKey: text('api_key').default(''),
  isActive: integer('is_active', { mode: 'boolean' }).default(false),
  priority: integer('priority').default(1),
});

export const systemConfigs = sqliteTable('system_configs', {
  key: text('key').primaryKey(),
  value: text('value'),
});

export const cache = sqliteTable('cache', {
  cacheKey: text('cache_key').primaryKey(),
  cacheValue: text('cache_value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(current_timestamp)`),
});

export const loginAttempts = sqliteTable('login_attempts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username'),
  attemptTime: integer('attempt_time', { mode: 'timestamp' }).default(sql`(current_timestamp)`),
  success: integer('success', { mode: 'boolean' }).default(false),
});

export const aiUsageLogs = sqliteTable('ai_usage_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  modelId: integer('model_id').references(() => aiModels.id).notNull(),
  promptTokens: integer('prompt_tokens').default(0),
  completionTokens: integer('completion_tokens').default(0),
  totalTokens: integer('total_tokens').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(current_timestamp)`),
});

export const adminActivityLog = sqliteTable('admin_activity_log', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  adminName: text('admin_name').notNull(),
  actionType: text('action_type').notNull(),
  targetDesc: text('target_desc'),
  details: text('details'),
  ipAddress: text('ip_address'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(current_timestamp)`),
});

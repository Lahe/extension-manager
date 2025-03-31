import { boolean, integer, pgTable, text } from 'drizzle-orm/pg-core'

export const extensionsTable = pgTable('extensions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  logo: text('logo').notNull(),
  isActive: boolean('is_active'),
  categories: text('categories').array(),
})

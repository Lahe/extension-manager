import { boolean, integer, jsonb, pgTable, text } from 'drizzle-orm/pg-core'

interface Category {
  name: string
  color: string
}

export const Extensions = pgTable('extensions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  description: text('description'),
  logo: text('logo').notNull(),
  isActive: boolean('is_active').notNull().default(false),
  categories: jsonb('categories').$type<Category[]>().notNull().default([]),
})

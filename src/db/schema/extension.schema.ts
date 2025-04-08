import { relations } from 'drizzle-orm'
import { boolean, integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core'

export const categories = pgTable('categories', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull().unique(),
  color: text('color').notNull(),
})

export const extensions = pgTable('extensions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  description: text('description'),
  logo: text('logo').notNull(),
  isActive: boolean('is_active').notNull().default(false),
})

export const extensionsToCategories = pgTable(
  'extensions_to_categories',
  {
    extensionId: integer('extension_id')
      .notNull()
      .references(() => extensions.id, { onDelete: 'cascade' }),
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
  },
  t => [primaryKey({ columns: [t.extensionId, t.categoryId] })]
)

export const extensionsRelations = relations(extensions, ({ many }) => ({
  extensionsToCategories: many(extensionsToCategories),
}))

export const categoriesRelations = relations(categories, ({ many }) => ({
  extensionsToCategories: many(extensionsToCategories),
}))

export const extensionsToCategoriesRelations = relations(extensionsToCategories, ({ one }) => ({
  extension: one(extensions, {
    fields: [extensionsToCategories.extensionId],
    references: [extensions.id],
  }),
  category: one(categories, {
    fields: [extensionsToCategories.categoryId],
    references: [categories.id],
  }),
}))

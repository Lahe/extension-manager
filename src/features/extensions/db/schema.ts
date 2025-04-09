import { categories, extensions } from '@/db/schema'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'

// SELECT
const selectCategoriesSchema = createSelectSchema(categories)
const selectExtensionsSchema = createSelectSchema(extensions)
const selectExtensionCategories = z.object({
  categories: selectCategoriesSchema.array().default([]),
})
export const selectExtensionsWithCategoriesSchema =
  selectExtensionsSchema.merge(selectExtensionCategories)

export interface Category extends z.infer<typeof selectCategoriesSchema> {}
export interface Extension extends z.infer<typeof selectExtensionsSchema> {}
export interface ExtensionWithCategories
  extends z.infer<typeof selectExtensionsWithCategoriesSchema> {}

// INSERT
export const createExtensionSchema = createInsertSchema(extensions)
export const createCategoriesSchema = createInsertSchema(categories)
const createExtensionCategories = z.object({
  categories: z.array(z.number()).default([]).optional(),
})
export const createExtensionWithCategoriesSchema = createExtensionSchema
  .merge(createExtensionCategories)
  .omit({
    isActive: true,
  })

export interface NewCategory extends z.infer<typeof createCategoriesSchema> {}
export interface NewExtension extends z.infer<typeof createExtensionWithCategoriesSchema> {}

// UPDATE
export const updateExtensionSchema = createUpdateSchema(extensions)
export interface UpdateExtension extends z.infer<typeof updateExtensionSchema> {}

export const toggleExtensionInputSchema = selectExtensionsSchema.pick({
  id: true,
  isActive: true,
})
export interface ToggleExtensionStatus extends z.infer<typeof toggleExtensionInputSchema> {}

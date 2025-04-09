import { categories, extensions } from '@/db/schema'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'

// SELECT
const selectExtensionsSchema = createSelectSchema(extensions)
const selectCategoriesSchema = createSelectSchema(categories)
export const selectExtensionsWithCategoriesSchema = createSelectSchema(extensions).extend({
  categories: selectCategoriesSchema.array().default([]),
})

export interface Category extends z.infer<typeof selectCategoriesSchema> {}
export interface Extension extends z.infer<typeof selectExtensionsSchema> {}
export interface ExtensionWithCategories
  extends z.infer<typeof selectExtensionsWithCategoriesSchema> {}

// INSERT
export const createExtensionSchema = createInsertSchema(extensions)
export const createExtensionWithCategoriesSchema = createInsertSchema(extensions)
  .extend({
    categories: z.array(z.number()).default([]).optional(),
  })
  .omit({
    isActive: true,
  })

export interface NewExtension extends z.infer<typeof createExtensionWithCategoriesSchema> {}

// UPDATE
export const updateExtensionSchema = createUpdateSchema(extensions).extend({
  categories: z.array(z.number()).default([]).optional(),
})
export const updateExtensionFormSchema = updateExtensionSchema.extend({
  id: z.number().int().positive(),
})

export const toggleExtensionInputSchema = selectExtensionsSchema.pick({
  id: true,
  isActive: true,
})

export interface UpdateExtension extends z.infer<typeof updateExtensionSchema> {}
export interface UpdateExtensionForm extends z.infer<typeof updateExtensionFormSchema> {}
export interface ToggleExtensionStatus extends z.infer<typeof toggleExtensionInputSchema> {}

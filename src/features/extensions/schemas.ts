import { categories, extensions } from '@/db/schema'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'

// SELECT
export const selectExtensionsSchema = createSelectSchema(extensions)
export const selectCategoriesSchema = createSelectSchema(categories)
export const selectExtensionsWithCategoriesSchema = selectExtensionsSchema.extend({
  categories: selectCategoriesSchema.array().default([]),
})

export interface Category extends z.infer<typeof selectCategoriesSchema> {}
export interface Extension extends z.infer<typeof selectExtensionsSchema> {}
export interface ExtensionWithCategories
  extends z.infer<typeof selectExtensionsWithCategoriesSchema> {}

// INSERT
const categoryIdsValidation = z.array(selectCategoriesSchema.shape.id).default([])
const extensionsFormValidation = {
  name: z.string().min(3, 'Name must be at least 3 characters'),
}

export const createExtensionSchema = createInsertSchema(
  extensions,
  extensionsFormValidation
).strict()

export const createExtensionWithCategoriesSchema = createExtensionSchema
  .extend({
    categories: categoryIdsValidation.optional(),
  })
  .omit({
    isActive: true,
  })
  .strict()

export interface NewExtension extends z.infer<typeof createExtensionWithCategoriesSchema> {}

// UPDATE
export const updateExtensionSchema = createUpdateSchema(extensions, extensionsFormValidation)
  .extend({
    categories: categoryIdsValidation.optional(),
  })
  .strict()

export const updateExtensionFormSchema = updateExtensionSchema
  .extend({
    id: selectExtensionsSchema.shape.id,
  })
  .strict()

export const toggleExtensionInputSchema = selectExtensionsSchema
  .pick({
    id: true,
    isActive: true,
  })
  .strict()

export interface UpdateExtension extends z.infer<typeof updateExtensionSchema> {}
export interface UpdateExtensionForm extends z.infer<typeof updateExtensionFormSchema> {}
export interface ToggleExtensionStatus extends z.infer<typeof toggleExtensionInputSchema> {}

// DELETE
export const deleteExtensionSchema = selectExtensionsSchema.pick({ id: true, name: true })
export interface DeleteExtension extends z.infer<typeof deleteExtensionSchema> {}

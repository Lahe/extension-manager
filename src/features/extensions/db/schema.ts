import { categories, extensions, extensionsInitializer, extensionsMutator } from '@/db/schemas'
import { z } from 'zod'

const extensionsFormSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  logo: z.union([z.literal(''), z.string().trim()]),
  categories: z.array(z.number()).default([]).optional(),
})

// SELECT
export const selectCategoriesSchema = categories.pick({
  id: true,
  name: true,
  color: true,
})
export type Category = z.infer<typeof selectCategoriesSchema>

export const selectExtensionsWithCategoriesSchema = extensions
  .extend({
    categories: selectCategoriesSchema.array().default([]),
  })
  .omit({
    createdAt: true,
    updatedAt: true,
  })

export type ExtensionWithCategories = z.infer<typeof selectExtensionsWithCategoriesSchema>

// INSERT
export const createExtensionWithCategoriesSchema = extensionsInitializer
  .merge(extensionsFormSchema)
  .omit({
    id: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  })

export type NewExtensionWithCategories = z.infer<typeof createExtensionWithCategoriesSchema>

// UPDATE
export const updateExtensionFormSchema = extensionsMutator.merge(extensionsFormSchema)
export const updateExtensionSchema = updateExtensionFormSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const toggleExtensionInputSchema = extensions.pick({
  id: true,
  name: true,
  isActive: true,
})

export type UpdateExtension = z.infer<typeof updateExtensionSchema>

export type UpdateExtensionForm = z.infer<typeof updateExtensionFormSchema>

export type ToggleExtensionStatus = z.infer<typeof toggleExtensionInputSchema>

// DELETE
export const deleteExtensionSchema = extensions.pick({ id: true, name: true })

export type DeleteExtension = z.infer<typeof deleteExtensionSchema>

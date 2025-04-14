import { categories, extensions, extensionsInitializer, extensionsMutator } from '@/db/schemas'
import { z } from 'zod'

const extensionsFormSchema = z.object({
  name: z.string().min(1),
  logo: z.union([z.literal(''), z.string().trim().url()]),
  categories: z.array(z.number()).default([]).optional(),
})

// SELECT
export const selectExtensionsWithCategoriesSchema = extensions.extend({
  categories: categories.array().default([]),
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

export const toggleExtensionInputSchema = extensionsMutator.pick({
  id: true,
  name: true,
  isActive: true,
})

export interface UpdateExtension extends z.infer<typeof updateExtensionSchema> {}

export interface UpdateExtensionForm extends z.infer<typeof updateExtensionFormSchema> {}

export interface ToggleExtensionStatus extends z.infer<typeof toggleExtensionInputSchema> {}

// DELETE
export const deleteExtensionSchema = extensions.pick({ id: true, name: true })

export interface DeleteExtension extends z.infer<typeof deleteExtensionSchema> {}

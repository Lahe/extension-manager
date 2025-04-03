import { extensions } from '@/db/schema'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'

export const extensionSelectSchema = createSelectSchema(extensions)
export type Extension = z.infer<typeof extensionSelectSchema>

export const createExtensionSchema = createInsertSchema(extensions, {
  name: z.string({ required_error: 'Name is required' }),
  description: z.string({ required_error: 'Description is required' }),
  logo: z.string({ required_error: 'Logo path is required' }),
  categories: z.array(z.object({ name: z.string(), color: z.string() })),
})
export type NewExtension = z.infer<typeof createExtensionSchema>

export const updateExtensionSchema = createUpdateSchema(extensions)
export type UpdateExtension = z.infer<typeof updateExtensionSchema>

export const toggleExtensionInputSchema = z.object({
  id: z.number().int().positive(),
  isActive: z.boolean(),
})
export type ToggleExtensionStatus = z.infer<typeof toggleExtensionInputSchema>

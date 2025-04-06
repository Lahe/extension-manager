import { extensions } from '@/db/schema'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'

export const extensionSelectSchema = createSelectSchema(extensions)
export interface Extension extends z.infer<typeof extensionSelectSchema> {}

export const createExtensionSchema = createInsertSchema(extensions, {
  name: z.string({ required_error: 'Name is required' }),
  description: z.string({ required_error: 'Description is required' }),
  logo: z.string({ required_error: 'Logo path is required' }),
  categories: z.array(z.object({ name: z.string(), color: z.string() })),
})
export interface NewExtension extends z.infer<typeof createExtensionSchema> {}

export const updateExtensionSchema = createUpdateSchema(extensions)
export interface UpdateExtension extends z.infer<typeof updateExtensionSchema> {}

export const toggleExtensionInputSchema = z.object({
  id: z.number().int().positive(),
  isActive: z.boolean(),
})
export interface ToggleExtensionStatus extends z.infer<typeof toggleExtensionInputSchema> {}

import { Extensions } from '@/db/schema'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const ExtensionSelectSchema = createSelectSchema(Extensions)
export type Extension = z.infer<typeof ExtensionSelectSchema>

export const CreateExtensionSchema = createInsertSchema(Extensions, {
  name: z.string({ required_error: 'Name is required' }),
  description: z.string({ required_error: 'Description is required' }),
  logo: z.string({ required_error: 'Logo path is required' }),
  categories: z.array(z.object({ name: z.string(), color: z.string() })),
})
export type NewExtension = z.infer<typeof CreateExtensionSchema>

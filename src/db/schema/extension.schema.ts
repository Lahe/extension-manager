import { boolean, integer, pgTable, text } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

export const Extensions = pgTable('extensions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  logo: text('logo').notNull(),
  isActive: boolean('is_active'),
  categories: text('categories').array(),
})

export const CreateExtensionSchema = createInsertSchema(Extensions, {
  name: z.string({ required_error: 'Name is required' }),
  description: z.string({ required_error: 'Description is required' }),
  logo: z.string({ required_error: 'Logo path is required' }),
})
export type CreateExtension = z.infer<typeof CreateExtensionSchema>

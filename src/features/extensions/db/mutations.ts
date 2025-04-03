import { db } from '@/db/db'
import { extensions } from '@/db/schema'
import { Extension, ToggleExtensionStatus } from '@/features/extensions/db/schema'
import { eq } from 'drizzle-orm'

export async function updateExtensionStatus(input: ToggleExtensionStatus): Promise<Extension> {
  const updated = await db
    .update(extensions)
    .set({ isActive: input.isActive })
    .where(eq(extensions.id, input.id))
    .returning()

  if (updated.length === 0) {
    throw new Error(`Extension with id ${input.id} not found`)
  }

  return updated[0]
}

import { db } from '@/db/db'
import { extensions, extensionsToCategories } from '@/db/schema'
import { getExtensionWithCategoriesById } from '@/features/extensions/db/queries'
import {
  DeleteExtension,
  Extension,
  ToggleExtensionStatus,
  UpdateExtension,
} from '@/features/extensions/schemas'
import { eq } from 'drizzle-orm'

export async function updateExtensionStatus(input: ToggleExtensionStatus): Promise<Extension> {
  const updated = await db
    .update(extensions)
    .set({ isActive: input.isActive })
    .where(eq(extensions.id, input.id))
    .returning()

  if (updated.length === 0) {
    throw new Error(`Failed to update extension with id: ${input.id}`)
  }

  return updated[0]
}

export async function updateExtensionById(id: number, input: UpdateExtension): Promise<Extension> {
  const { categories, ...extensionData } = input

  const updatedExtension = await db.transaction(async trx => {
    await trx
      .update(extensions)
      .set({ ...extensionData })
      .where(eq(extensions.id, id))
      .returning({ id: extensions.id })

    await trx.delete(extensionsToCategories).where(eq(extensionsToCategories.extensionId, id))

    if (categories && categories.length > 0) {
      const links = categories.map(catId => ({ extensionId: id, categoryId: catId }))
      await trx.insert(extensionsToCategories).values(links)
    }

    return id
  })

  const result = await getExtensionWithCategoriesById(updatedExtension)

  if (!result) {
    throw new Error(`Failed to fetch updated extension with id ${id}.`)
  }

  return result
}

export async function deleteExtensionById(id: number): Promise<DeleteExtension> {
  const deleted = await db
    .delete(extensions)
    .where(eq(extensions.id, id))
    .returning({ id: extensions.id, name: extensions.name })

  if (deleted.length === 0) {
    throw new Error(`Failed to delete extension with id ${id}.`)
  }

  return deleted[0]
}

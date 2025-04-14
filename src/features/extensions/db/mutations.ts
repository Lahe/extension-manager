import { db } from '@/db/db'
import { Extensions } from '@/db/schemas'
import { getExtensionWithCategoriesById } from '@/features/extensions/db/queries'
import {
  DeleteExtension,
  ToggleExtensionStatus,
  UpdateExtension,
} from '@/features/extensions/db/schema'

export async function updateExtensionStatus(input: ToggleExtensionStatus): Promise<Extensions> {
  return await db
    .updateTable('extensions')
    .set({
      isActive: input.isActive,
    })
    .where('id', '=', input.id)
    .returningAll()
    .executeTakeFirstOrThrow(() => new Error(`Failed to update extension with id: ${input.id}`))
}

export async function updateExtensionById(id: number, input: UpdateExtension): Promise<Extensions> {
  const { categories, ...extensionData } = input

  await db.transaction().execute(async trx => {
    await trx
      .updateTable('extensions')
      .set(extensionData)
      .where('id', '=', id)
      .returning('id')
      .executeTakeFirst()

    await trx.deleteFrom('extensionsToCategories').where('extensionId', '=', id).execute()

    if (categories && categories.length > 0) {
      const links = categories.map(catId => ({
        extensionId: id,
        categoryId: catId,
      }))
      await trx.insertInto('extensionsToCategories').values(links).execute()
    }
  })

  return await getExtensionWithCategoriesById(id)
}

export async function deleteExtensionById(id: number): Promise<DeleteExtension> {
  return await db
    .deleteFrom('extensions')
    .where('id', '=', id)
    .returning(['id', 'name'])
    .executeTakeFirstOrThrow(() => new Error(`Failed to delete extension with id: ${id}`))
}

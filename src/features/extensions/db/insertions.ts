import { db } from '@/db/db'
import { getExtensionWithCategoriesById } from '@/features/extensions/db/queries'
import {
  ExtensionWithCategories,
  NewExtensionWithCategories,
} from '@/features/extensions/db/schema'

export async function insertExtension(
  extension: NewExtensionWithCategories
): Promise<ExtensionWithCategories> {
  const { categories, ...extensionData } = extension

  const newExtension = await db.transaction().execute(async trx => {
    const inserted = await trx
      .insertInto('extensions')
      .values(extensionData)
      .returning('id')
      .executeTakeFirst()
    const newExtensionId = inserted?.id

    if (!newExtensionId) {
      throw new Error('Failed to insert extension')
    }

    if (categories && categories.length > 0) {
      const links = categories.map(id => ({
        extensionId: newExtensionId,
        categoryId: id,
      }))
      await trx.insertInto('extensionsToCategories').values(links).execute()
    }

    return newExtensionId
  })

  const result = await getExtensionWithCategoriesById(newExtension)

  if (!result) {
    throw new Error(`Failed to fetch inserted extension with id ${newExtension}.`)
  }

  return result
}

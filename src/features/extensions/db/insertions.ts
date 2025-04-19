import { db } from '@/db/db'
import { extensions, extensionsToCategories } from '@/db/schema'
import { getExtensionWithCategoriesById } from '@/features/extensions/db/queries'
import { ExtensionWithCategories, NewExtension } from '@/features/extensions/schemas'

export async function insertExtension(extension: NewExtension): Promise<ExtensionWithCategories> {
  const { categories, ...extensionData } = extension

  const newExtension = await db.transaction(async trx => {
    const inserted = await trx
      .insert(extensions)
      .values(extensionData)
      .returning({ id: extensions.id })
    const newExtensionId = inserted[0]?.id

    if (!newExtensionId) {
      throw new Error('Failed to insert extension')
    }

    if (categories && categories.length > 0) {
      const links = categories.map(id => ({ extensionId: newExtensionId, categoryId: id }))
      await trx.insert(extensionsToCategories).values(links)
    }

    return newExtensionId
  })

  const result = await getExtensionWithCategoriesById(newExtension)

  if (!result) {
    throw new Error(`Failed to fetch inserted extension with id ${newExtension}.`)
  }

  return result
}

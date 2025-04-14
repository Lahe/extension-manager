import fs from 'node:fs'
import path from 'node:path'
import { Categories, Database, extensionsInitializer, ExtensionsToCategories } from '@/db/schemas'
import { ExtensionWithCategories } from '@/features/extensions/db/schema'
import type { Kysely } from 'kysely'

// replace `any` with your database interface.
export async function seed(db: Kysely<Database>): Promise<void> {
  const dataPath = path.resolve(process.cwd(), './docs/data.json')
  const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  const uniqueCategoriesMap = new Map<string, { name: string; color: string }>()
  jsonData.forEach((item: ExtensionWithCategories) => {
    item.categories.forEach((category: Categories) => {
      const existingCategory = uniqueCategoriesMap.get(category.name)
      if (!existingCategory) {
        uniqueCategoriesMap.set(category.name, category)
      }
    })
  })

  const uniqueCategories = Array.from(uniqueCategoriesMap.values())

  await db.transaction().execute(async trx => {
    const insertedCategories = await trx
      .insertInto('categories')
      .values(uniqueCategories)
      .returning(['id', 'name'])
      .execute()

    const categoryIdMap = new Map(insertedCategories.map(c => [c.name, c.id]))
    const joinTableEntries: ExtensionsToCategories[] = []

    for (const item of jsonData) {
      const extensionData = {
        name: item.name,
        description: item.description,
        isActive: item.isActive,
        logo: item.logo.replace('./assets', '/assets'),
      }

      const validationRes = extensionsInitializer.safeParse(extensionData)

      if (!validationRes.success) {
        throw new Error('Invalid data found in JSON')
      }

      const insertedExtension = await trx
        .insertInto('extensions')
        .values(validationRes.data)
        .returning('id')
        .executeTakeFirstOrThrow(
          () => new Error(`Failed to insert extension or return ID for: ${item.name}`)
        )

      item.categories.forEach((category: Categories) => {
        const categoryId = categoryIdMap.get(category.name)
        if (categoryId) {
          joinTableEntries.push({ extensionId: insertedExtension.id, categoryId: categoryId })
        } else {
          console.warn('hello')
        }
      })
    }
    await trx.insertInto('extensionsToCategories').values(joinTableEntries).execute()
  })
}

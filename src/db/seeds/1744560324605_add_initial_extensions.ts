import fs from 'node:fs'
import path from 'node:path'
import { Database } from '@/db/schemas'
import { createExtension } from '@/features/extensions/api/create-extension'
import { Category, ExtensionWithCategories } from '@/features/extensions/db/schema'
import type { Kysely } from 'kysely'

// replace `any` with your database interface.
export async function seed(db: Kysely<Database>): Promise<void> {
  const dataPath = path.resolve(process.cwd(), './docs/data.json')
  const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  const uniqueCategoriesMap = new Map<string, { name: string; color: string }>()
  jsonData.forEach((item: ExtensionWithCategories) => {
    item.categories.forEach((category: Category) => {
      const existingCategory = uniqueCategoriesMap.get(category.name)
      if (!existingCategory) {
        uniqueCategoriesMap.set(category.name, category)
      }
    })
  })

  const uniqueCategories = Array.from(uniqueCategoriesMap.values())

  const insertedCategories = await db
    .insertInto('categories')
    .values(uniqueCategories)
    .returning(['id', 'name'])
    .execute()
  const categoryIdMap = new Map(insertedCategories.map(c => [c.name, c.id]))

  for (const item of jsonData) {
    const extensionData = {
      name: item.name,
      description: item.description,
      isActive: item.isActive,
      logo: item.logo.replace('./assets', '/assets'),
      categories: item.categories.map((category: Category) => categoryIdMap.get(category.name)),
    }
    await createExtension({ data: extensionData })
  }
}

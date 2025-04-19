import * as fs from 'node:fs'
import * as path from 'node:path'
import { db } from '@/db/db'
import { categories } from '@/db/schema'
import { insertExtension } from '@/features/extensions/db/insertions'
import {
  Category,
  createExtensionWithCategoriesSchema,
  ExtensionWithCategories,
} from '@/features/extensions/schemas'

async function seed() {
  // Path relative to "package.json"
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

  const insertedCategories = await db.insert(categories).values(uniqueCategories).returning({
    id: categories.id,
    name: categories.name,
  })
  const categoryIdMap = new Map(insertedCategories.map(c => [c.name, c.id]))

  for (const item of jsonData) {
    const extensionData = {
      name: item.name,
      description: item.description,
      isActive: item.isActive,
      logo: item.logo.replace('./assets', '/assets'),
      categories: item.categories.map((c: Category) => categoryIdMap.get(c.name)),
    }

    const validated = createExtensionWithCategoriesSchema.parse(extensionData)
    await insertExtension(validated)
  }
}

seed()
  .then(() => {
    console.log('Database seeded with extensions!')
    process.exit(0)
  })
  .catch(e => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })

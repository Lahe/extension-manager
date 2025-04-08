import * as fs from 'node:fs'
import * as path from 'node:path'
import { db } from '@/db/db'
import { categories, extensions, extensionsToCategories } from '@/db/schema'
import { createExtensionSchema, NewCategory, NewExtension } from '@/features/extensions/db/schema'

async function seed() {
  // Path relative to "package.json"
  const dataPath = path.resolve(process.cwd(), './docs/data.json')
  const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  const uniqueCategoriesMap = new Map<string, { name: string; color: string }>()
  jsonData.forEach((item: NewExtension) => {
    item.categories.forEach((category: NewCategory) => {
      const existingCategory = uniqueCategoriesMap.get(category.name)
      if (!existingCategory) {
        uniqueCategoriesMap.set(category.name, category)
      }
    })
  })

  const uniqueCategories = Array.from(uniqueCategoriesMap.values())

  await db.transaction(async trx => {
    const insertedCategories = await trx.insert(categories).values(uniqueCategories).returning({
      id: categories.id,
      name: categories.name,
    })

    const categoryIdMap = new Map(insertedCategories.map(c => [c.name, c.id]))
    const joinTableEntries: { extensionId: number; categoryId: number }[] = []

    for (const item of jsonData) {
      const extensionData = {
        name: item.name,
        description: item.description,
        isActive: item.isActive,
        logo: item.logo.replace('./assets', '/assets'),
      }

      const validationRes = createExtensionSchema.safeParse(extensionData)

      if (!validationRes.success) {
        throw new Error('Invalid data found in JSON')
      }

      const [insertedExtension] = await trx
        .insert(extensions)
        .values(validationRes.data)
        .returning({ id: extensions.id })

      if (!insertedExtension) {
        throw new Error(`Failed to insert extension: ${item.name}`)
      }

      item.categories.forEach((category: NewCategory) => {
        const categoryId = categoryIdMap.get(category.name)
        if (categoryId) {
          joinTableEntries.push({ extensionId: insertedExtension.id, categoryId: categoryId })
        } else {
          console.warn('hello')
        }
      })
    }
    await trx.insert(extensionsToCategories).values(joinTableEntries)
  })
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

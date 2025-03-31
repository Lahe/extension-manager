import * as fs from 'node:fs'
import * as path from 'node:path'
import { db } from '@/db/db'
import { CreateExtension, CreateExtensionSchema, Extensions } from '@/db/schema'

async function seed() {
  // Path relative to "package.json"
  const dataPath = path.resolve(path.resolve(), './docs/data.json')
  const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  const data = jsonData.map((item: CreateExtension) => ({
    ...item,
    logo: item.logo.replace('./assets', '/assets'),
  }))

  const validData = data.map((item: CreateExtension) => {
    const result = CreateExtensionSchema.safeParse(item)

    if (!result.success) {
      console.error('Invalid data:', item)
      console.error(result.error.format())
      throw new Error('Invalid data found in JSON')
    }
    return result.data
  })

  await db.insert(Extensions).values(validData)
}

seed()
  .then(() => console.log('Database seeded with extensions!'))
  .catch(e => {
    console.log(e)
    process.exit(1)
  })

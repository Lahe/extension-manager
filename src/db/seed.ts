import * as fs from 'node:fs'
import * as path from 'node:path'
import { db } from '@/db/db'
import { extensionsTable } from '@/db/schema'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

const extensionInsertSchema = createInsertSchema(extensionsTable)
type Extension = z.infer<typeof extensionInsertSchema>

export async function seed() {
  // Path relative to "package.json"
  const dataPath = path.resolve(path.resolve(), './docs/data.json')
  const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  const data = jsonData.map((item: Extension) => ({
    ...item,
    logo: item.logo.replace('./assets', '/assets'),
  }))

  const validData = data.map((item: Extension) => {
    const result = extensionInsertSchema.safeParse(item)

    if (!result.success) {
      console.error('Invalid data:', item)
      console.error(result.error.format())
      throw new Error('Invalid data found in JSON')
    }
    return result.data
  })

  await db.insert(extensionsTable).values(validData)
}

void seed()
  .then(() => console.log('Seeded'))
  .catch(e => {
    console.log(e)
    process.exit(1)
  })

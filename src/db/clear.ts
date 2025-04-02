import { db } from '@/db/db'
import { sql } from 'drizzle-orm'

async function clear() {
  const tablesSchema = db._.schema
  if (!tablesSchema) {
    throw new Error('No schema found')
  }
  const queries = Object.values(tablesSchema).map(table => {
    return sql.raw(`DELETE FROM ${table.dbName};`)
  })

  await db.transaction(async trx => {
    await Promise.all(
      queries.map(async query => {
        if (query) await trx.execute(query)
      })
    )
  })
}

clear()
  .then(() => {
    console.log('Database cleared')
    return
  })
  .catch(e => {
    console.log(e)
    process.exit(1)
  })

import { db } from '@/db/db'
import { reset } from 'drizzle-seed'

import * as schema from './schema'

async function clear() {
  await reset(db, schema)
}

clear()
  .then(() => {
    console.log('Database cleared')
    process.exit(0)
  })
  .catch(e => {
    console.log(e)
    process.exit(1)
  })

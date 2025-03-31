import { env } from '@/config/env'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import * as schema from './schema'

const pool = new Pool({
  connectionString: env.DATABASE_URL as string,
})

export const db = drizzle({ client: pool, schema, casing: 'snake_case' })

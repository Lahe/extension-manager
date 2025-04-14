import { env } from '@/config/env'
import { Database } from '@/db/schemas'
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: env.DATABASE_URL,
})

export const db = new Kysely<Database>({
  log: ['error'],
  dialect: new PostgresDialect({
    pool,
  }),
  plugins: [new CamelCasePlugin()],
})

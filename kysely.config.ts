import { db } from '@/db/db'
import { defineConfig } from 'kysely-ctl'

export default defineConfig({
  kysely: db,
  migrations: {
    migrationFolder: './src/db/migrations',
  },
  seeds: {
    seedFolder: './src/db/seeds',
  },
})

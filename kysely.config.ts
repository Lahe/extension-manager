import { fileURLToPath } from 'url'
import { createJiti } from 'jiti'
import { defineConfig } from 'kysely-ctl'

const moduleFileUrl = import.meta.url
const jiti = createJiti(fileURLToPath(moduleFileUrl), {
  alias: { '@': fileURLToPath(new URL('./src', moduleFileUrl)) },
})

const kysely = jiti('./src/db/db.ts')

export default defineConfig({
  kysely: kysely.db,
  migrations: {
    migrationFolder: './src/db/migrations',
  },
  seeds: {
    seedFolder: './src/db/seeds',
  },
})

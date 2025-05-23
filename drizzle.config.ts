import { env } from '@/config/env'
import { Config, defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema/index.ts',
  breakpoints: true,
  verbose: true,
  strict: true,
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} as Config)

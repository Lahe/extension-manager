// eslint-disable-next-line @typescript-eslint/no-require-imports
const { generateIndexFile, escapeIdentifier, resolveType } = require('kanel')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { kyselyCamelCaseHook, kyselyTypeFilter, makeKyselyHook } = require('kanel-kysely')
const {
  defaultGetZodIdentifierMetadata,
  defaultGetZodSchemaMetadata,
  defaultZodTypeMap,
  makeGenerateZodSchemas,
  zodCamelCaseHook,
  // eslint-disable-next-line @typescript-eslint/no-require-imports
} = require('kanel-zod')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { recase } = require('@kristiandupont/recase')

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config()

const toPascalCase = recase('snake', 'pascal')

const generateZodSchemas = makeGenerateZodSchemas({
  getZodSchemaMetadata: defaultGetZodSchemaMetadata,
  getZodIdentifierMetadata: defaultGetZodIdentifierMetadata,
  zodTypeMap: {
    ...defaultZodTypeMap,
    'pg_catalog.tsvector': 'z.set(z.string())',
    'pg_catalog.bytea': {
      name: 'z.custom<Bytea>(v => v)',
      typeImports: [{ name: 'Bytea', path: 'postgres-bytea', isAbsolute: true, isDefault: false }],
    },
  },
  castToSchema: false,
})

module.exports = {
  connection: process.env.DATABASE_URL,
  outputPath: './src/db/schemas',

  resolveViews: true,
  preDeleteOutputFolder: true,

  preRenderHooks: [
    makeKyselyHook(),
    kyselyCamelCaseHook,
    generateZodSchemas,
    zodCamelCaseHook,
    generateIndexFile,
  ],
  typeFilter: kyselyTypeFilter,

  generateIdentifierType: (column, details, config) => {
    const name = escapeIdentifier(toPascalCase(details.name) + toPascalCase(column.name))

    const configWithoutGenerateIdentifierType = { ...config }
    delete configWithoutGenerateIdentifierType.generateIdentifierType

    const innerType = resolveType(column, details, configWithoutGenerateIdentifierType)

    return {
      declarationType: 'typeDeclaration',
      name,
      exportAs: 'named',
      typeDefinition: [typeof innerType === 'string' ? innerType : innerType.name],
      typeImports: typeof innerType === 'string' ? [] : innerType.typeImports,
      comment: [`Identifier type for ${details.schemaName}.${details.name}`],
    }
  },

  customTypeMap: {
    // A text search vector could be stored as a set of strings. See Film.ts for an example.
    'pg_catalog.tsvector': 'Set<string>',

    // The bytea package (https://www.npmjs.com/package/postgres-bytea) could be used for byte arrays.
    // See Staff.ts for an example.
    'pg_catalog.bytea': {
      name: 'bytea',
      typeImports: [{ name: 'bytea', path: 'postgres-bytea', isAbsolute: true, isDefault: true }],
    },

    // If you want to use BigInt for bigserial columns, you can use the following.
    'pg_catalog.int8': 'BigInt',

    // Columns with the following types would probably just be strings in TypeScript.
    'pg_catalog.bpchar': 'string',
    'public.citext': 'string',
  },
}

import { Kysely, sql } from 'kysely'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('extensions')
    .addColumn('id', 'integer', col => col.generatedAlwaysAsIdentity().primaryKey())
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('description', 'text')
    .addColumn('logo', 'text', col => col.notNull())
    .addColumn('is_active', 'boolean', col => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamptz', col => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', col => col.notNull().defaultTo(sql`now()`))
    .execute()

  await db.schema
    .createTable('categories')
    .addColumn('id', 'integer', col => col.generatedAlwaysAsIdentity().primaryKey())
    .addColumn('name', 'text', col => col.notNull().unique())
    .addColumn('color', 'text', col => col.notNull())
    .addColumn('created_at', 'timestamptz', col => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', col => col.notNull().defaultTo(sql`now()`))
    .execute()

  await db.schema
    .createTable('extensions_to_categories')
    .addColumn('extension_id', 'integer', col =>
      col.references('extensions.id').onDelete('cascade').notNull()
    )
    .addColumn('category_id', 'integer', col =>
      col.references('categories.id').onDelete('cascade').notNull()
    )
    .addPrimaryKeyConstraint('extension_categories_pk', ['extension_id', 'category_id'])
    .execute()

  await db.schema
    .createIndex('idx_extensions_to_categories_extension_id')
    .on('extensions_to_categories')
    .column('extension_id')
    .execute()
  await db.schema
    .createIndex('idx_extensions_to_categories_category_id')
    .on('extensions_to_categories')
    .column('category_id')
    .execute()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('idx_extensions_to_categories_category_id').ifExists().execute()
  await db.schema.dropIndex('idx_extensions_to_categories_extension_id').ifExists().execute()

  await db.schema.dropTable('extensions_to_categories').execute()
  await db.schema.dropTable('categories').execute()
  await db.schema.dropTable('extensions').execute()
}

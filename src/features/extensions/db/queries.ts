import { db } from '@/db/db'
import { Category, ExtensionWithCategories } from '@/features/extensions/db/schema'
import { sql } from 'kysely'
import { jsonBuildObject } from 'kysely/helpers/postgres'

export async function getExtensionsWithCategories(): Promise<ExtensionWithCategories[]> {
  return await db
    .selectFrom('extensions')
    .select(['id', 'name', 'description', 'logo', 'isActive'])
    .select(eb =>
      eb.fn
        .coalesce(
          eb
            .selectFrom('categories as c')
            .innerJoin('extensionsToCategories as etc', 'etc.categoryId', 'c.id')
            .whereRef('etc.extensionId', '=', 'extensions.id')
            .select(({ fn, ref }) =>
              fn
                .jsonAgg(
                  jsonBuildObject({
                    id: ref('c.id'),
                    name: ref('c.name'),
                    color: ref('c.color'),
                  })
                )
                .orderBy('c.id')
                .as('aggregated_categories')
            ),
          sql<Category[]>`'[]'`
        )
        .as('categories')
    )
    .orderBy('extensions.id', 'desc')
    .execute()
}

export async function getExtensionWithCategoriesById(id: number): Promise<ExtensionWithCategories> {
  return await db
    .selectFrom('extensions')
    .select(['id', 'name', 'description', 'logo', 'isActive'])
    .select(eb =>
      eb.fn
        .coalesce(
          eb
            .selectFrom('categories as c')
            .innerJoin('extensionsToCategories as etc', 'etc.categoryId', 'c.id')
            .whereRef('etc.extensionId', '=', 'extensions.id')
            .select(({ fn, ref }) =>
              fn
                .jsonAgg(
                  jsonBuildObject({
                    id: ref('c.id'),
                    name: ref('c.name'),
                    color: ref('c.color'),
                  })
                )
                .orderBy('c.id')
                .as('aggregated_categories')
            ),
          sql<Category[]>`'[]'`
        )
        .as('categories')
    )
    .where('id', '=', id)
    .executeTakeFirstOrThrow()
}

export async function getCategories(): Promise<Category[]> {
  return await db.selectFrom('categories').selectAll().orderBy('name', 'asc').execute()
}

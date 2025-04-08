import { db } from '@/db/db'
import { extensions } from '@/db/schema'
import { Category, ExtensionWithCategories } from '@/features/extensions/db/schema'
import { notFound } from '@tanstack/react-router'
import { desc, eq } from 'drizzle-orm'

export async function getExtensionsWithCategories(): Promise<ExtensionWithCategories[]> {
  const result = await db.query.extensions.findMany({
    with: {
      extensionsToCategories: {
        with: {
          category: true,
        },
      },
    },
    orderBy: [desc(extensions.id)],
  })

  return result.map(ext => {
    const { extensionsToCategories, ...extensionData } = ext

    return {
      ...extensionData,
      categories: extensionsToCategories.map(etc => etc.category),
    }
  })
}

export async function getExtensionWithCategoriesById(id: number): Promise<ExtensionWithCategories> {
  const result = await db.query.extensions.findFirst({
    with: {
      extensionsToCategories: {
        with: {
          category: true,
        },
      },
    },
    where: eq(extensions.id, id),
  })

  if (!result) {
    throw notFound()
  }

  const { extensionsToCategories, ...extensionData } = result

  return {
    ...extensionData,
    categories: extensionsToCategories.map(etc => etc.category),
  }
}

export async function getCategories(): Promise<Category[]> {
  return db.query.categories.findMany()
}

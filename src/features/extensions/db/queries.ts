import { db } from '@/db/db'
import { Categories, CategoriesId, ExtensionsId } from '@/db/schemas'
import { ExtensionWithCategories } from '@/features/extensions/db/schema'

function shapeExtensionsWithCategories(
  rows: {
    extension_id: number
    extension_name: string
    extension_description: string | null
    extension_logo: string
    extension_is_active: boolean
    extension_created_at: Date
    extension_updated_at: Date
    // Add other extension fields if selected
    category_id: number | null // Nullable if using LEFT JOIN or if an extension has NO categories
    category_name: string | null
    category_color: string | null
    category_created_at: Date | null
    category_updated_at: Date | null
    // Add other category fields if selected
  }[]
): ExtensionWithCategories[] {
  const extensionsMap = new Map<number, ExtensionWithCategories>()

  for (const row of rows) {
    let extension = extensionsMap.get(row.extension_id)

    // If this is the first time we see this extension, create its entry
    if (!extension) {
      extension = {
        // Map fields from the row to the ExtensionWithCategories structure
        id: row.extension_id as ExtensionsId,
        name: row.extension_name,
        description: row.extension_description,
        logo: row.extension_logo,
        isActive: row.extension_is_active, // Match your type's casing (isActive vs is_active)
        createdAt: row.extension_created_at,
        updatedAt: row.extension_updated_at,
        // Initialize categories array
        categories: [],
        // Add other Extension fields if necessary
      }
      extensionsMap.set(row.extension_id, extension)
    }

    // If there's valid category data in this row, add it to the extension's categories list
    // Check for null in case of LEFT JOIN or extension without categories
    if (row.category_id !== null && row.category_name !== null && row.category_color !== null) {
      // Avoid adding duplicate categories if the query returns multiple identical category rows (though unlikely with this structure)
      if (!extension?.categories.some(cat => cat.id === row.category_id)) {
        extension.categories.push({
          id: row.category_id as CategoriesId,
          name: row.category_name,
          color: row.category_color,
          createdAt: row.category_created_at ?? new Date(),
          updatedAt: row.category_updated_at ?? new Date(),
          // Add other Category fields if necessary
        })
      }
    }
  }

  // Return the values from the map as an array
  return Array.from(extensionsMap.values())
}

export async function getExtensionsWithCategories(): Promise<ExtensionWithCategories[]> {
  const result = await db
    .selectFrom('extensions')
    .leftJoin('extensionsToCategories', 'extensionsToCategories.extensionId', 'extensionId')
    .leftJoin('categories', 'categoryId', 'extensionsToCategories.categoryId')
    .select([
      'extensions.id as extension_id',
      'extensions.name as extension_name',
      'extensions.description as extension_description',
      'extensions.logo as extension_logo',
      'extensions.isActive as extension_is_active',
      'extensions.createdAt as extension_created_at',
      'extensions.updatedAt as extension_updated_at',
      'categories.id as category_id',
      'categories.name as category_name',
      'categories.color as category_color',
      'categories.createdAt as category_created_at',
      'categories.updatedAt as category_updated_at',
    ])
    .orderBy('extensions.id', 'desc')
    .execute()

  return shapeExtensionsWithCategories(result)
}

export async function getExtensionWithCategoriesById(
  id: ExtensionsId
): Promise<ExtensionWithCategories> {
  const flatResult = await db
    .selectFrom('extensions')
    .leftJoin(
      // Use LEFT JOIN here too
      'extensionsToCategories',
      'extensionsToCategories.extensionId',
      'extensions.id'
    )
    .leftJoin('categories', 'categories.id', 'extensionsToCategories.categoryId')
    .where('extensions.id', '=', id) // Filter by the specific extension ID
    .select([
      'extensions.id as extension_id',
      'extensions.name as extension_name',
      'extensions.description as extension_description',
      'extensions.logo as extension_logo',
      'extensions.isActive as extension_is_active',
      'extensions.createdAt as extension_created_at',
      'extensions.updatedAt as extension_updated_at',
      'categories.id as category_id',
      'categories.name as category_name',
      'categories.color as category_color',
      'categories.createdAt as category_created_at',
      'categories.updatedAt as category_updated_at',
    ])
    // No need to order by ID here since we're filtering by it,
    // but ordering by category_id might be useful if needed for consistency
    // .orderBy('categories.id', 'asc')
    .execute()

  // If the query returns no rows, the extension wasn't found
  if (flatResult.length === 0) {
    throw new Error(`Extension with id ${id} not found.`)
  }

  // Shape the potentially multiple rows (one per category) for the single extension
  // The shape helper expects an array, and it will correctly group for the single ID
  const shapedResult = shapeExtensionsWithCategories(flatResult)

  // Since we filtered by ID and checked for empty, there should be exactly one extension
  return shapedResult[0]
}

export async function getCategories(): Promise<Categories[]> {
  // Use the DB type directly if your Category application type matches exactly
  // Otherwise, select specific columns if your app 'Category' type differs
  // Kysely returns results matching the DB structure.
  // If your application `Category` type matches the DB `Category` type (id, name, color),
  // this should work directly. If not, you might need a .map() here.
  return await db
    .selectFrom('categories')
    .selectAll() // Select all columns from the categories table
    .orderBy('categories.name', 'asc') // Optional: Add consistent ordering
    .execute() // Cast or map if needed
}

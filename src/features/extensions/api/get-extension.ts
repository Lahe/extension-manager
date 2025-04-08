import { getExtensionWithCategoriesById } from '@/features/extensions/db/queries'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

export const fetchExtension = createServerFn({ method: 'GET' })
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    console.info('Fetching extension with id', id)
    return getExtensionWithCategoriesById(id)
  })

export const extensionQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['extension', id],
    queryFn: () => fetchExtension({ data: id }),
  })

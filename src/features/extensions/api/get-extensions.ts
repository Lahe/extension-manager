import { getExtensionsWithCategories } from '@/features/extensions/db/queries'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

export const fetchExtensions = createServerFn({ method: 'GET' }).handler(async () => {
  console.info('Fetching extensions')
  return getExtensionsWithCategories()
})

export const extensionsQueryOptions = () =>
  queryOptions({
    queryKey: ['extensions'],
    queryFn: fetchExtensions,
  })

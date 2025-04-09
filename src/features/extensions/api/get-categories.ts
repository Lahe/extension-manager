import { getCategories } from '@/features/extensions/db/queries'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

export const fetchCategories = createServerFn({ method: 'GET' }).handler(async () => {
  return getCategories()
})

export const categoriesQueryOptions = () =>
  queryOptions({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

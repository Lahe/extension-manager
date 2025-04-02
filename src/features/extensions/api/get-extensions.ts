import { getExtensionById, getExtensions } from '@/features/extensions/db/queries'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

export const fetchExtensions = createServerFn({ method: 'GET' }).handler(async () => {
  console.info('Fetching extensions')
  return getExtensions()
})

export const extensionsQueryOptions = () =>
  queryOptions({
    queryKey: ['extensions'],
    queryFn: fetchExtensions,
  })

export const fetchExtension = createServerFn({ method: 'GET' })
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    console.info('Fetching extension with id', id)
    return getExtensionById(id)
  })

export const extensionQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['extension', id],
    queryFn: () => fetchExtension({ data: id }),
  })

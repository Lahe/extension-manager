import { categoriesQueryOptions } from '@/features/extensions/api/get-categories'
import { extensionQueryOptions } from '@/features/extensions/api/get-extension'
import { UpdateExtension } from '@/features/extensions/components/update-extension'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { z } from 'zod'

const params = z.object({
  extId: z.coerce.number().int().positive('Extension ID must be a positive integer'),
})

export const Route = createFileRoute('/(app)/extensions/$extId_/edit')({
  component: RouteComponent,
  params: {
    parse: rawParams => {
      try {
        return params.parse(rawParams)
      } catch {
        throw notFound()
      }
    },
  },
  loader: async ({ params, context }) => {
    const extension = context.queryClient.ensureQueryData(extensionQueryOptions(params.extId))
    const categories = context.queryClient.ensureQueryData(categoriesQueryOptions())
    await Promise.all([extension, categories])
  },
  pendingComponent: () => <div>Loading...</div>,
  notFoundComponent: () => <div>Extension not found!</div>,
  wrapInSuspense: true,
})

function RouteComponent() {
  return <UpdateExtension />
}

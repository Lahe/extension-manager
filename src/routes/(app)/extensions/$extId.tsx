import { extensionQueryOptions } from '@/features/extensions/api/get-extension'
import { ExtensionView } from '@/features/extensions/components/extension-view'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { z } from 'zod'

const params = z.object({
  extId: z.coerce.number().int().positive('Extension ID must be a positive integer'),
})

export const Route = createFileRoute('/(app)/extensions/$extId')({
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
  loader: ({ params, context }) => {
    context.queryClient.ensureQueryData(extensionQueryOptions(params.extId))
  },
  head: () => ({
    meta: [{ title: 'Extension Details' }],
  }),
  notFoundComponent: () => <div>Extension not found!</div>,
  wrapInSuspense: true,
})

function RouteComponent() {
  return <ExtensionView />
}

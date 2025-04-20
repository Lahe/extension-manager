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
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(extensionQueryOptions(params.extId))
    return {
      title: `Extension - ${data.name}`,
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: loaderData.title }] : undefined,
  }),
  notFoundComponent: () => <div>Extension not found!</div>,
  wrapInSuspense: true,
})

function RouteComponent() {
  return <ExtensionView />
}

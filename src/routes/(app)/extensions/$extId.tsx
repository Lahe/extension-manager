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
  notFoundComponent: () => <div>Extension not found!</div>,
})

function RouteComponent() {
  const { extId } = Route.useParams()
  return <ExtensionView id={extId} />
}

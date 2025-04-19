import { categoriesQueryOptions } from '@/features/extensions/api/get-categories'
import { CreateExtension } from '@/features/extensions/components/create-extension'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/extensions/new')({
  component: RouteComponent,
  loader: async ({ context }) => context.queryClient.ensureQueryData(categoriesQueryOptions()),
})

function RouteComponent() {
  return <CreateExtension />
}

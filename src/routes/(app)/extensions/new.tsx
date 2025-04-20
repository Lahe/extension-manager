import { categoriesQueryOptions } from '@/features/extensions/api/get-categories'
import { CreateExtension } from '@/features/extensions/components/create-extension'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/extensions/new')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/login' })
    }
  },
  loader: async ({ context }) => context.queryClient.ensureQueryData(categoriesQueryOptions()),
})

function RouteComponent() {
  return <CreateExtension />
}

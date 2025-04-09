import { CreateExtension } from '@/features/extensions/components/create-extension'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/extensions/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CreateExtension />
}

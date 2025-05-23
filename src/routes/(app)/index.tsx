import { extensionsQueryOptions } from '@/features/extensions/api/get-extensions'
import { ExtensionList } from '@/features/extensions/components/extension-list'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/')({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(extensionsQueryOptions())
  },
  head: () => ({
    meta: [{ title: 'Extensions' }],
  }),
  component: ExtensionsPage,
  wrapInSuspense: true,
})

function ExtensionsPage() {
  return <ExtensionList />
}

import { extensionsQueryOptions } from '@/features/extensions/api/get-extensions'
import { ExtensionList } from '@/features/extensions/components/extension-list'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(extensionsQueryOptions())
  },
  head: () => ({
    meta: [{ title: 'Extensions' }],
  }),
  component: ExtensionsPage,
})

function ExtensionsPage() {
  return (
    <div className="flex flex-grow justify-center">
      <ExtensionList />
    </div>
  )
}

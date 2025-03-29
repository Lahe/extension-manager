import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, ErrorComponent, type ErrorComponentProps } from '@tanstack/react-router'

import { NotFound } from '../../src/components/errors/not-found.tsx'
import { userQueryOptions } from './utils/users.tsx'

export const Route = createFileRoute('/old/users/$userId')({
  loader: async ({ context, params: { userId } }) => {
    await context.queryClient.ensureQueryData(userQueryOptions(userId))
  },
  errorComponent: UserErrorComponent,
  component: UserComponent,
  notFoundComponent: () => {
    return <NotFound>User not found</NotFound>
  },
})

export function UserErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />
}

function UserComponent() {
  const params = Route.useParams()
  const userQuery = useSuspenseQuery(userQueryOptions(params.userId))
  const user = userQuery.data

  return (
    <div className="space-y-2">
      <h4 className="text-xl font-bold underline">{user.name}</h4>
      <div className="text-sm">{user.email}</div>
    </div>
  )
}

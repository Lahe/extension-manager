import { auth } from '@/lib/auth'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getWebRequest } from '@tanstack/react-start/server'

export const getUser = createServerFn({ method: 'GET' }).handler(async () => {
  const { headers } = getWebRequest()!
  const session = await auth.api.getSession({ headers })

  return session?.user || null
})

export const userQueryOptions = () =>
  queryOptions({
    queryKey: ['user'],
    queryFn: getUser,
  })

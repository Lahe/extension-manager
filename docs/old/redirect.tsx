import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/old/redirect')({
  beforeLoad: async () => {
    throw redirect({
      to: '/posts',
    })
  },
})

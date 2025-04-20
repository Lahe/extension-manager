import { SignUp } from '@/features/auth/components/sign-up'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SignUp />
    </div>
  )
}

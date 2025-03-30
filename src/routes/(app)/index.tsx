import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex flex-grow flex-col gap-4 p-6">
      <h1 className="text-4xl font-bold">Extensions Manager</h1>
      <div className="flex items-center gap-2">Welcome to extension manager home!</div>
      <div className="flex flex-col gap-2">
        <p>You are not signed in.</p>
        <Button type="button" asChild className="w-fit" size="lg">
          <Link to="/">Home</Link>
        </Button>
      </div>
    </div>
  )
}

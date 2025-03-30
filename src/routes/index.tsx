import ThemeToggle from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-4xl font-bold">React TanStarter</h1>
      <div className="flex items-center gap-2">
        This is an unprotected page:
        <pre className="bg-card text-card-foreground rounded-md border p-1">routes/index.tsx</pre>
      </div>
      <div className="flex flex-col gap-2">
        <p>You are not signed in.</p>
        <Button type="button" asChild className="w-fit" size="lg">
          <Link to="/">Home</Link>
        </Button>
      </div>
      <ThemeToggle />
    </div>
  )
}

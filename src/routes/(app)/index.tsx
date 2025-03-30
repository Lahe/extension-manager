import { Extensions } from '@/routes/(app)/-components/extensions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex flex-grow justify-center">
      <Extensions />
    </div>
  )
}

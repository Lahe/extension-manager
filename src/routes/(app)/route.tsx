import { Footer } from '@/routes/(app)/-components/footer'
import { Header } from '@/routes/(app)/-components/header'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)')({
  component: AppLayout,
})

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

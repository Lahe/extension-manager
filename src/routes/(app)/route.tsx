import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)')({
  component: AppLayout,
})

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-grow justify-center">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

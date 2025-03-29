import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/old/_pathlessLayout')({
  component: PathlessLayoutComponent,
})

function PathlessLayoutComponent() {
  return (
    <div className="p-2">
      <div>I'm a pathless layout</div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}

import { Route as aboutRoute } from '@/routes/about'
import { Route as rootRoute } from '@/routes/index'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex gap-2 p-2">
        <Link to={rootRoute.to} className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to={aboutRoute.to} className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})

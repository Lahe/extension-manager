import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/old/posts/')({
  component: PostsIndexComponent,
})

function PostsIndexComponent() {
  return <div>Select a post.</div>
}

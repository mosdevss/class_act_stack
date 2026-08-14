import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <h1>Where do we go from here</h1>
    <p>is it a feasible option</p>
  </div>
}

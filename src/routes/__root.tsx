import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'

import '../styles/styles.scss'
import NotFound from '../components/NotFound'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: '/fonts/inter-variable.woff2',
        crossOrigin: 'anonymous',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Link to='/'>Home</Link>
        <Link to='/about'>About</Link>
        <Link to='/contact'>Contact</Link>
        {children}

        <Scripts />
      </body>
    </html>
  )
}

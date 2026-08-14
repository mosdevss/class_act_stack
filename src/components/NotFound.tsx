export default function NotFound() {
  return (
    <main className="not-found">
      <h1 className="not-found__title">Page not found</h1>
      <p className="not-found__message">
        Sorry, the page you are looking for does not exist or has moved.
      </p>
      <a className="not-found__link" href="/">
        Back to home
      </a>
    </main>
  )
}

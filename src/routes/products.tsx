import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { fetchProductBySlug, fetchProductList, type Product } from '../data/products'

export const Route = createFileRoute('/products')({
  component: ProductsPage,
})

const list = fetchProductList()

function ProductsPage() {
  const [activeSlug, setActiveSlug] = useState(list[0].slug)
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    fetchProductBySlug(activeSlug).then((data) => {
      if (!cancelled) {
        setProduct(data)
        setIsLoading(false)
      }
    })

    return () => {
      cancelled = true // avoids setting state from a stale request
    }
  }, [activeSlug])

  return (
    <div>
      <div className="tabs">
        {list.map((p) => (
          <button
            key={p.slug}
            onClick={() => setActiveSlug(p.slug)}
            className={`button ${activeSlug === p.slug ? 'active' : ''}`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="panel">
        {isLoading || !product ? (
          <p>Loading…</p>
        ) : (
          <>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>{product.description}</p>
          </>
        )}
      </div>
    </div>
  )
}

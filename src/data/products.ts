export interface Product {
  slug: string
  name: string
  price: number
  description: string
}

export const products: Product[] = [
  {
    slug: 'wireless-mouse',
    name: 'Wireless Mouse',
    price: 29.99,
    description: 'A smooth, reliable wireless mouse for everyday use.',
  },
  {
    slug: 'mechanical-keyboard',
    name: 'Mechanical Keyboard',
    price: 89.99,
    description: 'Tactile mechanical switches built for long typing sessions.',
  },
  {
    slug: 'usb-hub',
    name: 'USB Hub',
    price: 19.99,
    description: 'A compact 4-port USB hub for expanding your connections.',
  },
]

export async function fetchProductBySlug(slug: string): Promise<Product> {
  // stand-in for a real fetch() to an external API — swap the body
  // for `await fetch(...).then(r => r.json())` when you have a real endpoint
  await new Promise((r) => setTimeout(r, 200))

  const product = products.find((p) => p.slug === slug)
  if (!product) {
    throw new Error(`No product found for slug "${slug}"`)
  }
  return product
}

export function fetchProductList(): Pick<Product, 'slug' | 'name'>[] {
  return products.map(({ slug, name }) => ({ slug, name }))
}

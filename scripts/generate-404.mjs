import { promises as fs } from 'node:fs'
import { join } from 'node:path'

const clientDir = join(process.cwd(), 'dist', 'client')
const src = join(clientDir, '404', 'index.html')
const dest = join(clientDir, '404.html')

try {
  await fs.copyFile(src, dest)
  console.log('Copied dist/client/404/index.html -> dist/client/404.html')
} catch {
  console.error(
    'Could not copy 404 page. Expected prerendered file at dist/client/404/index.html.'
  )
  process.exitCode = 1
}

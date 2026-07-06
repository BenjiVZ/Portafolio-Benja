// Optimiza las imágenes de public/media en sitio:
// redimensiona a un ancho máximo y recomprime (PNG con paleta, JPEG mozjpeg).
// Uso: node scripts/optimize-images.mjs
import sharp from 'sharp'
import { readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

// En Windows la caché de sharp mantiene abierto el archivo de entrada
// e impide sobreescribirlo en sitio.
sharp.cache(false)

const ROOT = 'public/media'
const MAX_WIDTH = 1400

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

let totalBefore = 0
let totalAfter = 0

for await (const file of walk(ROOT)) {
  const ext = path.extname(file).toLowerCase()
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue

  const before = (await stat(file)).size
  const meta = await sharp(file).metadata()

  let pipeline = sharp(file).rotate()
  if (meta.width > MAX_WIDTH) pipeline = pipeline.resize({ width: MAX_WIDTH })

  const buffer = ext === '.png'
    ? await pipeline.png({ palette: true, quality: 90, compressionLevel: 9 }).toBuffer()
    : await pipeline.jpeg({ quality: 80, mozjpeg: true }).toBuffer()

  totalBefore += before
  if (buffer.length < before) {
    await writeFile(file, buffer)
    totalAfter += buffer.length
    console.log(`${file}: ${(before / 1024).toFixed(0)} KB -> ${(buffer.length / 1024).toFixed(0)} KB`)
  } else {
    totalAfter += before
  }
}

console.log(`\nTotal: ${(totalBefore / 1048576).toFixed(1)} MB -> ${(totalAfter / 1048576).toFixed(1)} MB`)

/**
 * Genera los PNG del ícono a partir del SVG de `icono-app.mjs`.
 *
 * Usa el Chromium de Playwright, que ya está instalado para los tests, en vez
 * de sumar `sharp` o `canvas` (binarios nativos) solo para esto. Se corre a
 * mano cuando cambia el ícono: `npm run iconos`.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import { iconoSvg } from './icono-app.mjs'

const PUBLIC = fileURLToPath(new URL('../public/', import.meta.url))

/** Qué pide cada plataforma. */
const PIEZAS = [
  // manifest: el chico para la lista de apps, el grande para splash e installers
  { archivo: 'icono-192.png', tam: 192, opciones: {} },
  { archivo: 'icono-512.png', tam: 512, opciones: {} },
  // Android recorta a un círculo del 80 %: variante con el dibujo más adentro
  { archivo: 'icono-maskable-512.png', tam: 512, opciones: { maskable: true } },
  // iOS no usa el manifest para el ícono: lee apple-touch-icon y le aplica su
  // propia máscara redondeada, así que va a sangre y opaco (sin transparencia)
  { archivo: 'apple-touch-icon.png', tam: 180, opciones: {} },
]

const navegador = await chromium.launch()
const pagina = await navegador.newPage({ deviceScaleFactor: 1 })

await mkdir(PUBLIC, { recursive: true })

for (const { archivo, tam, opciones } of PIEZAS) {
  const svg = iconoSvg(opciones)
  await pagina.setViewportSize({ width: tam, height: tam })
  await pagina.setContent(
    `<style>html,body{margin:0;padding:0}svg{display:block;width:${tam}px;height:${tam}px}</style>${svg}`,
  )
  const png = await pagina.locator('svg').screenshot({ omitBackground: false })
  await writeFile(new URL(archivo, `file://${PUBLIC}`), png)
  console.log(`✓ ${archivo} — ${tam}×${tam} (${(png.length / 1024).toFixed(1)} KB)`)
}

// El favicon va como SVG: escala solo y pesa 700 bytes. Con esquinas
// redondeadas porque en la pestaña se ve suelto, sin máscara del sistema.
await writeFile(new URL('icono.svg', `file://${PUBLIC}`), iconoSvg({ radio: 22 }))
console.log('✓ icono.svg')

await navegador.close()

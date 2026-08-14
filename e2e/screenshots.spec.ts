import { test } from '@playwright/test'
import { mkdirSync } from 'node:fs'

// Screenshots por pantalla para revisión visual de cada fase.
// Salida: e2e/shots/<fase>/<pantalla>.png  (npm run shots)

const FASE = process.env.FASE ?? 'fase-1'
const DIR = `e2e/shots/${FASE}`

const PANTALLAS: Array<{ nombre: string; ruta: string; fullPage?: boolean }> = [
  { nombre: 'hoy-vacio', ruta: '/#/hoy' },
  { nombre: 'explorar-shell', ruta: '/#/explorar' },
  { nombre: 'calendario-shell', ruta: '/#/calendario' },
  { nombre: 'huerta-vacia', ruta: '/#/huerta' },
  { nombre: 'glosario', ruta: '/#/glosario', fullPage: true },
  { nombre: 'ajustes-shell', ruta: '/#/ajustes' },
]

test.beforeAll(() => {
  mkdirSync(DIR, { recursive: true })
})

for (const { nombre, ruta, fullPage } of PANTALLAS) {
  test(`captura ${nombre}`, async ({ page }) => {
    await page.goto(ruta)
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(650) // animaciones de aparición
    await page.screenshot({ path: `${DIR}/${nombre}.png`, fullPage })
  })
}

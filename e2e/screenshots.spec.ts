import { test } from '@playwright/test'
import { mkdirSync } from 'node:fs'

// Screenshots por pantalla para revisión visual de cada fase.
// Salida: e2e/shots/<fase>/<pantalla>.png  (npm run shots)

const FASE = process.env.FASE ?? 'fase-2'
const DIR = `e2e/shots/${FASE}`

interface Toma {
  nombre: string
  ruta: string
  fullPage?: boolean
  /** interacción previa a la captura */
  antes?: (page: import('@playwright/test').Page) => Promise<void>
}

const TOMAS: Toma[] = [
  { nombre: 'explorar', ruta: '/#/explorar' },
  {
    nombre: 'explorar-filtrado',
    ruta: '/#/explorar',
    antes: async (page) => {
      await page.getByRole('button', { name: 'Se siembra ahora' }).click()
      await page.getByRole("button", { name: /^Filtros/ }).click()
      await page.getByRole("button", { name: /Aromática/ }).click()
    },
  },
  {
    nombre: 'explorar-busqueda',
    ruta: '/#/explorar',
    antes: async (page) => {
      await page.getByRole('searchbox').fill('morrón')
    },
  },
  {
    nombre: 'explorar-sin-resultados',
    ruta: '/#/explorar',
    antes: async (page) => {
      await page.getByRole('searchbox').fill('palta')
    },
  },
  { nombre: 'ficha-tomate', ruta: '/#/explorar/tomate', fullPage: true },
  { nombre: 'ficha-kale', ruta: '/#/explorar/kale', fullPage: true },
  { nombre: 'ficha-lavanda', ruta: '/#/explorar/lavanda', fullPage: true },
  { nombre: 'hoy-vacio', ruta: '/#/hoy' },
  { nombre: 'huerta-vacia', ruta: '/#/huerta' },
  { nombre: 'glosario', ruta: '/#/glosario', fullPage: true },
]

test.beforeAll(() => {
  mkdirSync(DIR, { recursive: true })
})

for (const { nombre, ruta, fullPage, antes } of TOMAS) {
  test(`captura ${nombre}`, async ({ page }) => {
    await page.goto(ruta)
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => document.fonts.ready)
    if (antes) {
      await antes(page)
      await page.waitForTimeout(250)
    }
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${DIR}/${nombre}.png`, fullPage })
  })
}

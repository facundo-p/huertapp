import { test } from '@playwright/test'
import { mkdirSync } from 'node:fs'

// Screenshots por pantalla para revisión visual de cada fase.
// Salida: e2e/shots/<fase>/<pantalla>.png  (npm run shots)

const FASE = process.env.FASE ?? 'fase-4'
const DIR = `e2e/shots/${FASE}`

interface Toma {
  nombre: string
  ruta: string
  fullPage?: boolean
  /** interacción previa a la captura */
  antes?: (page: import('@playwright/test').Page) => Promise<void>
}

/** Cada test corre en un contexto nuevo: IndexedDB arranca vacía siempre. */
async function conDemo(page: import('@playwright/test').Page) {
  await page.goto('/#/ajustes')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: /Cargar huerta de ejemplo/ }).click()
  await page.waitForTimeout(800)
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
  { nombre: 'calendario', ruta: '/#/calendario' },
  {
    nombre: 'calendario-trasplante',
    ruta: '/#/calendario',
    antes: async (page) => {
      await page.getByRole('button', { name: 'Trasplante' }).click()
    },
  },
  {
    nombre: 'calendario-filtrado',
    ruta: '/#/calendario',
    antes: async (page) => {
      await page.getByRole('button', { name: 'Hortaliza de fruto' }).click()
    },
  },
  {
    nombre: 'calendario-hoja',
    ruta: '/#/calendario',
    antes: async (page) => {
      await page.getByRole('button', { name: /^Tomate:/ }).click()
    },
  },
  { nombre: 'calendario-completo', ruta: '/#/calendario', fullPage: true },
  { nombre: 'ajustes-zona', ruta: '/#/ajustes' },
  {
    nombre: 'calendario-zona-periurbano',
    ruta: '/#/ajustes',
    antes: async (page) => {
      await page.getByRole('radio', { name: /Periurbano/ }).click()
      await page.goto('/#/calendario')
      await page.waitForLoadState('networkidle')
    },
  },
  { nombre: 'hoy-vacio', ruta: '/#/hoy' },
  { nombre: 'huerta-vacia', ruta: '/#/huerta' },
  { nombre: 'ajustes-backup', ruta: '/#/ajustes' },
  {
    nombre: 'huerta-llena',
    ruta: '/#/ajustes',
    antes: async (page) => {
      await conDemo(page)
      await page.goto('/#/huerta')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(400)
    },
  },
  {
    nombre: 'planta-detalle',
    ruta: '/#/huerta',
    fullPage: true,
    antes: async (page) => {
      await conDemo(page)
      await page.goto('/#/huerta')
      await page.waitForLoadState('networkidle')
      await page.getByRole('link', { name: /Los del cajón/ }).click()
      await page.waitForTimeout(600)
    },
  },
  {
    nombre: 'alta-planta',
    ruta: '/#/explorar/rucula',
    antes: async (page) => {
      await page.getByRole('button', { name: /Agregar a mi huerta/ }).click()
      await page.waitForTimeout(400)
    },
  },
  {
    nombre: 'diario-nueva-entrada',
    ruta: '/#/huerta',
    antes: async (page) => {
      await conDemo(page)
      await page.goto('/#/huerta')
      await page.waitForLoadState('networkidle')
      await page.getByRole('link', { name: /Los del cajón/ }).click()
      await page.waitForTimeout(400)
      await page.getByRole('button', { name: /Anotar/ }).click()
      await page.waitForTimeout(400)
    },
  },
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

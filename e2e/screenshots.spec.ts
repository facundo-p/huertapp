import { test } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'

// Screenshots por pantalla para revisión visual de cada fase.
// Salida: e2e/shots/<fase>/<pantalla>.png  (npm run shots)

const FASE = process.env.FASE ?? 'fase-6'
const DIR = `e2e/shots/${FASE}`
const SW = 'dist/sw.js'

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
  // la única con los dos vacíos a la vez: cosecha y temperatura en "s/d".
  { nombre: 'ficha-melisa', ruta: '/#/explorar/melisa', fullPage: true },
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
  {
    nombre: 'hoy-con-tareas',
    ruta: '/#/hoy',
    fullPage: true,
    antes: async (page) => {
      await conDemo(page)
      await page.goto('/#/hoy')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500)
    },
  },
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
    // los dos estados nuevos en la misma toma: una tarjeta abierta y un lugar
    // cerrado que igual muestra que algo pide atención
    nombre: 'huerta-plegada',
    ruta: '/#/ajustes',
    antes: async (page) => {
      await conDemo(page)
      await page.goto('/#/huerta')
      await page.waitForLoadState('networkidle')
      await page.getByRole('button', { name: /Ver el detalle de Albahaca/ }).click()
      await page.getByRole('button', { name: /^Bancal del fondo/ }).click()
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
    nombre: 'germinacion-demorada',
    ruta: '/#/huerta',
    fullPage: true,
    antes: async (page) => {
      await conDemo(page)
      await page.goto('/#/huerta')
      await page.waitForLoadState('networkidle')
      await page.getByRole('link', { name: /Zanahoria/ }).click()
      await page.waitForTimeout(400)
      await page.getByRole('button', { name: /Por qué puede estar tardando/ }).click()
      await page.waitForTimeout(300)
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
  // el glosario entero es larguísimo; estas dos son las que hay que mirar
  { nombre: 'glosario-labores', ruta: '/#/glosario#labor-raleo' },
  {
    nombre: 'glosario-tierra',
    ruta: '/#/glosario',
    antes: async (page) => {
      // 'start' y no scrollIntoViewIfNeeded: el bloque ya es más alto que la
      // pantalla, y "si hace falta" lo deja alineado por abajo — la captura
      // terminaba cortando justo la receta, que es lo que se viene a mirar.
      await page.locator('.glosario__tierra').evaluate((el) => el.scrollIntoView({ block: 'start' }))
      await page.waitForTimeout(300)
    },
  },
  {
    nombre: 'ajustes-instalar',
    ruta: '/#/ajustes',
    antes: async (page) => {
      await page.locator('.pasos').scrollIntoViewIfNeeded()
    },
  },
  {
    nombre: 'ajustes-avisos',
    ruta: '/#/ajustes',
    antes: async (page) => {
      // Chromium bajo Playwright arranca con las notificaciones denegadas, y
      // así la sección muestra el cartel de "las bloqueaste". Se conceden para
      // capturar el camino normal, que es el que hay que mirar.
      await page.context().grantPermissions(['notifications'])
      await page.reload()
      await page.waitForLoadState('networkidle')
      await page.getByRole('heading', { name: 'Avisos' }).scrollIntoViewIfNeeded()
    },
  },
  {
    nombre: 'aviso-actualizacion',
    ruta: '/#/hoy',
    // se publica un deploy nuevo de verdad y se espera a que la app lo ofrezca
    antes: async (page) => {
      // predicado síncrono: waitForFunction no espera funciones async, le llega
      // una Promise pendiente (truthy) y da la condición por cumplida al toque
      await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, {
        timeout: 20_000,
      })
      const original = await readFile(SW, 'utf8')
      try {
        await writeFile(SW, original.replace(/const VERSION = '\w+'/, "const VERSION = 'proxima00'"))
        await page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.update())
        await page.getByText('Hay una versión nueva.').waitFor({ timeout: 20_000 })
      } finally {
        await writeFile(SW, original)
      }
    },
  },
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

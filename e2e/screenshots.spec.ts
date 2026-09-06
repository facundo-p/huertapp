import { test } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { conHelada, fixtureDesdeHoy } from './apoyo-pronostico'

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

/**
 * La tanda dividida de la demo repite el apodo en dos lugares: el link a una
 * planta hay que buscarlo dentro de su sección, no en la pantalla entera.
 */
function linkEnSeccion(
  page: import('@playwright/test').Page,
  seccion: RegExp,
  nombre: RegExp,
) {
  return page
    .locator('section', { has: page.getByRole('button', { name: seccion }) })
    .getByRole('link', { name: nombre })
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
    nombre: 'explorar-filtro-temperatura',
    ruta: '/#/explorar',
    antes: async (page) => {
      await page.getByRole("button", { name: /^Filtros/ }).click()
      await page.getByRole('button', { name: /Necesita calor para germinar/ }).click()
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
  // la especie con más variedades, para ver la sección con tres tarjetas
  { nombre: 'ficha-zanahoria', ruta: '/#/explorar/zanahoria', fullPage: true },
  // la derivada que más difiere: calendario propio y días propios
  { nombre: 'ficha-coliflor-temprana', ruta: '/#/explorar/coliflor-temprana', fullPage: true },
  // la que se define por lo que NO lleva: sin tutorado ni poda
  { nombre: 'ficha-tomate-determinado', ruta: '/#/explorar/tomate-determinado', fullPage: true },
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
      await linkEnSeccion(page, /Macetas del balcón/, /Los del cajón/).click()
      await page.waitForTimeout(600)
    },
  },
  {
    // la otra punta de la tanda dividida: la parte que ya está en el bancal,
    // con su "Vienen de..." en el diario y el link de vuelta al almácigo
    nombre: 'detalle-parte-trasplantada',
    ruta: '/#/huerta',
    fullPage: true,
    antes: async (page) => {
      await conDemo(page)
      await page.goto('/#/huerta')
      await page.waitForLoadState('networkidle')
      await linkEnSeccion(page, /Bancal del fondo/, /Los del cajón/).click()
      await page.waitForTimeout(600)
    },
  },
  {
    nombre: 'trasplantar-hoja',
    ruta: '/#/huerta',
    antes: async (page) => {
      await conDemo(page)
      await page.goto('/#/huerta')
      await page.waitForLoadState('networkidle')
      await linkEnSeccion(page, /Macetas del balcón/, /Los del cajón/).click()
      await page.waitForTimeout(400)
      await page.getByRole('button', { name: /La trasplanté/ }).click()
      await page.waitForTimeout(300)
      await page.getByRole('button', { name: 'Una parte' }).click()
      await page.waitForTimeout(300)
    },
  },
  {
    nombre: 'cantidad-hoja',
    ruta: '/#/huerta',
    antes: async (page) => {
      await conDemo(page)
      await page.goto('/#/huerta')
      await page.waitForLoadState('networkidle')
      await linkEnSeccion(page, /Bancal del fondo/, /Rúcula/).click()
      await page.waitForTimeout(400)
      await page.getByRole('button', { name: /cambiar la cuenta/ }).click()
      await page.waitForTimeout(300)
    },
  },
  {
    // la ficha del lugar en edición: el bancal de la demo trae medidas y el
    // volumen calculado, que es lo que hay que mirar
    nombre: 'lugar-editar',
    ruta: '/#/huerta',
    antes: async (page) => {
      await conDemo(page)
      await page.goto('/#/huerta')
      await page.waitForLoadState('networkidle')
      await page.getByRole('button', { name: 'Editar Bancal del fondo' }).click()
      await page.locator('dialog.hoja[open]').waitFor()
    },
  },
  {
    // "un lugar nuevo" desde el alta: la ficha se apila sobre la hoja del alta
    nombre: 'lugar-nuevo-desde-alta',
    ruta: '/#/explorar/rucula',
    antes: async (page) => {
      await page.getByRole('button', { name: /Agregar a mi huerta/ }).click()
      await page.waitForTimeout(400)
      await page.locator('#alta-ubi').selectOption('__nueva')
      await page.getByRole('heading', { name: 'Un lugar nuevo' }).waitFor()
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
    // el alta de una especie con variedades: el paso que hace que los avisos
    // salgan por la que plantaste y no por la especie
    nombre: 'alta-planta-variedad',
    ruta: '/#/explorar/coliflor',
    antes: async (page) => {
      await page.getByRole('button', { name: /Agregar a mi huerta/ }).click()
      await page.waitForTimeout(400)
    },
  },
  {
    // la matriz con una especie desplegada en sus variedades
    nombre: 'calendario-variedades',
    ruta: '/#/calendario',
    fullPage: true,
    antes: async (page) => {
      await page.getByRole('button', { name: /2 variedades/ }).first().click()
      await page.waitForTimeout(300)
    },
  },
  {
    nombre: 'diario-nueva-entrada',
    ruta: '/#/huerta',
    antes: async (page) => {
      await conDemo(page)
      await page.goto('/#/huerta')
      await page.waitForLoadState('networkidle')
      await linkEnSeccion(page, /Macetas del balcón/, /Los del cajón/).click()
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
    nombre: 'hoy-pronostico',
    ruta: '/#/ajustes',
    antes: async (page) => {
      await page.route('https://api.open-meteo.com/**', (r) => r.fulfill({ json: fixtureDesdeHoy() }))
      await page.getByRole('button', { name: 'Usar mi zona, así nomás' }).click()
      await page.goto('/#/hoy')
      await page.locator('.pronostico__dia').first().waitFor()
    },
  },
  {
    nombre: 'hoy-pronostico-alerta',
    ruta: '/#/ajustes',
    antes: async (page) => {
      // helada mañana + la lluvia que el fixture trae de fábrica: dos alertas
      await page.route('https://api.open-meteo.com/**', (r) =>
        r.fulfill({
          json: fixtureDesdeHoy((f) => {
            f.daily.temperature_2m_min[1] = 2.0
            f.daily.precipitation_probability_max[2] = 85
            f.daily.precipitation_sum[2] = 14.0
          }),
        }),
      )
      await page.getByRole('button', { name: /Cargar huerta de ejemplo/ }).click()
      await page.getByRole('button', { name: 'Usar mi zona, así nomás' }).click()
      await page.goto('/#/hoy')
      await page.locator('.pronostico__aviso').first().waitFor()
    },
  },
  {
    nombre: 'hoy-pronostico-sheet',
    ruta: '/#/ajustes',
    antes: async (page) => {
      await page.route('https://api.open-meteo.com/**', (r) => r.fulfill({ json: fixtureDesdeHoy() }))
      await page.getByRole('button', { name: 'Usar mi zona, así nomás' }).click()
      await page.goto('/#/hoy')
      await page.locator('.pronostico__dia').first().click()
      await page.locator('dialog.hoja[open]').waitFor()
    },
  },
  {
    nombre: 'hoy-pronostico-viejo',
    ruta: '/#/ajustes',
    antes: async (page) => {
      await page.route('https://api.open-meteo.com/**', (r) => r.fulfill({ json: fixtureDesdeHoy() }))
      await page.getByRole('button', { name: 'Usar mi zona, así nomás' }).click()
      await page.goto('/#/hoy')
      await page.locator('.pronostico__dia').first().waitFor()
      // se envejece el caché a mano y se corta la red: el estado "viejo" real
      await page.evaluate(async () => {
        const pedido = indexedDB.open('huerta-gba')
        const base = await new Promise<IDBDatabase>((res, rej) => {
          pedido.onsuccess = () => res(pedido.result)
          pedido.onerror = () => rej(pedido.error)
        })
        const tx = base.transaction('ajustes', 'readwrite')
        const ajustes = tx.objectStore('ajustes')
        const cache = await new Promise<{ obtenido: string }>((res) => {
          const g = ajustes.get('pronostico-cache')
          g.onsuccess = () => res(g.result as { obtenido: string })
        })
        cache.obtenido = new Date(Date.now() - 20 * 3_600_000).toISOString()
        ajustes.put(cache, 'pronostico-cache')
        await new Promise((res) => (tx.oncomplete = res))
        base.close()
      })
      await page.unroute('https://api.open-meteo.com/**')
      await page.route('https://api.open-meteo.com/**', (r) => r.abort())
      await page.reload()
      await page.locator('.pronostico__estado.es-viejo').waitFor()
    },
  },
  {
    nombre: 'ajustes-pronostico',
    ruta: '/#/ajustes',
    antes: async (page) => {
      await page.route('https://geocoding-api.open-meteo.com/**', (r) =>
        r.fulfill({
          json: {
            results: [
              {
                name: 'Temperley',
                latitude: -34.77435,
                longitude: -58.39347,
                admin1: 'Buenos Aires',
                admin2: 'Partido de Lomas de Zamora',
              },
            ],
          },
        }),
      )
      await page.getByRole('searchbox', { name: 'Buscar tu localidad' }).fill('Temperley')
      await page.getByRole('button', { name: 'Buscar' }).click()
      await page.getByRole('button', { name: /Temperley/ }).scrollIntoViewIfNeeded()
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

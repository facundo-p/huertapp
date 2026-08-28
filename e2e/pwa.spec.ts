import { test, expect, type Page } from '@playwright/test'
import { readFile, writeFile } from 'node:fs/promises'

/**
 * La promesa central del brief: "funciona 100 % offline tras la primera carga".
 * Es una promesa fácil de romper sin darse cuenta —un archivo que quedó fuera
 * del precache y la app abre en blanco en el fondo del patio, sin señal— así
 * que se prueba de verdad: cargar, cortar la red, y usar la app entera.
 */

/**
 * Espera a que el service worker esté realmente en condiciones de responder sin
 * red. Las dos condiciones son más finas de lo que parecen:
 *
 * 1. **`active.state === 'activated'`**, no alcanza con que haya `controller`.
 *    `clients.claim()` llena `controller` mientras el worker todavía está en
 *    `activating`, y durante ese estado el navegador **no le despacha eventos
 *    `fetch`**: una navegación en esa ventana se va derecho a la red. En una
 *    máquina rápida no se nota; en CI falla, y el síntoma es un
 *    ERR_INTERNET_DISCONNECTED que parece un problema del precache y no lo es.
 *
 * 2. **Que `index.html` esté en la caché**, no que haya "muchas" entradas. Es
 *    exactamente el archivo del que depende que una navegación offline funcione.
 */
/**
 * Espera a que el service worker esté realmente en condiciones de responder sin
 * red: activado, controlando la página, y con `index.html` en la caché —que es
 * el archivo del que depende que una navegación offline funcione.
 *
 * **Va con `expect.poll` y NO con `page.waitForFunction`, a propósito.**
 * `waitForFunction` no espera predicados `async`: le llega una Promise
 * pendiente, la Promise es truthy, y da la condición por cumplida al instante.
 * Un predicado que devuelve `false` explícitamente igual la hace pasar. Con
 * `page.evaluate` adentro de `expect.poll` sí se espera el resultado.
 */
async function listo(page: Page) {
  await expect
    .poll(
      () =>
        page.evaluate(async () => {
          const reg = await navigator.serviceWorker.getRegistration()
          if (reg?.active?.state !== 'activated') return false
          if (!navigator.serviceWorker.controller) return false

          const claves = await caches.keys()
          if (!claves.length) return false
          const c = await caches.open(claves[0])
          const index = await c.match(new URL('index.html', location.href).href, {
            ignoreVary: true,
            ignoreSearch: true,
          })
          return !!index && (await c.keys()).length >= 10
        }),
      { timeout: 30_000, message: 'el service worker nunca quedó listo para servir offline' },
    )
    .toBe(true)
}

async function esperarOffline(page: Page) {
  await page.goto('/')
  await listo(page)
}

test('sin internet la app abre entera: pantallas, catálogo y calendario', async ({
  page,
  context,
}) => {
  await esperarOffline(page)

  await context.setOffline(true)

  // recarga completa sin red: si algo falta en el precache, se cae acá
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Tu huerta está por empezar' })).toBeVisible()
  // y las sugerencias, que salen del catálogo cruzado con el clima de la zona
  await expect(page.getByRole('heading', { name: 'Para sembrar ahora' })).toBeVisible()

  // el catálogo son 55 especies en un chunk aparte: el caso más fácil de olvidar
  await page.getByRole('link', { name: 'Explorar' }).click()
  await expect(page.getByPlaceholder(/Buscar/)).toBeVisible()
  await expect(page.getByText('Tomate', { exact: true })).toBeVisible()

  // la ficha usa el JSON completo, con fuentes y confianza
  await page.goto('/#/explorar/tomate')
  await expect(page.getByRole('banner').getByText('Solanum lycopersicum')).toBeVisible()
  await expect(page.getByRole('link', { name: /inta|Fuente/i }).first()).toBeVisible()

  // el calendario dibuja las 55 × 36 décadas desde la tabla climática horneada
  await page.goto('/#/calendario')
  await expect(page.getByRole('heading', { name: /Calendario/ })).toBeVisible()
  await expect(page.locator('.cal-barra').first()).toBeVisible()

  // y se puede seguir cargando la huerta sin conexión: IndexedDB es local
  await page.goto('/#/ajustes')
  await page.getByRole('button', { name: /Cargar huerta de ejemplo/ }).click()
  await expect(page.getByText(/^5 siembras · ~25 plantas$/)).toBeVisible({ timeout: 5000 })

  await page.goto('/#/huerta')
  await expect(page.getByRole('link', { name: /Los del cajón/ }).first()).toBeVisible()
})

test('las fuentes tipográficas también están cacheadas: nada de texto en Times', async ({
  page,
  context,
}) => {
  await esperarOffline(page)
  await context.setOffline(true)
  await page.reload()

  // si el woff2 no estuviera precacheado, el navegador caería al fallback del
  // sistema y la app se vería como un documento cualquiera
  const cargadas = await page.evaluate(async () => {
    await document.fonts.ready
    return [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family)
  })
  expect(cargadas).toContain('Nunito Variable')
  expect(cargadas).toContain('Quicksand Variable')
})

/**
 * El flujo de actualización, de verdad: se sirve un service worker distinto,
 * el navegador lo instala y lo deja esperando, y la app tiene que ofrecer el
 * cambio en vez de aplicarlo sola. Es lo que protege a alguien que está
 * escribiendo en el diario de perder lo que escribió.
 */
test('una versión nueva se ofrece, no se impone', async ({ page }) => {
  await esperarOffline(page)

  // el aviso no aparece porque sí
  await expect(page.getByText('Hay una versión nueva.')).toBeHidden()

  // Se publica un deploy nuevo de verdad —tocando el archivo que sirve el
  // servidor— en vez de simularlo: interceptar el pedido no sirve, porque el
  // fetch del script del worker lo hace el navegador por fuera de la página.
  const swjs = 'dist/sw.js'
  const original = await readFile(swjs, 'utf8')
  try {
    await writeFile(swjs, original.replace(/const VERSION = '\w+'/, "const VERSION = 'proxima00'"))

    await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.getRegistration()
      await reg?.update()
    })

    await expect(page.getByText('Hay una versión nueva.')).toBeVisible({ timeout: 15_000 })
    // y avisa que los datos no se tocan, que es la duda de cualquiera
    await expect(page.getByText(/Tus plantas y tu diario quedan como están/)).toBeVisible()

    // Al aceptar, la app recarga sola y la caché nueva reemplaza a la vieja.
    // Se espera a que quede UNA sola caché, no a que aparezca la nueva: la
    // nueva se crea en `install`, bastante antes de que `activate` borre la
    // vieja, así que esperar su aparición mide el momento equivocado.
    await page.getByRole('button', { name: 'Actualizar' }).click()
    await expect
      .poll(
        async () => {
          // La app se recarga sola al aceptar —es lo que tiene que pasar— y eso
          // destruye el contexto de ejecución en medio del evaluate. No es un
          // fallo: se vuelve a preguntar.
          try {
            return await page.evaluate(() => caches.keys())
          } catch {
            return null
          }
        },
        {
          timeout: 15_000,
          message: 'la caché vieja tiene que borrarse al activar la versión nueva',
        },
      )
      .toEqual(['huerta-proxima00'])
    await expect(page.getByText('Hay una versión nueva.')).toBeHidden()
  } finally {
    await writeFile(swjs, original)
  }
})

test('el manifest y los íconos están donde el sistema los busca', async ({ page, request }) => {
  await page.goto('/')

  const manifest = await (await request.get('/manifest.webmanifest')).json()
  expect(manifest.name).toBe('Huerta GBA')
  expect(manifest.display).toBe('standalone')
  expect(manifest.lang).toBe('es-AR')
  // Android recorta un círculo: sin un ícono maskable, el dibujo queda cortado
  expect(manifest.icons.some((i: { purpose: string }) => i.purpose === 'maskable')).toBe(true)

  for (const icono of manifest.icons) {
    const r = await request.get(`/${icono.src}`)
    expect(r.status(), icono.src).toBe(200)
    expect(r.headers()['content-type']).toContain('image/png')
  }

  // iOS ignora el manifest para el ícono y para el nombre: van en el head
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1)
  await expect(page.locator('meta[name="apple-mobile-web-app-title"]')).toHaveAttribute(
    'content',
    'Huerta',
  )
  expect((await request.get('/apple-touch-icon.png')).status()).toBe(200)
})

test('el precache cubre todo lo que el build emitió', async ({ page }) => {
  await esperarOffline(page)

  const { enCache, faltantes } = await page.evaluate(async () => {
    const claves = await caches.keys()
    const c = await caches.open(claves[0])
    const urls = (await c.keys()).map((r) => new URL(r.url).pathname)

    // Lo que el index pide de verdad, contra lo que quedó guardado. Solo del
    // mismo origen: hay <link> que no son recursos que se descarguen —el
    // canonical apunta a la URL de producción— y nunca van a estar en caché.
    const pedidos = [
      ...[...document.querySelectorAll<HTMLScriptElement>('script[src]')].map((s) => s.src),
      ...[...document.querySelectorAll<HTMLLinkElement>('link[href]')].map((l) => l.href),
    ]
      .map((u) => new URL(u))
      .filter((u) => u.origin === location.origin)
      .map((u) => u.pathname)

    return { enCache: urls.length, faltantes: pedidos.filter((p) => !urls.includes(p)) }
  })

  expect(faltantes).toEqual([])
  expect(enCache).toBeGreaterThanOrEqual(10)
})

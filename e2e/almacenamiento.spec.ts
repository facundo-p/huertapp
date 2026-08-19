import { test, expect, type Page } from '@playwright/test'

/**
 * La base de datos, cuando alguien la creó mal.
 *
 * `indexedDB.open(nombre)` **sin versión** crea la base en versión 1 y sin
 * ningún object store. Después, la app abre con `openDB(nombre, 1, {upgrade})`
 * y —como la versión 1 ya existe— el `upgrade` no corre nunca: los stores no
 * se crean y toda transacción tira `NotFoundError`.
 *
 * Le pasó a una persona de verdad en la 1.1.0: el service worker abría así la
 * base desde `periodicsync` (Chrome, Android, app instalada). Su huerta
 * apareció vacía y no pudo volver a guardar nada, ni siquiera tras restaurar
 * el backup, porque el estado roto sobrevive a todo salvo borrar la base.
 */

/**
 * Deja la base como la dejaba el service worker: existe, en v1, sin stores.
 *
 * Se hace desde `sw.js` —una página del mismo origen que no levanta la app—
 * porque si la app ya tiene su conexión abierta, cualquier `deleteDatabase`
 * queda bloqueado y el test se cuelga en vez de fallar.
 */
async function baseSinStores(page: Page) {
  await page.goto('/sw.js')
  return page.evaluate(
    () =>
      new Promise<{ version: number; stores: string[] }>((res) => {
        const r = indexedDB.open('huerta-gba')
        r.onsuccess = () => {
          const estado = { version: r.result.version, stores: [...r.result.objectStoreNames] }
          r.result.close()
          res(estado)
        }
      }),
  )
}

const inspeccionar = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<{ stores: string[]; plantas: number }>((res) => {
        const r = indexedDB.open('huerta-gba')
        r.onsuccess = () => {
          const db = r.result
          const stores = [...db.objectStoreNames]
          if (!stores.includes('plantas')) {
            db.close()
            return res({ stores, plantas: -1 })
          }
          const q = db.transaction('plantas').objectStore('plantas').getAll()
          q.onsuccess = () => {
            db.close()
            res({ stores, plantas: q.result.length })
          }
        }
      }),
  )

test('la app se recupera de una base creada sin sus object stores', async ({ page }) => {
  const roto = await baseSinStores(page)
  expect(roto, 'el escenario tiene que quedar armado').toEqual({ version: 1, stores: [] })

  // la persona abre la app
  await page.goto('/#/ajustes')
  await page.waitForLoadState('networkidle')

  // y tiene que poder guardar: es justo lo que no podía hacer
  await page.getByRole('button', { name: /Cargar huerta de ejemplo/ }).click()
  // `[1-9]` y no `\d`: con "0 plantas" este test pasaba sin haber guardado nada
  await expect(page.getByText(/^[1-9]\d* plantas$/)).toBeVisible({ timeout: 10_000 })

  // y sobre todo: tiene que haber quedado escrito de verdad
  await page.goto('/sw.js')
  const final = await inspeccionar(page)
  expect(final.stores).toEqual(
    expect.arrayContaining(['plantas', 'diario', 'fotos', 'ubicaciones', 'ajustes']),
  )
  expect(final.plantas, 'las plantas tienen que estar en IndexedDB').toBeGreaterThan(0)
})

/**
 * La otra mitad del arreglo: que el service worker no cree la base.
 *
 * No se puede disparar `periodicsync` desde un test, así que se verifica la
 * técnica que usa `sw.js`: abortar la transacción de upgrade deja la base sin
 * crear. Si algún día un navegador dejara de cumplir esto, el service worker
 * volvería a poder romperle el almacenamiento a alguien, y queremos enterarnos
 * acá y no por un reporte.
 */
test('abortar el upgrade deja la base sin crear', async ({ page }) => {
  await page.goto('/sw.js')

  const r = await page.evaluate(async () => {
    const NOMBRE = 'huerta-inexistente-' + Math.random().toString(36).slice(2)

    const abierta = await new Promise<IDBDatabase | null>((res) => {
      const q = indexedDB.open(NOMBRE)
      q.onupgradeneeded = () => q.transaction!.abort()
      q.onsuccess = () => res(q.result)
      q.onerror = () => res(null)
    })
    abierta?.close()

    // `databases()` dice qué bases existen de verdad
    const existentes = (await indexedDB.databases()).map((d) => d.name)
    return { abrio: abierta !== null, quedoCreada: existentes.includes(NOMBRE) }
  })

  expect(r.abrio, 'el open tiene que fallar, no devolver una base vacía').toBe(false)
  expect(r.quedoCreada, 'la base NO tiene que quedar creada').toBe(false)
})

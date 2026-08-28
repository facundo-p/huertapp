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
  // el texto final exacto: "1 siembra" a mitad de la carga también matchearía
  await expect(page.getByText(/^5 siembras · ~25 plantas$/)).toBeVisible({ timeout: 10_000 })

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

/**
 * Restaurar un backup no puede costar lo que ya tenías.
 *
 * `importar()` hacía `vaciarTodo()` y recién después escribía, de a un registro
 * y fuera de transacción. Si el archivo estaba cortado o traía un registro que
 * IndexedDB rechaza, la huerta quedaba **vacía**: la app te borraba lo que
 * tenías para no poder darte lo que venía en el archivo. La propia pantalla lo
 * admitía ("tus datos anteriores pueden haberse perdido"), que es una disculpa,
 * no un comportamiento.
 */
test('un import que falla a la mitad deja intacto lo que ya había', async ({ page }) => {
  await page.goto('/#/ajustes')
  await page.waitForLoadState('networkidle')

  await page.getByRole('button', { name: /Cargar huerta de ejemplo/ }).click()
  await expect(page.getByText(/^5 siembras · ~25 plantas$/)).toBeVisible({ timeout: 10_000 })

  const antes = await page.evaluate(
    () =>
      new Promise<number>((res) => {
        const r = indexedDB.open('huerta-gba')
        r.onsuccess = () => {
          const q = r.result.transaction('plantas').objectStore('plantas').getAll()
          q.onsuccess = () => {
            r.result.close()
            res(q.result.length)
          }
        }
      }),
  )
  expect(antes, 'la demo tiene que haber quedado escrita').toBeGreaterThan(0)

  // Backup válido de forma —`validar()` solo mira que los campos sean arrays—
  // pero con una planta sin `id`. El store tiene keyPath 'id': ese `put` tira
  // DataError a mitad de la importación.
  const rota = {
    app: 'huerta-gba',
    version: 1,
    exportado: new Date().toISOString(),
    zona: 'conurbano',
    ubicaciones: [],
    diario: [],
    fotos: [],
    plantas: [
      {
        id: 'una-que-si',
        slug: 'lechuga',
        sembrada: '2026-08-01',
        metodo: 'directa',
        etapa: 'creciendo',
        etapaDesde: '2026-08-01',
        creada: '2026-08-01T10:00:00.000Z',
      },
      { slug: 'sin-id-y-el-store-lo-rechaza', sembrada: '2026-08-01' },
    ],
  }

  await page.setInputFiles('input[type="file"]', {
    name: 'huerta-rota.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(rota)),
  })

  await page.getByRole('button', { name: /Sí, reemplazar mi huerta/ }).click()
  // por clase y no por texto: acá lo que importa es que la importación falló,
  // no cómo se redacta el cartel
  await expect(page.locator('.ajustes__error')).toBeVisible({ timeout: 10_000 })

  const despues = await page.evaluate(
    () =>
      new Promise<number>((res) => {
        const r = indexedDB.open('huerta-gba')
        r.onsuccess = () => {
          const q = r.result.transaction('plantas').objectStore('plantas').getAll()
          q.onsuccess = () => {
            r.result.close()
            res(q.result.length)
          }
        }
      }),
  )

  expect(despues, 'un import fallido no puede borrar lo que ya estaba').toBe(antes)
})

/**
 * "No pude leer" y "no tenés nada" no son lo mismo, y la app los mostraba igual.
 *
 * `listo = cargado && !cargando` dejaba la pantalla en blanco si la carga
 * fallaba, y si devolvía vacío salía "Todavía no plantaste nada" — el mismo
 * cartel que ve alguien que recién empieza. Quien perdió el acceso a su huerta
 * leía que nunca había plantado nada, y de ahí a "se me borró todo" hay un paso.
 *
 * El fallo se simula rompiendo `indexedDB.open`, que es por donde pasa todo.
 */
test('cuando no puede leer la base, lo dice en vez de mostrar la huerta vacía', async ({ page }) => {
  await page.addInitScript(() => {
    indexedDB.open = () => {
      throw new DOMException('base ilegible', 'UnknownError')
    }
  })

  await page.goto('/#/huerta')
  await page.waitForLoadState('networkidle')

  await expect(page.getByText(/no pude leer/i)).toBeVisible({ timeout: 10_000 })
  // el nombre del error es lo que la persona puede copiar y mandar
  await expect(page.getByText(/UnknownError/)).toBeVisible()
  // y sobre todo: NO le decimos que nunca plantó nada
  await expect(page.getByText(/Todavía no plantaste nada/)).toHaveCount(0)
})

/**
 * La bitácora: lo único que queda cuando IndexedDB se vacía.
 *
 * El borrado que estamos persiguiendo es intermitente y nadie sabe reproducirlo.
 * Sin un registro que sobreviva al borrado, el diagnóstico es a ciegas — así fue
 * el de la 1.1.0, preguntándole datos de a uno a la persona.
 *
 * Por eso vive en localStorage: si estuviera en la base que se borra, se iría
 * junto con lo que tiene que explicar.
 */
test('la bitácora sobrevive a que se borre IndexedDB y anota la huerta vacía', async ({ page }) => {
  await page.goto('/#/ajustes')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: /Cargar huerta de ejemplo/ }).click()
  await expect(page.getByText(/^5 siembras · ~25 plantas$/)).toBeVisible({ timeout: 10_000 })

  // Un arranque CON plantas, que es el registro que la última aserción exige.
  // Sin esto el test dependía de una carrera: el apunte solo decía plantas > 0
  // si el conteo llegaba tarde, después de que la demo sembrara. En CI llegaba
  // temprano y el test caía (pasó acá y en el push a staging del 2026-08-22).
  await page.reload()
  await page.waitForLoadState('networkidle')
  await expect(page.getByText(/^5 siembras · ~25 plantas$/)).toBeVisible({ timeout: 10_000 })

  const leerBitacora = () =>
    page.evaluate(() => {
      const crudo = localStorage.getItem('huerta-bitacora')
      return crudo ? (JSON.parse(crudo) as Array<Record<string, unknown>>) : []
    })

  const antes = await leerBitacora()
  expect(antes.some((a) => a.evento === 'arranque'), 'el arranque tiene que quedar anotado').toBe(
    true,
  )

  // se borra la base entera, que es lo que le pasa a la persona
  await page.goto('/sw.js')
  await page.evaluate(
    () =>
      new Promise<void>((res) => {
        const r = indexedDB.deleteDatabase('huerta-gba')
        r.onsuccess = () => res()
        r.onerror = () => res()
        r.onblocked = () => res()
      }),
  )

  await page.goto('/#/ajustes')
  await page.waitForLoadState('networkidle')
  await expect(page.getByText(/^0 siembras$|^Todavía no/)).toBeVisible({ timeout: 10_000 })

  const despues = await leerBitacora()
  expect(despues.length, 'los apuntes viejos no se pierden con la base').toBeGreaterThan(
    antes.length,
  )
  const arranques = despues.filter((a) => a.evento === 'arranque')
  expect(arranques.at(-1)!.plantas, 'el arranque nuevo tiene que delatar la huerta vacía').toBe(0)
  // y tiene que quedar registro de que ANTES había plantas
  expect(arranques.some((a) => (a.plantas as number) > 0)).toBe(true)
})

import { test, expect, type Page } from '@playwright/test'
import { mkdtempSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// El backup es la red de seguridad de toda la app: los datos viven solo en el
// aparato. Así que no alcanza con que el botón se vea: se prueba el viaje
// completo, exportar → borrar todo → restaurar → verificar.

test('el backup da la vuelta completa: exportar, borrar y restaurar', async ({ page }) => {
  await page.goto('/#/ajustes')
  await page.waitForLoadState('networkidle')

  // 1 · sembrar la huerta de ejemplo
  await page.getByRole('button', { name: /Cargar huerta de ejemplo/ }).click()
  await expect(page.getByText(/^5 siembras · ~25 plantas$/)).toBeVisible({ timeout: 5000 })

  await page.goto('/#/huerta')
  // la tanda dividida de la demo: el mismo apodo en el almácigo y en el bancal.
  // En la lista: el croquis repite los enlaces
  const lista = page.getByRole('region', { name: 'Por lugar, con sus fechas' })
  await expect(lista.getByRole('link', { name: /Los del cajón/ })).toHaveCount(2)

  // 2 · exportar y leer el archivo que bajó
  await page.goto('/#/ajustes')
  const descarga = page.waitForEvent('download')
  await page.getByRole('button', { name: /Bajar backup/ }).click()
  const archivo = await descarga
  const destino = join(mkdtempSync(join(tmpdir(), 'huerta-')), 'backup.json')
  await archivo.saveAs(destino)

  expect(archivo.suggestedFilename()).toMatch(/^huerta-\d{4}-\d{2}-\d{2}\.json$/)

  const backup = JSON.parse(await readFile(destino, 'utf8'))
  expect(backup.app).toBe('huerta-gba')
  expect(backup.version).toBe(2)
  expect(backup.plantas).toHaveLength(6)
  expect(backup.diario).toHaveLength(8)
  expect(backup.fotos).toHaveLength(2)
  // las fotos viajan embebidas: el backup tiene que servir solo
  expect(backup.fotos[0].datos).toMatch(/^data:image\/(webp|jpeg);base64,/)
  expect(backup.huertas).toEqual([expect.objectContaining({ id: 'principal', zona: 'conurbano' })])
  expect(backup.plantas.every((p: { huertaId?: string }) => p.huertaId === 'principal')).toBe(true)

  // 3 · borrar todo
  page.once('dialog', (d) => d.accept())
  await page.getByRole('button', { name: /Borrar todas mis plantas/ }).click()
  await page.goto('/#/huerta')
  await expect(page.getByText(/Todavía no plantaste nada/)).toBeVisible()

  // 4 · restaurar desde el archivo
  await page.goto('/#/ajustes')
  await page.setInputFiles('input[type="file"][accept*="json"]', destino)

  // primero muestra qué trae y pide confirmación explícita
  await expect(page.getByText('¿Restaurar este backup?')).toBeVisible()
  await expect(page.getByText('5 siembras · ~25 plantas').first()).toBeVisible()
  await expect(page.getByText('8 entradas')).toBeVisible()
  await page.getByRole('button', { name: /Sí, reemplazar mi huerta/ }).click()
  await expect(page.getByText(/tu huerta quedó como en el backup/)).toBeVisible({ timeout: 5000 })

  // 5 · verificar que volvió todo, diario, fotos y el estado de germinación
  await page.goto('/#/huerta')
  await expect(lista.getByRole('link', { name: /Los del cajón/ })).toHaveCount(2)
  await lista.getByRole('link', { name: /Los del cajón/ }).first().click()
  await expect(page.getByText(/Germinaron 7 de 10/)).toBeVisible()
  await expect(page.locator('img.foto-diario')).toHaveCount(2)
  // el dato de germinación también sobrevive al viaje
  await expect(page.getByText(/^Germinó el/)).toBeVisible()
})

test('un archivo que no es un backup se rechaza sin tocar los datos', async ({ page }) => {
  await page.goto('/#/ajustes')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: /Cargar huerta de ejemplo/ }).click()
  await expect(page.getByText(/^5 siembras · ~25 plantas$/)).toBeVisible({ timeout: 5000 })

  await page.setInputFiles('input[type="file"][accept*="json"]', {
    name: 'cualquiera.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ hola: 'mundo' })),
  })

  await expect(page.getByText(/no es un backup de Huerta GBA/)).toBeVisible()
  // el <dialog> vive siempre en el DOM: lo que importa es que no se abrió
  await expect(page.getByText('¿Restaurar este backup?')).not.toBeVisible()
  await page.goto('/#/huerta')
  await expect(page.getByRole('link', { name: /Los del cajón/ }).first()).toBeVisible()
})

/** Lee una clave de `ajustes` directo de la base, sin pasar por la app. */
const ajuste = (page: Page, clave: string) =>
  page.evaluate(
    (clave) =>
      new Promise<unknown>((res) => {
        const r = indexedDB.open('huerta-gba')
        r.onsuccess = () => {
          const g = r.result.transaction('ajustes').objectStore('ajustes').get(clave)
          g.onsuccess = () => {
            r.result.close()
            res(g.result)
          }
        }
      }),
    clave,
  )

async function restaurar(page: Page, archivo: { name: string; mimeType: string; buffer: Buffer } | string) {
  await page.goto('/#/ajustes')
  await page.waitForLoadState('networkidle')
  await page.setInputFiles('input[type="file"][accept*="json"]', archivo)
  await expect(page.getByText('¿Restaurar este backup?')).toBeVisible()
  await page.getByRole('button', { name: /Sí, reemplazar mi huerta/ }).click()
  await expect(page.getByText(/tu huerta quedó como en el backup/)).toBeVisible({ timeout: 5000 })
}

test('un backup de antes de las huertas se restaura como una sola, con su zona', async ({ page }) => {
  const v1 = {
    app: 'huerta-gba',
    version: 1,
    exportado: '2026-08-15T12:00:00.000Z',
    zona: 'periurbano',
    plantas: [
      {
        id: 'p1',
        slug: 'tomate',
        apodo: 'Tomates del backup viejo',
        sembrada: '2026-08-01',
        metodo: 'almacigo',
        etapa: 'almacigo',
        etapaDesde: '2026-08-01',
        creada: '2026-08-01T10:00:00.000Z',
      },
    ],
    diario: [],
    ubicaciones: [],
    fotos: [],
  }
  await restaurar(page, { name: 'viejo.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(v1)) })

  expect(await ajuste(page, 'huertas')).toEqual([
    expect.objectContaining({ id: 'principal', nombre: 'Mi huerta', zona: 'periurbano' }),
  ])
  await expect(page.getByRole('radio', { name: /Periurbano/ })).toHaveAttribute('aria-checked', 'true')
  await page.goto('/#/huerta')
  await expect(page.getByText('Tomates del backup viejo').first()).toBeVisible()
})

test('con dos huertas, el backup las trae a las dos y cada planta vuelve a la suya', async ({ page }) => {
  await page.goto('/#/ajustes')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: /Cargar huerta de ejemplo/ }).click()
  await expect(page.getByText(/^5 siembras · ~25 plantas$/)).toBeVisible({ timeout: 5000 })

  // la segunda huerta, a mano: todavía no hay pantalla para crearla
  await page.evaluate(async () => {
    const r = indexedDB.open('huerta-gba')
    const d = await new Promise<IDBDatabase>((res) => (r.onsuccess = () => res(r.result)))
    const tx = d.transaction(['ajustes', 'plantas'], 'readwrite')
    const g = tx.objectStore('ajustes').get('huertas')
    await new Promise((res) => (g.onsuccess = res))
    const balcon = { id: 'balcon', nombre: 'El balcón', zona: 'urbano', creada: '2026-09-01' }
    tx.objectStore('ajustes').put([...g.result, balcon], 'huertas')
    tx.objectStore('plantas').put({
      id: 'del-balcon',
      slug: 'albahaca',
      apodo: 'Albahaca del balcón',
      sembrada: '2026-09-01',
      metodo: 'directa',
      etapa: 'creciendo',
      etapaDesde: '2026-09-01',
      creada: '2026-09-01T10:00:00.000Z',
      huertaId: 'balcon',
    })
    await new Promise((res) => (tx.oncomplete = res))
    d.close()
  })
  await page.reload()

  const descarga = page.waitForEvent('download')
  await page.getByRole('button', { name: /Bajar backup/ }).click()
  const destino = join(mkdtempSync(join(tmpdir(), 'huerta-')), 'backup.json')
  await (await descarga).saveAs(destino)
  const backup = JSON.parse(await readFile(destino, 'utf8'))
  expect(backup.huertas.map((h: { id: string }) => h.id)).toEqual(['principal', 'balcon'])

  page.once('dialog', (d) => d.accept())
  await page.getByRole('button', { name: /Borrar todas mis plantas/ }).click()
  await expect.poll(() => ajuste(page, 'huertas')).toHaveLength(1)

  await page.setInputFiles('input[type="file"][accept*="json"]', destino)
  await expect(page.getByText('¿Restaurar este backup?')).toBeVisible()
  await expect(page.getByText('Mi huerta (conurbano) · El balcón (núcleo urbano)')).toBeVisible()
  await page.getByRole('button', { name: /Sí, reemplazar mi huerta/ }).click()
  await expect(page.getByText(/tu huerta quedó como en el backup/)).toBeVisible({ timeout: 5000 })

  expect(await ajuste(page, 'huertas')).toEqual([
    expect.objectContaining({ id: 'principal', zona: 'conurbano' }),
    expect.objectContaining({ id: 'balcon', nombre: 'El balcón', zona: 'urbano' }),
  ])
  const albahaca = await page.evaluate(
    () =>
      new Promise<{ huertaId?: string } | undefined>((res) => {
        const r = indexedDB.open('huerta-gba')
        r.onsuccess = () => {
          const g = r.result.transaction('plantas').objectStore('plantas').get('del-balcon')
          g.onsuccess = () => {
            r.result.close()
            res(g.result)
          }
        }
      }),
  )
  expect(albahaca?.huertaId).toBe('balcon')
  // la activa es la principal: la albahaca del balcón no se ve en ella
  await page.goto('/#/huerta')
  await expect(page.getByRole('region', { name: 'Por lugar, con sus fechas' }).getByRole('link', { name: /Los del cajón/ })).toHaveCount(2)
  await expect(page.getByText('Albahaca del balcón')).toHaveCount(0)
})

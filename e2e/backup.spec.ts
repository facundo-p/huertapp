import { test, expect } from '@playwright/test'
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
  await expect(page.getByText(/^4 plantas$/)).toBeVisible({ timeout: 5000 })

  await page.goto('/#/huerta')
  await expect(page.getByRole('link', { name: /Los del cajón/ })).toBeVisible()

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
  expect(backup.version).toBe(1)
  expect(backup.plantas).toHaveLength(4)
  expect(backup.diario).toHaveLength(5)
  expect(backup.fotos).toHaveLength(2)
  // las fotos viajan embebidas: el backup tiene que servir solo
  expect(backup.fotos[0].datos).toMatch(/^data:image\/(webp|jpeg);base64,/)
  expect(backup.zona).toBe('conurbano')

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
  await expect(page.getByText('4 plantas')).toBeVisible()
  await expect(page.getByText('5 entradas')).toBeVisible()
  await page.getByRole('button', { name: /Sí, reemplazar mi huerta/ }).click()
  await expect(page.getByText(/tu huerta quedó como en el backup/)).toBeVisible({ timeout: 5000 })

  // 5 · verificar que volvió todo, diario y fotos incluidos
  await page.goto('/#/huerta')
  await expect(page.getByRole('link', { name: /Los del cajón/ })).toBeVisible()
  await page.getByRole('link', { name: /Los del cajón/ }).click()
  await expect(page.getByText(/Germinaron 7 de 10/)).toBeVisible()
  await expect(page.locator('img.foto-diario')).toHaveCount(2)
})

test('un archivo que no es un backup se rechaza sin tocar los datos', async ({ page }) => {
  await page.goto('/#/ajustes')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: /Cargar huerta de ejemplo/ }).click()
  await expect(page.getByText(/^4 plantas$/)).toBeVisible({ timeout: 5000 })

  await page.setInputFiles('input[type="file"][accept*="json"]', {
    name: 'cualquiera.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ hola: 'mundo' })),
  })

  await expect(page.getByText(/no es un backup de Huerta GBA/)).toBeVisible()
  // el <dialog> vive siempre en el DOM: lo que importa es que no se abrió
  await expect(page.getByText('¿Restaurar este backup?')).not.toBeVisible()
  await page.goto('/#/huerta')
  await expect(page.getByRole('link', { name: /Los del cajón/ })).toBeVisible()
})

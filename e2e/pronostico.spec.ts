import { test, expect, type Page } from '@playwright/test'
import { conHelada, fixtureDesdeHoy } from './apoyo-pronostico'

/**
 * El pronóstico en Hoy, con la red interceptada. Es el primer mock de red del
 * repo porque es la primera llamada de red del repo: contra la API viva el
 * test dependería del clima real (una alerta de helada solo existiría en
 * invierno) y de que haya internet. El fixture es una respuesta real de
 * Open-Meteo capturada con curl, con las fechas corridas para arrancar hoy.
 */

const API = 'https://api.open-meteo.com/**'

async function activarPorZona(page: Page) {
  await page.goto('/#/ajustes')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: 'Usar mi zona, así nomás' }).click()
  await expect(page.getByText(/Se pide para/)).toBeVisible()
}

async function abrirHoy(page: Page) {
  await page.goto('/#/hoy')
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
}

test('sin activar, la app no le pide nada a nadie', async ({ page }) => {
  let pedidos = 0
  await page.route(API, (r) => {
    pedidos++
    void r.abort()
  })
  await abrirHoy(page)
  await expect(page.getByRole('heading', { name: 'Para sembrar ahora' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'La semana' })).toHaveCount(0)
  expect(pedidos, 'cero requests externos sin opt-in: es la promesa de privacidad').toBe(0)
})

test('activar por zona muestra la semana, con su fuente a la vista', async ({ page }) => {
  await page.route(API, (r) => r.fulfill({ json: fixtureDesdeHoy() }))
  await activarPorZona(page)
  await abrirHoy(page)

  await expect(page.getByRole('heading', { name: 'La semana' })).toBeVisible()
  await expect(page.locator('.pronostico__dia')).toHaveCount(7)
  await expect(page.locator('.pronostico__fuente').last()).toContainText('Open-Meteo')
  // sin nada raro en el fixture, no hay alertas
  await expect(page.locator('.pronostico__aviso')).toHaveCount(0)
})

test('una helada pronosticada se anuncia con día y mínima', async ({ page }) => {
  await page.route(API, (r) => r.fulfill({ json: conHelada() }))
  await activarPorZona(page)
  await abrirHoy(page)

  const aviso = page.locator('.pronostico__aviso.es-helada')
  await expect(aviso).toContainText('Puede helar')
  await expect(aviso).toContainText('2 °C')
  await expect(aviso).toContainText('FAUBA')
})

test('el detalle del día trae los datos finos y la atribución', async ({ page }) => {
  await page.route(API, (r) => r.fulfill({ json: fixtureDesdeHoy() }))
  await activarPorZona(page)
  await abrirHoy(page)

  await page.locator('.pronostico__dia').first().click()
  const hoja = page.locator('dialog.hoja[open]')
  await expect(hoja.getByText('Humedad')).toBeVisible()
  await expect(hoja.getByText('Presión')).toBeVisible()
  await expect(hoja.getByRole('link', { name: /Open-Meteo\.com \(CC BY 4\.0\)/ })).toBeVisible()
})

test('sin red y sin nada guardado, se dice y no se rompe', async ({ page }) => {
  await page.route(API, (r) => r.abort())
  await activarPorZona(page)
  await abrirHoy(page)

  await expect(page.getByText(/Sin internet no llega el pronóstico/)).toBeVisible()
  await expect(page.locator('.pronostico__dia')).toHaveCount(0)
})

test('sacar la ubicación apaga el pronóstico del todo', async ({ page }) => {
  await page.route(API, (r) => r.fulfill({ json: fixtureDesdeHoy() }))
  await activarPorZona(page)

  await page.getByRole('button', { name: 'Sacarla y apagar el pronóstico' }).click()
  await expect(page.getByRole('button', { name: 'Usar mi zona, así nomás' })).toBeVisible()

  await abrirHoy(page)
  await expect(page.getByRole('heading', { name: 'Para sembrar ahora' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'La semana' })).toHaveCount(0)
})

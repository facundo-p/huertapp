import { test, expect, type Page } from '@playwright/test'

// Varias huertas desde Mi huerta: el título es la puerta. Cada una con su zona
// y sus plantas, y lo que se ve es siempre lo de la abierta.

async function conDemo(page: Page) {
  await page.goto('/#/ajustes')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: /Cargar huerta de ejemplo/ }).click()
  await expect(page.getByText(/^5 siembras · ~25 plantas$/)).toBeVisible({ timeout: 5000 })
}

const titulo = (page: Page) => page.getByRole('button', { name: /cambiar de huerta o sumar otra/ })
const hoja = (page: Page) => page.locator('dialog.hoja[open]')

test('sumar una huerta, pasar de una a otra y borrarla', async ({ page }) => {
  await conDemo(page)
  await page.goto('/#/huerta')
  await expect(titulo(page)).toHaveText('Mi huerta')

  // con una sola huerta, la ficha no ofrece borrarla
  await titulo(page).click()
  await hoja(page).getByRole('button', { name: 'Editar Mi huerta' }).click()
  await expect(hoja(page).getByRole('heading', { name: 'Editar la huerta' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Borrar esta huerta' })).toHaveCount(0)
  await page.keyboard.press('Escape')
  await expect(hoja(page)).toHaveCount(0)

  // 1 · una nueva, en el núcleo urbano: queda abierta y vacía
  await titulo(page).click()
  await page.getByRole('button', { name: '＋ Nueva huerta' }).click()
  await hoja(page).getByLabel('¿Cómo le decís?').fill('El balcón')
  await hoja(page).getByRole('radio', { name: /Núcleo urbano/ }).click()
  await hoja(page).getByRole('button', { name: 'Sumar esta huerta' }).click()
  await expect(titulo(page)).toHaveText('El balcón')
  await expect(page.getByText(/Todavía no plantaste nada/)).toBeVisible()
  await expect(page.getByRole('link', { name: /Los del cajón/ })).toHaveCount(0)

  // 2 · la zona sigue a la huerta abierta, en Ajustes y en el calendario
  await page.goto('/#/ajustes')
  await expect(page.getByRole('heading', { name: '¿Dónde está El balcón?' })).toBeVisible()
  await expect(page.getByRole('radio', { name: /Núcleo urbano/ })).toHaveAttribute('aria-checked', 'true')
  await page.goto('/#/calendario')
  await expect(page.getByText(/· Núcleo urbano$/)).toBeVisible()
  await page.goto('/#/hoy')
  await expect(page.getByText('En El balcón')).toBeVisible()

  // 3 · de vuelta a la de antes: sus plantas y su zona
  await page.goto('/#/huerta')
  await titulo(page).click()
  const elegir = hoja(page).getByRole('radiogroup', { name: 'Huerta abierta' })
  await expect(elegir.getByRole('radio', { name: /El balcón/ })).toHaveAttribute('aria-checked', 'true')
  await elegir.getByRole('radio', { name: /Mi huerta/ }).click()
  await expect(titulo(page)).toHaveText('Mi huerta')
  await expect(page.getByRole('link', { name: /Los del cajón/ }).first()).toBeVisible()
  await page.goto('/#/calendario')
  await expect(page.getByText(/· Conurbano$/)).toBeVisible()

  // 4 · borrar El balcón: dice qué se pierde antes de hacerlo
  await page.goto('/#/huerta')
  await titulo(page).click()
  await hoja(page).getByRole('button', { name: 'Editar El balcón' }).click()
  const aviso = new Promise<string>((res) =>
    page.once('dialog', (d) => {
      res(d.message())
      void d.accept()
    }),
  )
  await page.getByRole('button', { name: 'Borrar esta huerta' }).click()
  expect(await aviso).toBe('¿Borrar «El balcón»? No tiene nada cargado. No se puede deshacer.')
  await expect(hoja(page)).toHaveCount(0)
  await titulo(page).click()
  await expect(hoja(page).getByRole('radio')).toHaveCount(1)
})

test('lo que se suma va a la huerta abierta, y renombrarla no lo mueve', async ({ page }) => {
  await conDemo(page)
  await page.goto('/#/huerta')
  await titulo(page).click()
  await page.getByRole('button', { name: '＋ Nueva huerta' }).click()
  await hoja(page).getByLabel('¿Cómo le decís?').fill('La terraza')
  await hoja(page).getByRole('button', { name: 'Sumar esta huerta' }).click()
  await expect(titulo(page)).toHaveText('La terraza')

  await page.getByRole('button', { name: 'Sumar la primera' }).click()
  await hoja(page).getByRole('searchbox', { name: '¿Qué plantaste?' }).fill('rúcula')
  await hoja(page).getByRole('button', { name: /^Rúcula$/ }).click()
  await hoja(page).getByRole('button', { name: 'Listo, la planté' }).click()
  await expect(page.getByRole('link', { name: /Rúcula/ }).first()).toBeVisible()

  await titulo(page).click()
  await hoja(page).getByRole('button', { name: 'Editar La terraza' }).click()
  await hoja(page).getByLabel('¿Cómo le decís?').fill('La terraza de arriba')
  await hoja(page).getByRole('button', { name: 'Guardar los cambios' }).click()
  await expect(titulo(page)).toHaveText('La terraza de arriba')
  await expect(page.getByRole('link', { name: /Rúcula/ }).first()).toBeVisible()
})

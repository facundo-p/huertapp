import { expect, test } from '@playwright/test'

// La interacción que motivó todo #8: elegir la variedad al dar de alta, para
// que después los avisos salgan por ella y no por la especie. Va en e2e y no
// en unitarios porque lo que hay que probar es el paso de una especie a otra
// dentro de la hoja, que es estado de la UI.

test('elegir una variedad en el alta cambia la especie que se guarda', async ({ page }) => {
  await page.goto('/#/explorar/coliflor')
  await page.waitForLoadState('networkidle')

  await page.getByRole('button', { name: /Agregar a mi huerta/ }).click()
  await expect(page.getByText('¿Qué variedad?')).toBeVisible()

  await page.getByRole('button', { name: 'Temprana', exact: true }).click()

  // la hoja pasa a la derivada, y lo dice
  await expect(page.getByRole('heading', { name: /Sumar coliflor temprana/i })).toBeVisible()
  await expect(page.getByText(/Los avisos van a salir según esta variedad/)).toBeVisible()
  // y ya no ofrece elegir de nuevo: la derivada no tiene variedades propias
  await expect(page.getByText('¿Qué variedad?')).toHaveCount(0)

  await page.getByRole('button', { name: /Listo, la planté/ }).click()

  // queda guardada como coliflor temprana, con su ficha propia
  await expect(page.getByRole('heading', { name: 'Coliflor temprana' })).toBeVisible()
})

test('la ficha de una variedad dice de qué especie sale y vuelve a ella', async ({ page }) => {
  await page.goto('/#/explorar/tomate-determinado')
  await page.waitForLoadState('networkidle')

  await expect(page.getByText(/Lo que no figura acá abajo es igual que en la especie/)).toBeVisible()
  await expect(page.getByText(/Por qué difiere/)).toBeVisible()

  // El texto de trucos se hereda entero, con la frase que acota la práctica.
  // Aparece dos veces a propósito: citada en la derivación y completa en su
  // sección, que es lo que deja verificar el razonamiento a ojo.
  const frase = /desbrote\/poda en variedades indeterminadas/
  await expect(page.locator('.ficha__derivacion').filter({ hasText: frase })).toBeVisible()
  await expect(page.locator('.dato__valor').filter({ hasText: frase })).toBeVisible()

  // y sin embargo no hay tarjeta de tutorado
  await expect(page.locator('.cuidado__tipo', { hasText: /^Tutorado$/ })).toHaveCount(0)

  await page.getByRole('link', { name: 'Tomate', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Tomate', exact: true })).toBeVisible()
})

test('buscar por el nombre de una variedad la encuentra', async ({ page }) => {
  await page.goto('/#/explorar')
  await page.waitForLoadState('networkidle')

  await page.getByRole('searchbox', { name: /Buscar especie/ }).fill('chantenay')
  await expect(page.getByRole('heading', { name: 'Zanahoria Chantenay-Nantesa' })).toBeVisible()
})

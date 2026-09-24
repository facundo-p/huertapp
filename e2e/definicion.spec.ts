import { expect, test } from '@playwright/test'

// `Definicion.tsx` cierra la hoja y navega en el mismo click ("Verlo en el
// Glosario →"): un <dialog> modal que queda montado por el `showModal()` de
// una ruta que React Router ya desmontó puede dejar el documento inerte. No
// es teórico: es justo el tipo de cosa que un test que sólo mira "¿cargó la
// pantalla?" no atrapa, porque la pantalla carga igual.

test('el link del pie cierra la hoja y deja el Glosario usable, con mouse', async ({ page }) => {
  await page.goto('/#/explorar/tomate')
  await page.waitForLoadState('networkidle')

  await page.getByRole('button', { name: /^Suelo franco fértil/ }).click()
  await page.getByRole('link', { name: /Verlo en el Glosario/ }).click()

  await expect(page).toHaveURL(/#\/glosario#tierra/)
  await expect(page.getByRole('heading', { name: 'Glosario' })).toBeVisible()

  // sin esto, el <dialog> puede quedar en el DOM con el resto de la página
  // inerte aunque la ruta ya haya cambiado.
  expect(await page.locator('dialog').count()).toBe(0)

  // usable de verdad: algo del cuerpo de la página responde al click, no sólo el header
  await page.locator('.glosario__indice-item', { hasText: 'Luz' }).click()
  await expect(page).toHaveURL(/#\/glosario#luz/)
})

test('el link del pie funciona igual operando con teclado', async ({ page }) => {
  await page.goto('/#/explorar/tomate')
  await page.waitForLoadState('networkidle')

  await page.getByRole('button', { name: /^Tutorado/ }).click()
  const link = page.getByRole('link', { name: /Verlo en el Glosario/ })
  await link.focus()
  await page.keyboard.press('Enter')

  // labor va a #labores, la sección entera: la hoja ya mostró el término puntual
  await expect(page).toHaveURL(/#\/glosario#labores/)
  await expect(page.getByRole('heading', { name: 'Glosario' })).toBeVisible()
  expect(await page.locator('dialog').count()).toBe(0)

  await page.getByRole('button', { name: 'Volver' }).click()
  await expect(page).toHaveURL(/#\/explorar\/tomate/)
})

// El resto de la hoja (Escape, la X, el fondo) usa el `close()` nativo del
// <dialog>, que por spec devuelve el foco a quien la abrió. El link del pie
// es la única salida que además navega, así que es la única que hacía falta
// probar aparte.
test('cerrar con Escape devuelve el foco al chip, no al principio de la ficha', async ({ page }) => {
  await page.goto('/#/explorar/tomate')
  await page.waitForLoadState('networkidle')

  const chip = page.getByRole('button', { name: /^Suelo franco fértil/ })
  await chip.click()
  await page.getByRole('link', { name: /Verlo en el Glosario/ }).waitFor()

  await page.keyboard.press('Escape')

  await expect(chip).toBeFocused()
})

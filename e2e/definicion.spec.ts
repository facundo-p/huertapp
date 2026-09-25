import { expect, test, type Locator, type Page } from '@playwright/test'

// "Verlo en el Glosario →" va a un ancla dentro del HashRouter, donde el
// navegador no salta solo: lo hace el efecto de `Glosario.tsx`. Acá se fija
// que el destino quede a la vista, no tapado por el índice pegajoso, y con el
// foco en su título. Que la hoja no quede colgada no se prueba: al navegar, la
// ficha se desmonta y el <dialog> se va con ella.

/** Que se vea entero y no quede debajo del índice pegajoso del Glosario. */
async function aLaVista(page: Page, destino: Locator) {
  await expect(destino).toBeInViewport({ ratio: 1 })
  const indice = await page.locator('.glosario__indice').boundingBox()
  const caja = await destino.boundingBox()
  expect(caja!.y).toBeGreaterThanOrEqual(indice!.y + indice!.height)
}

test('la hoja del suelo lleva a su categoría en el Glosario, a la vista y con el foco', async ({ page }) => {
  await page.goto('/#/explorar/tomate')
  await page.waitForLoadState('networkidle')

  await page.getByRole('button', { name: /^Suelo franco fértil/ }).click()
  // el diálogo se llama como su título: sin eso, el lector dice «diálogo, Cerrar»
  const hoja = page.getByRole('dialog', { name: 'Suelo franco fértil' })
  await expect(hoja).toBeVisible()
  // lo que pide el tomate según su fuente; ninguna mezcla, que al lado de la
  // especie se leía como consejo para ella: quedan en el Glosario
  await expect(hoja.getByText('Lo que pide esta planta')).toBeVisible()
  await expect(hoja.getByText(/buen nivel de materia orgánica/)).toBeVisible()
  await expect(hoja.locator('a[href*="hort.unlu.edu.ar"]')).toBeVisible()
  await expect(
    hoja.getByText(
      'La mezcla para maceta o cantero, y la de la bandeja de almácigos, están en el Glosario, en «Cómo se arma la tierra».',
    ),
  ).toBeVisible()
  await expect(hoja.getByText(/partes de compost|Cómo correr la mezcla/)).toHaveCount(0)

  await page.getByRole('link', { name: /Verlo en el Glosario/ }).click()

  await expect(page).toHaveURL(/#\/glosario#suelo/)
  await expect(page.getByRole('heading', { name: 'Glosario' })).toBeVisible()
  // el foco al título de destino, para que el lector de pantalla lo anuncie
  const titulo = page.getByRole('heading', { name: 'Qué suelo pide' })
  await expect(titulo).toBeFocused()
  await aLaVista(page, titulo)

  // el índice usa el mismo salto, así que también deja el foco en el título
  await page.locator('.glosario__indice-item', { hasText: 'Luz' }).click()
  await expect(page).toHaveURL(/#\/glosario#luz/)
  await expect(page.getByRole('heading', { name: 'Cuánto sol necesita' })).toBeFocused()
})

test('con teclado, una labor salta a su término', async ({ page }) => {
  await page.goto('/#/explorar/tomate')
  await page.waitForLoadState('networkidle')

  await page.getByRole('button', { name: /^Tutorado/ }).focus()
  await page.keyboard.press('Enter')
  const link = page.getByRole('link', { name: /Verlo en el Glosario/ })
  await link.focus()
  await page.keyboard.press('Enter')

  // una labor salta a su término y no a la sección: desde la sección, el
  // tutorado quedaba fuera de pantalla
  await expect(page).toHaveURL(/#\/glosario#labor-tutorado/)
  await expect(page.getByRole('heading', { name: 'Glosario' })).toBeVisible()
  const termino = page.getByRole('heading', { name: 'Tutorado', level: 3 })
  await expect(termino).toBeFocused()
  await aLaVista(page, termino)

  await page.getByRole('button', { name: 'Volver' }).click()
  await expect(page).toHaveURL(/#\/explorar\/tomate/)
})

// El link del pie es la única salida de la hoja que navega: lo prueban los
// dos de arriba. Las otras (Escape, la X, el fondo) cierran con el `close()`
// nativo del <dialog>, que por spec devuelve el foco a quien la abrió; acá se
// fija con Escape, que es la de quien va con teclado.
test('cerrar con Escape devuelve el foco al chip, no al principio de la ficha', async ({ page }) => {
  await page.goto('/#/explorar/tomate')
  await page.waitForLoadState('networkidle')

  const chip = page.getByRole('button', { name: /^Suelo franco fértil/ })
  await chip.click()
  await page.getByRole('link', { name: /Verlo en el Glosario/ }).waitFor()

  await page.keyboard.press('Escape')

  await expect(chip).toBeFocused()
})

// La lechuga tiene dos fuentes para la luz: van las dos, como en el resto de la ficha.
test('la hoja de la luz trae lo que pide la especie, con todas sus fuentes', async ({ page }) => {
  await page.goto('/#/explorar/lechuga')
  await page.waitForLoadState('networkidle')

  await page.getByRole('button', { name: /^Sol parcial/ }).click()
  const hoja = page.getByRole('dialog')
  await expect(hoja.getByText('Lo que pide esta planta')).toBeVisible()
  await expect(hoja.getByText(/no acogolla bien/)).toBeVisible()
  await expect(hoja.locator('a[href*="lanacion.com.ar"]')).toBeVisible()
  await expect(hoja.locator('a[href*="agro.unlp.edu.ar"]')).toBeVisible()
})

// React reusa la ficha al cambiar de slug si no se la remonta, y la hoja que
// estaba arriba seguía abierta en la especie a la que se volvía.
test('volver con el historial a otra ficha no deja la hoja abierta', async ({ page }) => {
  await page.goto('/#/explorar/lechuga')
  await page.waitForLoadState('networkidle')
  await page.goto('/#/explorar/tomate')
  await page.getByRole('button', { name: /^Suelo franco fértil/ }).click()
  await expect(page.getByRole('dialog')).toBeVisible()

  await page.goBack()

  await expect(page).toHaveURL(/#\/explorar\/lechuga$/)
  await expect(page.getByRole('heading', { name: 'Lechuga', level: 1 })).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

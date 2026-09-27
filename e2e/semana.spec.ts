import { test, expect, type Page } from '@playwright/test'
import { conHelada } from './apoyo-pronostico'

/**
 * Esta semana se lee como un cuaderno: una página por día y la tira arriba,
 * pegada. La tira y el scroll se siguen en las dos direcciones; si se
 * desacoplan, el círculo marca un día y la página muestra otro, y ningún test
 * de unidad lo ve.
 */

async function abrirHoy(page: Page) {
  await page.goto('/#/ajustes')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: /Cargar huerta de ejemplo/ }).click()
  await page.waitForTimeout(500)
  await page.goto('/#/hoy')
  await page.waitForLoadState('networkidle')
  await page.locator('section[data-dia]').first().waitFor()
}

const dias = (page: Page) => page.getByRole('navigation', { name: 'Los días de la semana' }).locator('button.dia')
const paginas = (page: Page) => page.locator('section[data-dia]')

/** Cuánto queda la página de un día por debajo de la tira: 4 px, si llegó arriba. */
async function debajoDeLaTira(page: Page, i: number) {
  const tira = (await page.getByRole('navigation', { name: 'Los días de la semana' }).boundingBox())!
  const pag = (await paginas(page).nth(i).boundingBox())!
  return pag.y - (tira.y + tira.height)
}

/** El índice del día cuya página se lee: la última que arrancó antes del pie de la tira. */
async function diaQueSeLee(page: Page) {
  const tira = (await page.getByRole('navigation', { name: 'Los días de la semana' }).boundingBox())!
  const tops = await paginas(page).evaluateAll((els) => els.map((el) => el.getBoundingClientRect().top))
  return tops.filter((y) => y <= tira.y + tira.height + 12).length - 1
}

/** Espera a que quede entre 0 y 8, no «≤ 8»: subiendo, el scroll suave pasa por los negativos. */
async function llegaArriba(page: Page, i: number) {
  await expect
    .poll(async () => {
      const d = await debajoDeLaTira(page, i)
      return d >= 0 && d <= 8 ? 'arriba' : d
    })
    .toBe('arriba')
}

test('tocar un día lleva a su página, con el foco en su título', async ({ page }) => {
  await abrirHoy(page)
  await expect(dias(page).first()).toHaveAttribute('aria-current', 'true')

  for (const i of [3, 6, 1]) {
    await dias(page).nth(i).click()
    await expect(dias(page).nth(i)).toHaveAttribute('aria-current', 'true')
    await expect(page.locator('button.dia[aria-current]')).toHaveCount(1)
    // justo debajo de la tira y no debajo de ella: la tira pegada tapaba el título
    await llegaArriba(page, i)
    const fecha = await paginas(page).nth(i).getAttribute('data-dia')
    await expect(page.locator(`#titulo-${fecha}`)).toBeFocused()
    // a los 900 ms el scroll vuelve a mandar: tiene que seguir en el mismo día
    await page.waitForTimeout(1000)
    await expect(dias(page).nth(i)).toHaveAttribute('aria-current', 'true')
    await expect(page.locator('button.dia[aria-current]')).toHaveCount(1)
  }
})

/**
 * El resto del archivo corre con el scroll en seco (`reducedMotion: 'reduce'`):
 * ahí el círculo no tiene días intermedios por los que pasar, y un seguimiento
 * roto se ve igual que uno sano.
 */
test.describe('con el scroll suave', () => {
  test.use({ reducedMotion: 'no-preference' })

  test('tocar un día lejano no hace pasar el círculo por los de en medio', async ({ page }) => {
    await abrirHoy(page)
    await page.evaluate(() => {
      const w = window as unknown as { marcados: number[]; alturas: number[] }
      w.marcados = []
      w.alturas = []
      const botones = [...document.querySelectorAll('nav.semana button.dia')]
      new MutationObserver(() => {
        w.marcados.push(botones.findIndex((b) => b.hasAttribute('aria-current')))
      }).observe(document.querySelector('nav.semana')!, { subtree: true, attributeFilter: ['aria-current'] })
      addEventListener('scroll', () => w.alturas.push(scrollY), { passive: true })
    })

    await dias(page).nth(6).click()
    await llegaArriba(page, 6)
    await page.waitForTimeout(1000)

    const { marcados, alturas } = await page.evaluate(() => {
      const w = window as unknown as { marcados: number[]; alturas: number[] }
      return { marcados: w.marcados, alturas: w.alturas }
    })
    expect(new Set(alturas).size, 'el scroll tiene que haber sido suave, o el test no prueba nada').toBeGreaterThan(3)
    expect(marcados.filter((i) => i !== 6), `pasó por: ${marcados.join(', ')}`).toEqual([])
    await expect(dias(page).nth(6)).toHaveAttribute('aria-current', 'true')
  })
})

/** El último día tiene que poder llegar arriba: sin la hoja de más, se quedaba a mitad de pantalla. */
test('el último día también llega arriba', async ({ page }) => {
  await abrirHoy(page)
  await dias(page).nth(6).click()
  await llegaArriba(page, 6)
})

test('al scrollear, el círculo sigue al día que se lee', async ({ page }) => {
  await abrirHoy(page)
  for (const i of [4, 2, 0]) {
    await paginas(page)
      .nth(i)
      .evaluate((el) => el.scrollIntoView({ block: 'start' }))
    await expect(dias(page).nth(i)).toHaveAttribute('aria-current', 'true')
  }
  // y de a poco, como con el dedo, en lugar de un salto
  for (let n = 0; n < 40 && (await dias(page).nth(0).getAttribute('aria-current')); n++) {
    await page.evaluate(() => scrollBy(0, 60))
    await page.waitForTimeout(50)
  }
  await expect(dias(page).nth(0)).not.toHaveAttribute('aria-current', 'true')
  await expect(page.locator('button.dia[aria-current]')).toHaveCount(1)
})

/** La app no vuelve el scroll a cero entre pestañas: se llega a la semana ya scrolleada. */
test('llegando ya scrolleado, el círculo marca el día que se ve', async ({ page }) => {
  await abrirHoy(page)
  await page.goto('/#/explorar')
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => scrollTo(0, 1100))
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(1100)

  await page.getByRole('link', { name: 'Esta semana' }).click()
  await paginas(page).first().waitFor()
  expect(await page.evaluate(() => scrollY), 'el recorrido tiene que llegar scrolleado').toBeGreaterThan(0)
  const i = await diaQueSeLee(page)
  expect(i, 'a 1100 px no se lee hoy: si no, el test no prueba nada').toBeGreaterThan(0)
  await expect(dias(page).nth(i)).toHaveAttribute('aria-current', 'true')
  await expect(page.locator('button.dia[aria-current]')).toHaveCount(1)
})

/** El post-it es el resumen: lleva al aviso entero y se queda arriba. */
test('tocar un post-it lleva a su día y el post-it se queda', async ({ page }) => {
  await page.route('https://api.open-meteo.com/**', (r) => r.fulfill({ json: conHelada() }))
  await page.goto('/#/ajustes')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: 'Usar mi zona, así nomás' }).click()
  await expect(page.getByText(/Se pide para/)).toBeVisible()
  await abrirHoy(page)

  const postit = page.locator('.postit')
  await expect(postit).toHaveCount(1)
  await expect(postit).toHaveAccessibleName(/Puede helar el .+\. Ir al /)
  await postit.click()
  // la helada es mañana
  await expect(dias(page).nth(1)).toHaveAttribute('aria-current', 'true')
  await llegaArriba(page, 1)
  await expect(paginas(page).nth(1).locator('.tarea.es-aviso', { hasText: 'Puede helar' })).toBeInViewport()
  await expect(postit).toHaveCount(1)
})

/** El pronóstico no pasa por la huerta: con un store roto, la helada se avisa igual. */
test('sin poder leer la huerta, el post-it de helada aparece igual', async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('romper-plantas')) return
    const getAll = IDBObjectStore.prototype.getAll
    IDBObjectStore.prototype.getAll = function (this: IDBObjectStore, ...args: Parameters<typeof getAll>) {
      if (this.name === 'plantas') throw new DOMException('store roto', 'NotFoundError')
      return getAll.apply(this, args)
    }
  })
  await page.route('https://api.open-meteo.com/**', (r) => r.fulfill({ json: conHelada() }))
  await page.goto('/#/ajustes')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: 'Usar mi zona, así nomás' }).click()
  await expect(page.getByText(/Se pide para/)).toBeVisible()
  await page.evaluate(() => sessionStorage.setItem('romper-plantas', '1'))
  await page.goto('/#/hoy')
  await page.reload()

  await expect(page.getByText(/No pude leer tus datos/)).toBeVisible()
  await expect(page.getByRole('button', { name: /Ver el detalle de hoy/ }), 'el pronóstico tiene que haber llegado').toBeVisible()
  await expect(page.locator('.postit')).toHaveCount(1)
  await expect(page.locator('.postit')).toContainText('Puede helar')
  // sin la semana no hay día adonde llevar: un botón que no lleva a ningún lado confunde
  await expect(page.getByRole('button', { name: /Puede helar/ })).toHaveCount(0)
})

test('tildar deja ver el tilde, y la tarea se va con el foco en la de al lado', async ({ page }) => {
  await abrirHoy(page)
  const hoy = paginas(page).first()
  const casillas = hoy.getByRole('checkbox')
  await expect.poll(() => casillas.count()).toBeGreaterThanOrEqual(2)
  const antes = await casillas.count()
  const primera = casillas.first()
  const nombre = (await primera.getAttribute('aria-label'))!

  await primera.focus()
  await page.keyboard.press('Enter')
  // el tilde se ve antes de que se vaya: sin esto, tocar se sentía como borrar
  await expect(hoy.getByRole('checkbox', { name: nombre, exact: true })).toHaveAttribute('aria-checked', 'true')
  await expect(hoy.getByRole('checkbox', { name: nombre, exact: true })).toHaveCount(0)
  await expect(casillas).toHaveCount(antes - 1)
  // el foco no se cae al principio de la página
  const foco = await page.evaluate(() => document.activeElement?.className ?? '')
  expect(foco).toMatch(/casilla|tarea__abrir/)
})

test('«Más tarde» dice por cuánto antes de tocarlo, la saca de hoy y el foco sigue en la lista', async ({ page }) => {
  await abrirHoy(page)
  const hoy = paginas(page).first()
  const tarea = hoy.locator('.tarea:not(.es-aviso)').first()
  const titulo = (await tarea.locator('.tarea__titulo').textContent())!
  const cuantas = await hoy.locator('.tarea__titulo', { hasText: titulo }).count()

  await tarea.locator('.tarea__abrir').click()
  const boton = tarea.getByRole('button', { name: /^(Más tarde|Todavía no asomó)/ })
  // a la vista y en el botón: si no, posponer se siente como borrar
  await expect(boton).toHaveAccessibleDescription(/(La esconde|Te vuelvo a preguntar en) 3 días/)
  await expect(tarea.locator('.tarea__pospone')).toBeVisible()
  await boton.click()
  await expect(hoy.locator('.tarea__titulo', { hasText: titulo })).toHaveCount(cuantas - 1)
  const foco = await page.evaluate(() => document.activeElement?.className ?? '')
  expect(foco).toMatch(/casilla|tarea__abrir|pagina__titulo/)
})

/** #166: sin pronóstico, la sigla y el número salían pegados en una línea («HOY25»). */
for (const ancho of [390, 320]) {
  test(`sin pronóstico, el número va debajo de la sigla y dentro de su día · ${ancho} px`, async ({ page }) => {
    await page.setViewportSize({ width: ancho, height: 844 })
    await abrirHoy(page)
    await expect(page.locator('.dia__cielo svg')).toHaveCount(0)
    await expect(dias(page)).toHaveCount(7)

    for (let i = 0; i < 7; i++) {
      const dia = dias(page).nth(i)
      const caja = (await dia.boundingBox())!
      const sigla = (await dia.locator('.dia__sigla').boundingBox())!
      const num = (await dia.locator('.dia__num').boundingBox())!
      expect(num.y, `día ${i}: el número arranca antes de que termine la sigla`).toBeGreaterThanOrEqual(
        sigla.y + sigla.height - 0.5,
      )
      expect(num.x, `día ${i}: el número se sale por la izquierda`).toBeGreaterThanOrEqual(caja.x - 0.5)
      expect(num.x + num.width, `día ${i}: el número se sale por la derecha`).toBeLessThanOrEqual(
        caja.x + caja.width + 0.5,
      )
    }
  })
}

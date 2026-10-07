import { test, expect, type Page } from '@playwright/test'
import { conHelada } from './apoyo-pronostico'

/**
 * El croquis repite la lista en otra forma: si se desfasan, una planta queda
 * sin enlace o el nombre de un lugar lleva a otro. Nada de eso lo ve un
 * unitario de la grilla.
 */

async function abrirHuerta(page: Page) {
  await page.goto('/#/ajustes')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: /Cargar huerta de ejemplo/ }).click()
  await page.waitForTimeout(500)
  await page.goto('/#/huerta')
  await page.waitForLoadState('networkidle')
}

const croquis = (page: Page) => page.getByRole('region', { name: 'Croquis' })
const lista = (page: Page) => page.getByRole('region', { name: 'Por lugar, con sus fechas' })

test('cada planta de la lista tiene un solo enlace en el croquis, y lleva a la misma página', async ({ page }) => {
  await abrirHuerta(page)
  // el nombre accesible dice qué es y en qué está: el ícono es aria-hidden.
  // Y de paso espera a que la huerta haya cargado: evaluateAll no espera
  await expect(croquis(page).getByRole('link', { name: /^Zanahoria · todavía no asomó/ })).toBeVisible()
  const enLista = await lista(page).locator('a[href^="#/huerta/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')))
  const enCroquis = await croquis(page).getByRole('link').evaluateAll((as) => as.map((a) => a.getAttribute('href')))
  expect(enCroquis.length).toBeGreaterThan(0)
  expect(new Set(enCroquis).size).toBe(enCroquis.length)
  expect([...enCroquis].sort()).toEqual([...enLista].sort())
})

test('el nombre de un lugar lleva a sus fechas, y lo abre si estaba plegado', async ({ page }) => {
  await abrirHuerta(page)
  await lista(page).getByRole('button', { name: /^Bancal del fondo/, expanded: true }).click()

  await croquis(page).getByRole('button', { name: 'Bancal del fondo, ir a sus fechas' }).click()
  const suBoton = lista(page).getByRole('button', { name: /^Bancal del fondo/ })
  await expect(suBoton).toBeFocused()
  await expect(suBoton).toHaveAttribute('aria-expanded', 'true')
  await expect(suBoton).toBeInViewport()
})

test('el croquis plegado se queda plegado al volver', async ({ page }) => {
  await abrirHuerta(page)
  const plegar = page.getByRole('button', { name: 'Croquis' })
  await plegar.click()
  await expect(plegar).toHaveAttribute('aria-expanded', 'false')
  await expect(croquis(page).getByRole('link')).toHaveCount(0)

  await page.reload()
  await page.waitForLoadState('networkidle')
  await expect(page.getByRole('button', { name: 'Croquis' })).toHaveAttribute('aria-expanded', 'false')
})

/**
 * La banderita y el copo son aria-hidden: el lector los oye en el enlace. Si el
 * dibujo y el enlace dejan de decir lo mismo, el que ve pierde el «!» (lo único
 * que no es color) o ve un copo en una planta que la helada no toca.
 */
test('la banderita, su «!» y el copo dicen lo mismo que el enlace de su planta', async ({ page }) => {
  await page.route('https://api.open-meteo.com/**', (r) => r.fulfill({ json: conHelada() }))
  await page.goto('/#/ajustes')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: 'Usar mi zona, así nomás' }).click()
  await expect(page.getByText(/Se pide para/)).toBeVisible()
  await abrirHuerta(page)
  await expect(croquis(page).getByRole('link', { name: /tapar de noche/ }).first()).toBeVisible()

  const celdas = await croquis(page)
    .getByRole('link')
    .evaluateAll((as) =>
      as.map((a) => {
        const celda = a.closest('.croquis-celda')!
        return {
          nombre: a.getAttribute('aria-label') ?? '',
          bandera: !!celda.querySelector('.banderita'),
          signo: celda.querySelector('.banderita i')?.textContent ?? '',
          copo: !!celda.querySelector('.copo'),
        }
      }),
    )
  // sin algo de cada lado, la comparación no prueba nada
  expect(celdas.some((c) => c.nombre.includes(', atrasada'))).toBe(true)
  expect(celdas.some((c) => c.nombre.includes('tapar de noche'))).toBe(true)
  expect(celdas.some((c) => !c.nombre.includes('tapar de noche'))).toBe(true)
  for (const c of celdas) {
    expect(c.bandera, c.nombre).toBe(c.nombre.includes('para atender'))
    expect(c.signo, c.nombre).toBe(c.nombre.includes(', atrasada') ? '!' : '')
    expect(c.copo, c.nombre).toBe(c.nombre.includes('tapar de noche'))
  }
})

/** Los lugares en el orden en que se ven, por su nombre. */
const LUGARES = ['Almaciguera del balcón', 'Macetas del balcón', 'Bancal del fondo', 'Bancal de la medianera']
const enOrden = (textos: string[]) => textos.map((t) => LUGARES.find((l) => t.includes(l)) ?? t)
// sin barra, lo que pasa se dice sólo al lector: si el aria-live no cambia, no oye nada
const oye = (page: Page, texto: string | RegExp) => page.locator('[aria-live="polite"]').filter({ hasText: texto })

test('acomodar anda con el teclado: elegir, llevar a una marca, mover un lugar; y queda guardado', async ({ page }) => {
  await abrirHuerta(page)
  const acomodar = page.getByRole('button', { name: 'Acomodar' })
  await acomodar.focus()
  await page.keyboard.press('Enter')
  // es el mismo botón: el foco no se pierde al cambiar de modo
  await expect(page.getByRole('button', { name: 'Listo' })).toBeFocused()

  const alm = croquis(page).locator('article', { has: page.getByRole('heading', { name: 'Almaciguera del balcón' }) })
  const albahaca = alm.getByRole('button', { name: 'Albahaca, fila 1, columna 6' })
  await albahaca.focus()
  await page.keyboard.press('Enter')
  await expect(albahaca).toHaveAttribute('aria-pressed', 'true')
  await expect(oye(page, '1 celda de albahaca, de 2.')).toHaveCount(1)

  // la marca +: el botón de la libre es el mismo que queda con la planta, y el foco se queda
  await alm.getByRole('button', { name: 'Libre, fila 2, columna 1: entra lo elegido' }).focus()
  await page.keyboard.press(' ')
  const movida = alm.getByRole('button', { name: 'Albahaca, fila 2, columna 1' })
  await expect(movida).toBeFocused()
  await expect(movida).toHaveAttribute('aria-pressed', 'false')
  await expect(oye(page, 'Listo, ya está en su lugar nuevo.')).toHaveCount(1)

  // se suelta tocándola otra vez
  await page.keyboard.press('Enter')
  await expect(movida).toHaveAttribute('aria-pressed', 'true')
  await page.keyboard.press('Enter')
  await expect(movida).toHaveAttribute('aria-pressed', 'false')

  // un lugar: su nombre y después el de otro, que le deja su puesto; el foco sigue al que se movió
  const fondo = croquis(page).getByRole('button', { name: 'Bancal del fondo, mover en la hoja' })
  await fondo.focus()
  await page.keyboard.press('Enter')
  await expect(fondo).toHaveAttribute('aria-pressed', 'true')
  await expect(oye(page, 'Elegiste Bancal del fondo.')).toHaveCount(1)
  await croquis(page).getByRole('button', { name: 'Macetas del balcón, mover en la hoja' }).focus()
  await page.keyboard.press('Enter')
  await expect(oye(page, 'Bancal del fondo quedó en el puesto 2 de 4.')).toHaveCount(1)
  await expect(fondo).toBeFocused()
  await expect(fondo).toHaveAttribute('aria-pressed', 'false')
  const orden = ['Almaciguera del balcón', 'Bancal del fondo', 'Macetas del balcón', 'Bancal de la medianera']
  expect(enOrden(await croquis(page).locator('article h3').allTextContents())).toEqual(orden)

  await page.getByRole('button', { name: 'Listo' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: 'Acomodar' })).toBeFocused()
  // la lista va en el mismo orden que el croquis
  expect(enOrden(await lista(page).locator('section.lugar').allTextContents())).toEqual(orden)

  // al volver, todo sigue donde quedó
  await page.reload()
  await page.waitForLoadState('networkidle')
  await expect(lista(page).locator('section.lugar')).toHaveCount(4)
  expect(enOrden(await croquis(page).locator('article h3').allTextContents())).toEqual(orden)
  expect(enOrden(await lista(page).locator('section.lugar').allTextContents())).toEqual(orden)
  await page.getByRole('button', { name: 'Acomodar' }).click()
  await expect(alm.getByRole('button', { name: 'Albahaca, fila 2, columna 1' })).toBeVisible()
  await expect(alm.getByRole('button', { name: 'Albahaca, fila 1, columna 5' })).toBeVisible()
  await expect(alm.getByRole('button', { name: 'Libre, fila 1, columna 6' })).toBeVisible()
})

test('acomodando, el lugar que se movió no queda detrás de las pestañas', async ({ page }) => {
  // un teléfono chico: el último puesto queda abajo de lo que se ve
  await page.setViewportSize({ width: 375, height: 667 })
  await abrirHuerta(page)
  await page.getByRole('button', { name: 'Acomodar' }).click()
  const alm = croquis(page).getByRole('button', { name: 'Almaciguera del balcón, mover en la hoja' })
  await alm.focus()
  await page.keyboard.press('Enter')
  await croquis(page).getByRole('button', { name: 'Bancal del fondo, mover en la hoja' }).focus()
  await page.keyboard.press('Enter')
  await expect(alm).toBeFocused()
  const { abajo, barra } = await page.evaluate(() => ({
    abajo: document.activeElement!.getBoundingClientRect().bottom,
    barra: document.querySelector('.tabbar')!.getBoundingClientRect().top,
  }))
  expect(abajo).toBeLessThanOrEqual(barra)
})

test('en otro lugar, una libre no recibe lo elegido: para eso está Trasplantar', async ({ page }) => {
  await abrirHuerta(page)
  await page.getByRole('button', { name: 'Acomodar' }).click()
  await croquis(page).getByRole('button', { name: 'Albahaca, fila 1, columna 6' }).click()
  const macetas = croquis(page).locator('article', { has: page.getByRole('heading', { name: 'Macetas del balcón' }) })
  await macetas.getByRole('button', { name: 'Libre, fila 2, columna 1' }).click()
  await expect(oye(page, /está «Trasplantar», en la página de la planta/)).toHaveCount(1)
  // una con planta de otro lugar arranca una elección nueva
  await macetas.getByRole('button', { name: /^Tomate, Los del cajón, fila 1, columna 1/ }).click()
  await expect(oye(page, '1 maceta de tomate, de 3.')).toHaveCount(1)
  await expect(croquis(page).getByRole('button', { pressed: true })).toHaveCount(1)
})

test('con el dedo: varias celdas van juntas a una +, y un lugar que quedaría igual no se mueve', async ({ page }) => {
  await abrirHuerta(page)
  await page.getByRole('button', { name: 'Acomodar' }).click()
  const fondo = croquis(page).locator('article', { has: page.getByRole('heading', { name: 'Bancal del fondo' }) })

  await fondo.getByRole('button', { name: 'Rúcula, fila 2, columna 1' }).click()
  await fondo.getByRole('button', { name: 'Rúcula, fila 2, columna 2' }).click()
  await expect(oye(page, '2 de las 4 celdas de rúcula.')).toHaveCount(1)
  await expect(fondo.getByRole('button', { name: /^Rúcula/, pressed: true })).toHaveCount(2)
  await fondo.getByRole('button', { name: 'Libre, fila 3, columna 5: entra lo elegido' }).click()
  await expect(oye(page, 'Listo, ya están en su lugar nuevo.')).toHaveCount(1)
  await expect(fondo.getByRole('button', { name: 'Rúcula, fila 3, columna 5' })).toBeVisible()
  await expect(fondo.getByRole('button', { name: 'Rúcula, fila 3, columna 6' })).toBeVisible()
  await expect(fondo.getByRole('button', { name: 'Libre, fila 2, columna 1' })).toBeVisible()
  await expect(croquis(page).getByRole('button', { pressed: true })).toHaveCount(0)

  // la medianera al final se volvería a juntar con las macetas: no se mueve, y lo dice
  const medianera = croquis(page).getByRole('button', { name: 'Bancal de la medianera, mover en la hoja' })
  await medianera.click()
  await croquis(page).getByRole('button', { name: 'Bancal del fondo, mover en la hoja' }).click()
  await expect(oye(page, 'Ahí queda igual: los lugares chicos van de a dos.')).toHaveCount(1)
  await expect(medianera).toHaveAttribute('aria-pressed', 'true')

  await page.reload()
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: 'Acomodar' }).click()
  await expect(fondo.getByRole('button', { name: 'Rúcula, fila 3, columna 5' })).toBeVisible()
  await expect(fondo.getByRole('button', { name: 'Rúcula, fila 3, columna 6' })).toBeVisible()
})

/**
 * Dos toques más rápidos que lo que tarda en releerse la huerta: el segundo se
 * armaba con la pantalla de antes del primero y lo pisaba. Demora los getAll de
 * sólo lectura, que es con lo que se relee; la escritura lee en su transacción.
 */
const RELECTURA_LENTA = `
  (() => {
    const getAll = IDBObjectStore.prototype.getAll
    IDBObjectStore.prototype.getAll = function (...args) {
      const pedido = getAll.apply(this, args)
      if (!window.__lento || this.transaction.mode !== 'readonly') return pedido
      const escuchar = pedido.addEventListener.bind(pedido)
      pedido.addEventListener = (tipo, f, o) =>
        escuchar(tipo, tipo === 'success' ? (e) => setTimeout(() => f.call(pedido, e), window.__lento) : f, o)
      return pedido
    }
  })()
`

test('acomodar, mover un lugar y volver a acomodar, todo seguido: no se pisa nada', async ({ page }) => {
  await page.addInitScript(RELECTURA_LENTA)
  await abrirHuerta(page)
  await page.getByRole('button', { name: 'Acomodar' }).click()
  const alm = croquis(page).locator('article', { has: page.getByRole('heading', { name: 'Almaciguera del balcón' }) })
  await alm.getByRole('button', { name: 'Albahaca, fila 1, columna 6' }).click()

  await page.evaluate(() => ((window as unknown as { __lento: number }).__lento = 800))
  await alm.getByRole('button', { name: 'Libre, fila 2, columna 1: entra lo elegido' }).click()
  // el orden no puede llevarse la grilla que se acaba de acomodar
  await croquis(page).getByRole('button', { name: 'Bancal del fondo, mover en la hoja' }).click()
  await croquis(page).getByRole('button', { name: 'Macetas del balcón, mover en la hoja' }).click()
  // ni un acomodo el orden que se acaba de escribir
  await alm.getByRole('button', { name: 'Albahaca, fila 1, columna 5' }).click()
  await alm.getByRole('button', { name: 'Libre, fila 2, columna 2: entra lo elegido' }).click()
  await page.evaluate(() => ((window as unknown as { __lento: number }).__lento = 0))
  await page.waitForTimeout(3000)

  await page.reload()
  await page.waitForLoadState('networkidle')
  await expect(lista(page).locator('section.lugar')).toHaveCount(4)
  expect(enOrden(await croquis(page).locator('article h3').allTextContents())).toEqual([
    'Almaciguera del balcón',
    'Bancal del fondo',
    'Macetas del balcón',
    'Bancal de la medianera',
  ])
  await page.getByRole('button', { name: 'Acomodar' }).click()
  await expect(alm.getByRole('button', { name: 'Albahaca, fila 2, columna 1' })).toBeVisible()
  await expect(alm.getByRole('button', { name: 'Albahaca, fila 2, columna 2' })).toBeVisible()
  await expect(alm.getByRole('button', { name: 'Libre, fila 1, columna 5' })).toBeVisible()
})

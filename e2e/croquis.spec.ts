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
  // el nombre accesible dice qué es y en qué está: la plantita es aria-hidden.
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

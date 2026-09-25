import { test, expect, type Page } from '@playwright/test'
import { conHelada, fixtureDesdeHoy } from './apoyo-pronostico'
import { duplicarPlanta } from './apoyo-huerta'

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

/** El carril existe solo con plantas: sin huerta, la pantalla es el estado vacío. */
async function abrirHoy(page: Page) {
  await page.goto('/#/ajustes')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: /Cargar huerta de ejemplo/ }).click()
  await page.waitForTimeout(500)
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
  await expect(page.locator('.carril__cielo')).toHaveCount(0)
  await expect(page.locator('.carril__pie')).toHaveCount(0)
  expect(pedidos, 'cero requests externos sin opt-in: es la promesa de privacidad').toBe(0)
})

test('activar por zona muestra la semana, con su fuente a la vista', async ({ page }) => {
  await page.route(API, (r) => r.fulfill({ json: fixtureDesdeHoy() }))
  await activarPorZona(page)
  await abrirHoy(page)

  // el carril siempre tiene siete filas; con pronóstico, siete cielos
  await expect(page.locator('.carril__fila')).toHaveCount(7)
  await expect(page.locator('.carril__cielo')).toHaveCount(7)
  await expect(page.locator('.carril__pie')).toContainText('Open-Meteo')
  // sin nada raro en el fixture, no hay alertas
  await expect(page.locator('.carril__aviso')).toHaveCount(0)
})

test('una helada pronosticada se anuncia con día y mínima', async ({ page }) => {
  await page.route(API, (r) => r.fulfill({ json: conHelada() }))
  await activarPorZona(page)
  await abrirHoy(page)

  // en su fila del carril, y además destacado arriba
  const aviso = page.locator('.carril__aviso.es-helada')
  await expect(aviso).toContainText('Puede helar')
  await expect(page.locator('.hoy__destacado')).toContainText('Puede helar')
  await expect(aviso).toContainText('2 °C')
  await expect(aviso).toContainText('FAUBA')
})

test('el detalle del día trae los datos finos y la atribución', async ({ page }) => {
  await page.route(API, (r) => r.fulfill({ json: fixtureDesdeHoy() }))
  await activarPorZona(page)
  await abrirHoy(page)

  await page.locator('button.carril__dia').first().click()
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
  // el carril sigue, sin cielos
  await expect(page.locator('.carril__fila')).toHaveCount(7)
  await expect(page.locator('.carril__cielo')).toHaveCount(0)
})

test('sacar la ubicación apaga el pronóstico del todo', async ({ page }) => {
  await page.route(API, (r) => r.fulfill({ json: fixtureDesdeHoy() }))
  await activarPorZona(page)

  await page.getByRole('button', { name: 'Sacarla y apagar el pronóstico' }).click()
  await expect(page.getByRole('button', { name: 'Usar mi zona, así nomás' })).toBeVisible()

  await abrirHoy(page)
  await expect(page.getByRole('heading', { name: 'Para sembrar ahora' })).toBeVisible()
  await expect(page.locator('.carril__pie')).toHaveCount(0)
})

/**
 * Sin pronóstico, la helada sale de la estadística de la zona y su instrucción
 * es lo único que dice qué tapar: no puede quedar plegada con el porqué.
 */
test('sin pronóstico, qué tapar por la helada se ve sin abrir nada', async ({ page }) => {
  // mediados de agosto: la estadística del conurbano todavía da helada
  await page.clock.setFixedTime(new Date('2026-08-15T10:00:00'))
  await abrirHoy(page)

  // el tomate que la demo pasó al balcón ya no está en almácigo: expuesto.
  // Hoy y no toda la semana: al cambiar de década vuelve a salir.
  const helada = page.locator('.carril__fila.es-hoy .carril__item', { hasText: 'Puede helar' })
  await expect(helada.getByText(/Cubrí de noche/)).toBeVisible()
  // sin tocar nada, y el pie no la repite
  await expect(page.getByRole('button', { name: /de dónde sal/, expanded: true })).toHaveCount(0)
  await expect(page.locator('.carril__pie-dia').getByText(/Cubrí de noche/)).toHaveCount(0)
  // con lector, «Hecho» dice de qué tarea es: seguidos, eran todos iguales.
  // El espacio antes de «:» lo pone Chrome al cruzar al span sr-solo.
  await expect(helada.getByRole('button', { name: /^Hecho ?: Puede helar, hoy$/ })).toBeVisible()
  // plegado no es borrado: abierto, el pie dice de dónde sale
  const hoy = page.locator('.carril__fila.es-hoy')
  await hoy.getByRole('button', { name: /de dónde sal/ }).click()
  await expect(hoy.locator('.carril__pie-dia')).toContainText('FAUBA')
})

/** La helada no tiene planta ni lugar: lo único que separa una de otra es el día. */
test('dos «Puede helar» en la semana: cada uno dice su día', async ({ page }) => {
  // hoy cierra mediados de agosto y el viernes 21 arranca fines: una helada por década
  await page.clock.setFixedTime(new Date('2026-08-15T10:00:00'))
  await abrirHoy(page)

  const hechos = page.getByRole('button', { name: /^Hecho ?: Puede helar/ })
  await expect(hechos).toHaveCount(2)
  const nombres = await Promise.all((await hechos.all()).map((b) => b.ariaSnapshot()))
  expect(new Set(nombres).size, `con lector, los dos se oían igual: ${nombres.join(' / ')}`).toBe(2)
  // a la vista no se repite: el día ya está a la izquierda de la fila
  await expect(page.locator('.carril__item', { hasText: 'Puede helar' }).locator('.carril__lugar')).toHaveCount(0)

  // y la hoja de «Más opciones» dice de cuál es
  await page.getByRole('button', { name: 'Más opciones: Puede helar, viernes, 21 de agosto' }).click()
  await expect(page.locator('dialog.hoja[open]').getByRole('heading')).toHaveText(
    'Puede helar, viernes, 21 de agosto',
  )
})

/**
 * Dos tandas iguales con el trasplante riesgoso comparten pie, pero la
 * instrucción va en cada fila: donde falte, se lee como un trasplante sin riesgo.
 */
test('el trasplante riesgoso dice que conviene esperar en cada planta', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-08-15T10:00:00'))
  await abrirHoy(page)
  // en almácigo desde julio: en edad de trasplante con la helada de agosto encima
  for (const sufijo of ['-a', '-b']) {
    await duplicarPlanta(page, 'tomate', {
      sufijo,
      sembrada: '2026-07-01',
      germino: '2026-07-08',
      etapa: 'almacigo',
      lugar: 'Almaciguera del balcón',
    })
  }
  await page.reload()

  const filas = page.locator('.carril__fila.es-hoy .carril__item', { hasText: 'hora de trasplantar' })
  await expect(filas).toHaveCount(2)
  for (const fila of await filas.all()) await expect(fila.getByText(/esperá o cubrila/)).toBeVisible()
})

/**
 * El lugar lo arma Hoy con las ubicaciones del store: si dejara de pasarlas,
 * las dos dirían «sin lugar asignado» y nada más lo notaría.
 */
test('dos zanahorias iguales en bancales distintos: cada «Asomó» dice cuál es', async ({ page }) => {
  await abrirHoy(page)
  await duplicarPlanta(page, 'zanahoria', { lugar: 'Bancal de la medianera' })
  await page.reload()

  const hoy = page.locator('.carril__fila.es-hoy')
  for (const lugar of ['Bancal del fondo', 'Bancal de la medianera']) {
    await expect(
      hoy.getByRole('button', { name: new RegExp(`^Asomó ?: Zanahoria: fijate si asomó, ${lugar}$`) }),
    ).toHaveCount(1)
  }
  // y la hoja de «Más opciones» se titula igual que el botón que la abre
  await hoy.getByRole('button', { name: 'Más opciones: Zanahoria: fijate si asomó, Bancal del fondo' }).click()
  await expect(page.locator('dialog.hoja[open]').getByRole('heading')).toHaveText(
    'Zanahoria: fijate si asomó, Bancal del fondo',
  )
  await page.keyboard.press('Escape')
  await hoy.getByRole('button', { name: /de dónde sal/ }).click()
  await expect(hoy.locator('.carril__pie-dia')).toContainText('según la ficha: germina en 10-20 días')
})

function botonesAbajo(page: Page) {
  return page.locator('.carril__item').evaluateAll((items) =>
    items.flatMap((item) => {
      const cuerpo = item.querySelector('.carril__cuerpo')
      const acciones = item.querySelector('.carril__acciones')
      if (!cuerpo || !acciones) return []
      const a = acciones.getBoundingClientRect()
      if (a.top < cuerpo.getBoundingClientRect().bottom - 1) return []
      return [{ titulo: item.querySelector('.carril__titulo')!.textContent!, alto: a.height }]
    }),
  )
}

// 37 letras sin un espacio: no entra ni en la fila entera
const APODO_LARGO = 'TomatesDeLaAbuelaQueTrajoDeCorrientes'

/**
 * Con los botones al lado, al texto le queda poco: a 320 px se metía abajo de
 * «Asomó» o cortaba «Albahac/a:», y de 341 a 360 px, «indeterminad/o:». 344 es
 * la pantalla de afuera del Z Fold. «Tomate indeterminado» es el nombre del
 * catálogo con la palabra más larga, y va con los dos botones: «Asomó» y «Hecho».
 */
for (const ancho of [300, 320, 344, 360, 375]) {
  test(`en ${ancho} px, ningún título se pisa con sus botones ni se corta al medio`, async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-10-15T10:00:00'))
    await page.setViewportSize({ width: ancho, height: 844 })
    await abrirHoy(page)
    const indeterminado = { slug: 'tomate-indeterminado', apodo: '', etapa: 'almacigo' }
    // pasada de plazo para germinar
    await duplicarPlanta(page, 'tomate', { ...indeterminado, sufijo: '-asomo', sembrada: '2026-10-01', germino: '' })
    // en edad de trasplante
    await duplicarPlanta(page, 'tomate', {
      ...indeterminado,
      sufijo: '-hecho',
      sembrada: '2026-09-05',
      germino: '2026-09-12',
    })
    await page.reload()
    // evaluateAll no espera, y sin los tomates pasaría sin mirar lo que importa
    await expect(page.getByRole('button', { name: /^Asomó ?: Tomate indeterminado/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /^Hecho ?: Tomate indeterminado/ })).toBeVisible()

    const pisados = await page.locator('.carril__item').evaluateAll((items) =>
      items.flatMap((item) => {
        const titulo = item.querySelector('.carril__titulo')
        const acciones = item.querySelector('.carril__acciones')
        if (!titulo || !acciones) return []
        // el rango mide el texto, que desborda su caja; la caja sola no lo ve
        const rango = document.createRange()
        rango.selectNodeContents(titulo)
        const t = rango.getBoundingClientRect()
        const a = acciones.getBoundingClientRect()
        // en alto también: los botones pueden bajar abajo del texto
        const seTocan = t.right > a.left && t.left < a.right && t.bottom > a.top && t.top < a.bottom
        return seTocan ? [titulo.textContent] : []
      }),
    )
    expect(pisados).toEqual([])

    // una palabra partida en dos renglones da dos rectángulos
    const cortadas = await page.locator('.carril__titulo, .carril__lugar').evaluateAll((cajas) =>
      cajas.flatMap((caja) => {
        const partidas: string[] = []
        const textos = document.createTreeWalker(caja, NodeFilter.SHOW_TEXT)
        for (let n = textos.nextNode(); n; n = textos.nextNode()) {
          for (const p of n.textContent!.matchAll(/\S+/g)) {
            const rango = document.createRange()
            rango.setStart(n, p.index)
            rango.setEnd(n, p.index + p[0].length)
            if (rango.getClientRects().length > 1) partidas.push(`${p[0]} (${caja.textContent})`)
          }
        }
        return partidas
      }),
    )
    expect(cortadas).toEqual([])

    // Los botones al lado del texto son la densidad que se busca. «Tomate
    // indeterminado» no entra a 300 px, ni de 341 a 360: ahí está sin decidir.
    const conTomate = ancho !== 320 && ancho !== 375
    const bajaron = await botonesAbajo(page)
    expect(bajaron.filter((b) => !(conTomate && b.titulo.startsWith('Tomate indeterminado')))).toEqual([])

    // un apodo sin espacios más ancho que la fila se parte, pero ni la fila ni
    // el pie que lo repite se salen de la pantalla
    await duplicarPlanta(page, 'tomate', {
      sufijo: '-largo',
      apodo: APODO_LARGO,
      etapa: 'almacigo',
      sembrada: '2026-10-01',
      germino: '',
    })
    await page.reload()
    const hoy = page.locator('.carril__fila.es-hoy')
    await hoy.getByRole('button', { name: /de dónde sal/ }).click()
    await expect(hoy.locator('.carril__pie-de', { hasText: APODO_LARGO })).toBeVisible()
    // contra el viewport y no innerWidth: en emulación móvil crece con el desborde y lo esconde
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(ancho)

    // cuando bajan, en fila: apiladas medían 88 px con el renglón entero libre
    const abajo = await botonesAbajo(page)
    // el apodo no entra al lado de nada: sin él, esto podría no medir nada
    expect(abajo.map((b) => b.titulo)).toContainEqual(expect.stringContaining(APODO_LARGO))
    for (const { titulo, alto } of abajo) expect(alto, titulo).toBeLessThanOrEqual(45)
  })
}

/** Sin botones, al aviso nada le hace bajar el texto abajo del ícono. */
test('en 320 px, el texto del aviso va al lado de su ícono', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 })
  await page.route(API, (r) => r.fulfill({ json: conHelada() }))
  await activarPorZona(page)
  await abrirHoy(page)

  const aviso = page.locator('.carril__aviso.es-helada')
  await expect(aviso).toContainText('Puede helar')
  const icono = await aviso.locator('.carril__icono').boundingBox()
  const textos = await aviso.locator('.carril__textos').boundingBox()
  expect(textos!.x).toBeGreaterThanOrEqual(icono!.x + icono!.width)
  expect(textos!.y).toBeLessThan(icono!.y + icono!.height)
})

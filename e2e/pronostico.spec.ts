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

/** Con la demo cargada: sin huerta ni pronóstico, Hoy es el estado vacío. */
async function abrirHoy(page: Page) {
  await page.goto('/#/ajustes')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: /Cargar huerta de ejemplo/ }).click()
  await page.waitForTimeout(500)
  await page.goto('/#/hoy')
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
}

const dias = (page: Page) => page.getByRole('navigation', { name: 'Los días de la semana' }).locator('button.dia')
// el lugar del ícono está siempre; el ícono, sólo con pronóstico
const cielos = (page: Page) => page.locator('.dia__cielo svg')
const pagina = (page: Page, i: number) => page.locator('section[data-dia]').nth(i)

test('sin activar, la app no le pide nada a nadie', async ({ page }) => {
  let pedidos = 0
  await page.route(API, (r) => {
    pedidos++
    void r.abort()
  })
  await abrirHoy(page)
  await expect(page.getByRole('heading', { name: 'Para sembrar ahora' })).toBeVisible()
  await expect(dias(page)).toHaveCount(7)
  await expect(cielos(page)).toHaveCount(0)
  await expect(page.locator('button.clima, .dia-pagina__cielo')).toHaveCount(0)
  await expect(page.locator('.hoy__pie')).toHaveCount(0)
  expect(pedidos, 'cero requests externos sin opt-in: es la promesa de privacidad').toBe(0)
})

test('activar por zona muestra la semana, con su fuente a la vista', async ({ page }) => {
  await page.route(API, (r) => r.fulfill({ json: fixtureDesdeHoy() }))
  await activarPorZona(page)
  await abrirHoy(page)

  // la tira siempre tiene siete días; con pronóstico, siete cielos
  await expect(dias(page)).toHaveCount(7)
  await expect(cielos(page)).toHaveCount(7)
  // el de hoy en el encabezado y los otros seis en su página
  await expect(page.locator('button.clima')).toHaveCount(1)
  await expect(page.locator('.dia-pagina__cielo')).toHaveCount(6)
  await expect(page.locator('.hoy__pie')).toContainText('Open-Meteo')
  // sin nada raro en el fixture, no hay avisos ni post-its del pronóstico. El
  // plegado es la estadística, que según el día del año está o no
  await expect(page.locator('.tarea.es-aviso')).toHaveCount(0)
  await expect(page.locator('.postit:not(.postit--plegado)')).toHaveCount(0)
})

test('una helada pronosticada se anuncia con día y mínima', async ({ page }) => {
  await page.route(API, (r) => r.fulfill({ json: conHelada() }))
  await activarPorZona(page)
  await abrirHoy(page)

  // en la página de mañana, y además en un post-it arriba
  const aviso = pagina(page, 1).locator('.tarea.es-aviso', { hasText: 'Puede helar' })
  await expect(aviso).toBeVisible()
  await expect(page.locator('.postit')).toContainText('Puede helar')
  // la mínima y qué tapar, sin abrir nada y sin decir dos veces la mínima
  await expect(aviso.locator('.tarea__linea')).toHaveText('dan 2 °C de mínima')
  await expect(aviso.locator('.tarea__detalle')).toHaveText(/^Tapá de noche/)
  // la fuente, plegada
  await aviso.locator('.tarea__abrir').click()
  await expect(aviso.locator('.tarea__porque')).toContainText('FAUBA')
  // y en la tira, el día lo dice también con la voz
  await expect(dias(page).nth(1)).toHaveAttribute('aria-label', /Puede helar/)
})

test('el detalle del día trae los datos finos y la atribución', async ({ page }) => {
  await page.route(API, (r) => r.fulfill({ json: fixtureDesdeHoy() }))
  await activarPorZona(page)
  await abrirHoy(page)

  for (const abrir of [page.locator('button.clima'), page.locator('.dia-pagina__cielo').first()]) {
    await abrir.click()
    const hoja = page.locator('dialog.hoja[open]')
    await expect(hoja.getByText('Humedad')).toBeVisible()
    await expect(hoja.getByText('Presión')).toBeVisible()
    await expect(hoja.getByRole('link', { name: /Open-Meteo\.com \(CC BY 4\.0\)/ })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(hoja).toHaveCount(0)
  }
})

test('sin red y sin nada guardado, se dice y no se rompe', async ({ page }) => {
  await page.route(API, (r) => r.abort())
  await activarPorZona(page)
  await abrirHoy(page)

  await expect(page.getByText(/Sin internet no llega el pronóstico/)).toBeVisible()
  // la semana sigue, sin cielos
  await expect(dias(page)).toHaveCount(7)
  await expect(cielos(page)).toHaveCount(0)
})

test('sacar la ubicación apaga el pronóstico del todo', async ({ page }) => {
  await page.route(API, (r) => r.fulfill({ json: fixtureDesdeHoy() }))
  await activarPorZona(page)

  await page.getByRole('button', { name: 'Sacarla y apagar el pronóstico' }).click()
  await expect(page.getByRole('button', { name: 'Usar mi zona, así nomás' })).toBeVisible()

  await abrirHoy(page)
  await expect(page.getByRole('heading', { name: 'Para sembrar ahora' })).toBeVisible()
  await expect(page.locator('.hoy__pie')).toHaveCount(0)
  await expect(cielos(page)).toHaveCount(0)
})

/**
 * Sin pronóstico, la helada de la estadística no es algo para tildar: va en un
 * post-it plegado. El título avisa; abierto, dice qué tapar y de dónde sale.
 */
test('sin pronóstico, la helada es un post-it que se abre', async ({ page }) => {
  // mediados de agosto: la estadística del conurbano todavía da helada para la década que sigue
  await page.clock.setFixedTime(new Date('2026-08-15T10:00:00'))
  await abrirHoy(page)

  await expect(page.locator('.postit')).toHaveCount(1)
  await expect(page.locator('.tarea', { hasText: 'Puede helar' })).toHaveCount(0)
  const nota = page.locator('.pila .postit')
  const abrir = nota.getByRole('button', { name: 'Puede helar' })
  await expect(abrir).toHaveAttribute('aria-expanded', 'false')
  await expect(nota.getByText(/Cubrí de noche/)).toBeHidden()

  await abrir.click()
  await expect(abrir).toHaveAttribute('aria-expanded', 'true')
  // el tomate que la demo pasó al balcón ya no está en almácigo: expuesto
  await expect(nota.getByText(/Cubrí de noche/)).toBeVisible()
  await expect(nota).toContainText('FAUBA')
})

test('el post-it de la estadística es la helada de hoy, no la de otro día de la semana', async ({ page }) => {
  // el 6 de abril la década que sigue no llega al umbral; desde el 11, sí
  await page.clock.setFixedTime(new Date('2026-04-06T10:00:00'))
  await abrirHoy(page)
  await expect(page.getByRole('heading', { name: 'Para sembrar ahora' })).toBeVisible()
  await expect(page.locator('.postit--plegado')).toHaveCount(0)

  await page.clock.setFixedTime(new Date('2026-04-11T10:00:00'))
  await page.reload()
  await expect(page.locator('.postit--plegado')).toHaveCount(1)
})

/**
 * Dos tandas iguales con el trasplante riesgoso: la instrucción va en cada
 * una. Donde falte, se lee como un trasplante sin riesgo.
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

  const filas = page.locator('#dia-2026-08-15 .tarea', { hasText: 'hora de trasplantar' })
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

  const hoy = pagina(page, 0)
  for (const lugar of ['Bancal del fondo', 'Bancal de la medianera']) {
    await expect(
      hoy.getByRole('checkbox', { name: new RegExp(`^Asomó ?: Zanahoria: fijate si asomó, ${lugar}$`) }),
    ).toHaveCount(1)
    // a la vista, en la línea de abajo del título
    await expect(
      hoy.locator('.tarea', { hasText: 'Zanahoria: fijate' }).locator('.tarea__linea', { hasText: lugar }),
    ).toHaveCount(1)
  }
  const fondo = hoy.locator('.tarea', { hasText: 'Bancal del fondo' }).filter({ hasText: 'Zanahoria' })
  await fondo.locator('.tarea__abrir').click()
  await expect(fondo.locator('.tarea__porque')).toContainText('según la ficha: germina en 10-20 días')
  await expect(
    fondo.getByRole('button', { name: /^Todavía no asomó ?: Zanahoria: fijate si asomó, Bancal del fondo$/ }),
  ).toBeVisible()
})

// 37 letras sin un espacio: no entra ni en la fila entera
const APODO_LARGO = 'TomatesDeLaAbuelaQueTrajoDeCorrientes'

/**
 * La casilla va a la izquierda y el galón a la derecha: al título le queda lo
 * del medio. 344 es la pantalla de afuera del Z Fold. «Tomate indeterminado»
 * es el nombre del catálogo con la palabra más larga.
 */
for (const ancho of [300, 320, 344, 360, 375]) {
  test(`en ${ancho} px, ningún título se pisa ni se corta al medio`, async ({ page }) => {
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
    await expect(page.getByRole('checkbox', { name: /^Asomó ?: Tomate indeterminado/ })).toBeVisible()
    await expect(page.getByRole('checkbox', { name: /^Hecho ?: Tomate indeterminado/ })).toBeVisible()

    const pisados = await page.locator('.tarea').evaluateAll((items) =>
      items.flatMap((item) => {
        const titulo = item.querySelector('.tarea__titulo')!
        // el rango mide el texto, que desborda su caja; la caja sola no lo ve
        const rango = document.createRange()
        rango.selectNodeContents(titulo)
        const t = rango.getBoundingClientRect()
        return [...item.querySelectorAll('.casilla, .tarea__icono, .tarea__galon')].flatMap((otro) => {
          const o = otro.getBoundingClientRect()
          const seTocan = t.right > o.left && t.left < o.right && t.bottom > o.top && t.top < o.bottom
          return seTocan ? [`${titulo.textContent} / ${otro.getAttribute('class')}`] : []
        })
      }),
    )
    expect(pisados).toEqual([])

    // una palabra partida en dos renglones da dos rectángulos
    const cortadas = await page.locator('.tarea__titulo, .tarea__linea').evaluateAll((cajas) =>
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

    // las marcas de la tira no se salen de su día
    const salidas = await dias(page).evaluateAll((botones) =>
      botones.flatMap((b) => {
        const d = b.getBoundingClientRect()
        const m = b.querySelector('.dia__marcas')!.getBoundingClientRect()
        return m.left < d.left - 0.5 || m.right > d.right + 0.5 ? [b.getAttribute('aria-label')] : []
      }),
    )
    expect(salidas).toEqual([])

    // un apodo sin espacios más ancho que la fila se parte, pero no saca la
    // página de la pantalla, ni abierto con sus botones
    await duplicarPlanta(page, 'tomate', {
      sufijo: '-largo',
      apodo: APODO_LARGO,
      etapa: 'almacigo',
      sembrada: '2026-10-01',
      germino: '',
    })
    await page.reload()
    const largo = page.locator('.tarea', { hasText: APODO_LARGO })
    await largo.locator('.tarea__abrir').click()
    await expect(largo.locator('.tarea__botones')).toBeVisible()
    // contra el viewport y no innerWidth: en emulación móvil crece con el desborde y lo esconde
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(ancho)
    // los botones del plegado, en fila o de a uno, nunca apretados en dos renglones
    for (const b of await largo.locator('.tarea__botones > *').all()) {
      expect((await b.boundingBox())!.height).toBeLessThanOrEqual(45)
    }
  })
}

/** Sin casilla, al aviso nada le hace bajar el texto abajo del ícono. */
test('en 320 px, el texto del aviso va al lado de su ícono', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 })
  await page.route(API, (r) => r.fulfill({ json: conHelada() }))
  await activarPorZona(page)
  await abrirHoy(page)

  const aviso = page.locator('.tarea.es-aviso', { hasText: 'Puede helar' })
  await expect(aviso).toBeVisible()
  const icono = await aviso.locator('.tarea__icono').boundingBox()
  const textos = await aviso.locator('.tarea__cuerpo').boundingBox()
  expect(textos!.x).toBeGreaterThanOrEqual(icono!.x + icono!.width)
  expect(textos!.y).toBeLessThan(icono!.y + icono!.height)
})

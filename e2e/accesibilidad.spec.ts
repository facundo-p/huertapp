import { readFileSync } from 'node:fs'
import { test, expect, type Page } from '@playwright/test'
import { conHelada } from './apoyo-pronostico'
import { abrir } from './apoyo-huerta'
import { NOMBRE_LUZ } from '../src/icons/semantic'
import type { EspecieEnriquecida } from '../src/lib/data/types'

/**
 * Accesibilidad, como test y no como revisión de una sola vez.
 *
 * El brief la pone como no negociable. El contraste AA y los targets de 44 px
 * se rompen solos al agregar pantallas, así que se miden acá, en todas, con
 * datos cargados —que es cuando aparecen los casos difíciles—. Que el color
 * no sea el único canal no lo ve un test: se revisa en las capturas.
 */

/** Buscada y no fijada: el hueco que hay hoy en la base se va a llenar (#152). */
const LUZ_SIN_FUENTE = (
  JSON.parse(readFileSync('data/huerta_gba_enriquecido.json', 'utf8')).especies as EspecieEnriquecida[]
).find((e) => e.luz.fuentes.length === 0)

const PANTALLAS = [
  // El porqué y la fuente de cada tarea viven plegados. Sin abrirlos no se
  // miden, y son el texto más chico de la pantalla: el test pasaría por no
  // estar mirando nada.
  {
    ruta: '/#/hoy',
    nombre: 'Esta semana',
    entrar: async (page: Page) => {
      // siempre el primero que queda cerrado: al abrirse sale del conjunto, así
      // que los índices se corren solos. Tope en 8, para no abrir la semana entera.
      const cerrados = page.locator('.tarea__abrir[aria-expanded="false"]')
      // count() no espera: si el catálogo pinta antes que las plantas, el
      // bucle no abriría nada y el test mediría la pantalla sin la letra chica
      await cerrados.first().waitFor()
      for (let i = 0; i < 8 && (await cerrados.count()) > 0; i++) {
        await cerrados.first().click()
      }
      await expect(page.locator('.tarea__porque:not([hidden])').first()).toBeVisible()
    },
  },
  { ruta: '/#/explorar', nombre: 'Explorar' },
  { ruta: '/#/explorar/tomate', nombre: 'Ficha' },
  // un término del resumen con su hoja arriba: el dato de la especie, su
  // confianza, sus fuentes y el link al glosario, que no se miden cerrada
  {
    ruta: '/#/explorar/tomate',
    nombre: 'Definición de suelo',
    entrar: async (page: Page) => {
      await page.getByRole('button', { name: /^Suelo franco fértil/ }).click()
      await page.getByRole('link', { name: /Verlo en el Glosario/ }).waitFor()
    },
  },
  // la de luz de una especie sin fuente: se dice con una pastilla propia que
  // ninguna otra pantalla tiene
  {
    ruta: `/#/explorar/${LUZ_SIN_FUENTE?.slug ?? ''}`,
    nombre: 'Definición de luz sin fuente',
    entrar: async (page: Page) => {
      if (!LUZ_SIN_FUENTE) {
        throw new Error(
          'Ninguna especie tiene la luz sin fuente: la pastilla «sin fuente» se quedó sin pantalla que la mida. Armale un caso o sacá esta entrada.',
        )
      }
      await page
        .getByRole('button', { name: new RegExp(`^${NOMBRE_LUZ[LUZ_SIN_FUENTE.luz.categoria_luz]}`) })
        .click()
      await page.getByText('sin fuente', { exact: true }).waitFor()
    },
  },
  // la hoja de temperatura con un rango prendido: cuatro interruptores y ocho
  // pulgares que hay que medir con la hoja abierta
  {
    ruta: '/#/explorar',
    nombre: 'Filtro de temperatura',
    entrar: async (page: Page) => {
      await page.getByRole('button', { name: /^Temperatura/ }).click()
      await page.getByRole('button', { name: /^Ideal para germinar/ }).click()
    },
  },
  { ruta: '/#/calendario', nombre: 'Calendario' },
  { ruta: '/#/huerta', nombre: 'Mi huerta' },
  // Acomodando, con dos celdas de plantas distintas: aparecen las marcas +, el
  // «1», la barra entera y las flechas punteadas, que son las de texto tenue.
  // Las dos de acomodar van antes de otra ruta: con la misma, goto no remonta
  // la pantalla y la siguiente la encontraría acomodando
  {
    ruta: '/#/huerta',
    nombre: 'Mi huerta acomodando',
    entrar: async (page: Page) => {
      await page.getByRole('button', { name: 'Acomodar' }).click()
      await page.getByRole('button', { name: 'Tomate, Los del cajón, fila 1, columna 4' }).click()
      await page.getByRole('button', { name: 'Albahaca, fila 1, columna 5' }).click()
      await page.getByRole('button', { name: 'Intercambiar' }).waitFor()
    },
  },
  { ruta: '/#/compost', nombre: 'Compost' },
  { ruta: '/#/compost/cocina-tachos', nombre: 'Compost capítulo' },
  // La ficha de una planta se llega clickeando: el id lo genera la app. Va la
  // zanahoria porque es la que trae el bloque de germinación entero —los tres
  // chips para decir cuándo asomó y el diagnóstico de la demora.
  {
    ruta: '/#/huerta',
    nombre: 'Planta',
    entrar: async (page: Page) => {
      // la de la lista: el croquis de arriba repite el enlace
      await page
        .getByRole('region', { name: 'Por lugar, con sus fechas' })
        .getByRole('link', { name: /Zanahoria/ })
        .click()
      await page.getByRole('button', { name: /Por qué puede estar tardando/ }).click()
    },
  },
  // la de Los del cajón que quedó en el almácigo: el diario con fotos, sello y
  // riego sobre los renglones, y el «hoy» en los casilleros
  {
    ruta: '/#/huerta',
    nombre: 'Planta con diario',
    entrar: async (page: Page) => {
      await page
        .locator('section.lugar', { has: page.getByRole('button', { name: /^Almaciguera del balcón/ }) })
        .getByRole('link', { name: /Los del cajón/ })
        .click()
      // las fotos llegan de IndexedDB después de pintar
      await page.getByRole('img', { name: 'Foto del diario' }).first().waitFor()
    },
  },
  // la compostera de la demo con el giro atrasado; se entra desde Mi huerta
  {
    ruta: '/#/huerta',
    nombre: 'Compostera',
    entrar: async (page: Page) => {
      await page.getByRole('link', { name: /Tacho del balcón/ }).click()
      await page.getByRole('button', { name: /Hoy la giré/ }).waitFor()
    },
  },
  { ruta: '/#/glosario', nombre: 'Glosario' },
  // y moviendo un lugar: «Antes» no se puede, porque la almaciguera es la primera
  {
    ruta: '/#/huerta',
    nombre: 'Mi huerta moviendo un lugar',
    entrar: async (page: Page) => {
      await page.getByRole('button', { name: 'Acomodar' }).click()
      await page.getByRole('button', { name: 'Almaciguera del balcón, mover en la hoja' }).click()
      await page.getByRole('button', { name: 'Antes: ya es el primero' }).waitFor()
    },
  },
  { ruta: '/#/ajustes', nombre: 'Ajustes' },
  // Con los lugares plegados aparecen los chips, los medidores y la próxima
  // tarea de cada uno: es el estado con más texto chico de la pantalla.
  // Va ÚLTIMA porque el plegado se guarda: dejarla antes esconde las plantas
  // que las pantallas de más arriba necesitan clickear.
  {
    ruta: '/#/huerta',
    nombre: 'Mi huerta plegada',
    entrar: async (page: Page) => {
      for (const lugar of [
        /^Almaciguera del balcón/,
        /^Macetas del balcón/,
        /^Bancal del fondo/,
        /^Bancal de la medianera/,
      ]) {
        // `expanded: true` la hace idempotente: si ya estaba plegada, no la abre
        await page.getByRole('button', { name: lugar, expanded: true }).click()
      }
    },
  },
]

/**
 * Fija el tema antes de que corra un solo script de la app, que es como lo
 * lee el bootstrap de `index.html`. Los tests que dependen del color corren
 * una vez por tema: son el mismo diseño con distinta paleta, y una paleta
 * puede estar bien y la otra no.
 */
const TEMAS = ['dia', 'noche'] as const

async function conTema(page: Page, tema: (typeof TEMAS)[number]) {
  await page.addInitScript((t) => {
    try {
      localStorage.setItem('huerta-gba:tema', t)
    } catch {
      /* storage bloqueado: el test igual corre en el tema por defecto */
    }
  }, tema)
}

async function conDemo(page: Page) {
  await page.route('https://api.open-meteo.com/**', (r) => r.fulfill({ json: conHelada() }))
  await page.goto('/#/ajustes')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: /Cargar huerta de ejemplo/ }).click()
  await expect(page.getByText(/^5 siembras · ~25 plantas$/)).toBeVisible({
    timeout: 5000,
  })
  await page.getByRole('button', { name: 'Usar mi zona, así nomás' }).click()
  await expect(page.getByText(/Se pide para/)).toBeVisible()
}

/* ------------------------------------------------------------------ */

/** Todo lo clickeable tiene que decir qué hace, aunque sea solo un ícono. */
test('nada interactivo queda sin nombre accesible', async ({ page }) => {
  await conDemo(page)
  const sinNombre: string[] = []

  for (const { ruta, nombre, entrar } of PANTALLAS) {
    await abrir(page, ruta, entrar)

    const malos = await page.evaluate(() => {
      const nombreDe = (el: Element) =>
        (
          el.getAttribute('aria-label') ??
          (el.getAttribute('aria-labelledby')
            ? (document.getElementById(el.getAttribute('aria-labelledby')!)?.textContent ?? '')
            : '') ??
          ''
        ).trim() ||
        (el.textContent ?? '').trim() ||
        (el.querySelector('svg[aria-label]')?.getAttribute('aria-label') ?? '').trim() ||
        (el.querySelector('img[alt]')?.getAttribute('alt') ?? '').trim()

      return [...document.querySelectorAll('button, a[href], input, select, [role="radio"]')]
        .filter((el) => (el as HTMLElement).offsetParent !== null || el.tagName === 'INPUT')
        .filter((el) => !el.classList.contains('sr-solo'))
        .filter((el) => {
          if (el.tagName === 'INPUT') {
            const i = el as HTMLInputElement
            if (i.type === 'hidden' || i.classList.contains('sr-solo')) return false
            return !i.labels?.length && !i.getAttribute('aria-label') && !i.placeholder
          }
          return !nombreDe(el)
        })
        .map((el) => `${el.tagName.toLowerCase()}.${el.className || '(sin clase)'}`)
    })

    sinNombre.push(...malos.map((m) => `${nombre}: ${m}`))
  }

  expect(sinNombre).toEqual([])
})

/** ≥ 44 px, que es lo que mide un dedo. Con tierra encima, más. */
test('los targets táctiles llegan a 44 px', async ({ page }) => {
  await conDemo(page)
  const chicos: string[] = []

  for (const { ruta, nombre, entrar } of PANTALLAS) {
    await abrir(page, ruta, entrar)

    const malos = await page.evaluate(() => {
      const MIN = 44
      const modal = document.querySelector(':modal')

      /**
       * Cuando la caja no llega, el área puede crecer por fuera con un
       * ::before (el nombre de una labor, en su cabecera de 17 px). Ahí se
       * mide lo que recibe el dedo, punto por punto desde el centro: eso
       * atrapa también a un vecino pintado encima, que la caja no ve.
       */
      const alcance = (el: HTMLElement) => {
        el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' })
        const r = el.getBoundingClientRect()
        const [cx, cy] = [r.left + r.width / 2, r.top + r.height / 2]
        const toca = (x: number, y: number) => {
          const h = document.elementFromPoint(x, y)
          return !!h && el.contains(h)
        }
        const tramo = (sigue: (d: number) => boolean) => {
          let d = 0
          while (d < MIN && sigue(d + 1)) d++
          return d
        }
        if (!toca(cx, cy)) return { ancho: 0, alto: 0 }
        return {
          ancho: tramo((d) => toca(cx - d, cy)) + tramo((d) => toca(cx + d, cy)) + 1,
          alto: tramo((d) => toca(cx, cy - d)) + tramo((d) => toca(cx, cy + d)) + 1,
        }
      }

      return (
        [...document.querySelectorAll<HTMLElement>('button, a[href], [role="radio"]')]
          .filter((el) => el.offsetParent !== null && !el.classList.contains('sr-solo'))
          .map((el) => ({ el, r: el.getBoundingClientRect() }))
          .filter(({ r }) => r.width > 0 && r.height > 0)
          // Los enlaces dentro de un párrafo (fuentes, referencias) son texto
          // corrido: agrandarlos rompería la línea. WCAG los exime por eso mismo.
          .filter(({ el }) => !el.closest('p, .dato__texto, .glosario__texto'))
          .filter(({ r }) => r.height < MIN || r.width < MIN)
          // detrás de una hoja abierta no se toca nada; se mide con la hoja cerrada
          .filter(({ el }) => !modal || modal.contains(el))
          .map(({ el }) => ({ el, a: alcance(el) }))
          .filter(({ a }) => a.alto < MIN || a.ancho < MIN)
          .map(
            ({ el, a }) =>
              `${el.tagName.toLowerCase()}.${el.className} ${Math.round(a.ancho)}×${Math.round(a.alto)}`,
          )
      )
    })

    chicos.push(...malos.map((m) => `${nombre}: ${m}`))
  }

  expect(chicos).toEqual([])
})

/** Contraste AA: 4.5:1 para texto normal, 3:1 para grande o negrita grande. */
for (const tema of TEMAS) {
  test(`el texto llega al contraste AA · tema ${tema}`, async ({ page }) => {
    await conTema(page, tema)
    await conDemo(page)
    const flojos: string[] = []

    for (const { ruta, nombre, entrar } of PANTALLAS) {
      await abrir(page, ruta, entrar)

      const malos = await page.evaluate(() => {
        /** [r, g, b] en 0-255 y a en 0-1. `color-mix()` computa a `color(srgb …)`, en
         *  0-1: leído como rgb daba casi negro, y de noche el texto claro
         *  pasaba en falso. */
        const canales = (c: string) => {
          const v = (c.match(/[\d.]+/g) ?? []).map(Number)
          return c.startsWith('color(srgb ') ? v.map((x, i) => (i < 3 ? x * 255 : x)) : v
        }
        const rgb = (c: string) => canales(c).slice(0, 3)
        const lum = ([r, g, b]: number[]) => {
          const f = (v: number) => {
            const s = v / 255
            return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
          }
          return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
        }
        const ratio = (a: number[], b: number[]) => {
          const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
          return (x + 0.05) / (y + 0.05)
        }
        /**
         * El fondo efectivo, COMPUESTO.
         *
         * Antes esto saltaba cualquier capa con alpha ≤ .85 y, si no encontraba
         * nada, devolvía el papel claro clavado. En el tema noche la tarjeta es
         * `--papel-alto`, que tiene alpha .44 a propósito para que flote sobre
         * la tierra: saltearla medía el texto contra el body, que es más oscuro,
         * y daba un contraste MEJOR que el real. Un test que sobreestima deja
         * pasar lo que en la pantalla no se lee.
         *
         * Ahora se apilan las capas de abajo hacia arriba y se componen. El
         * respaldo sale del papel del tema, no de una constante.
         */
        const fondo = (el: Element): number[] => {
          const capas: number[][] = []
          for (let n: Element | null = el; n; n = n.parentElement) {
            const v = canales(getComputedStyle(n).backgroundColor)
            if (v.length < 3) continue
            const a = v[3] ?? 1
            if (a === 0) continue
            capas.push([v[0], v[1], v[2], a])
            if (a >= 0.999) break
          }
          // La base es el body, que siempre pinta `--papel` opaco. Se lee
          // computado y no como custom property: `--papel` es un hex y hay que
          // resolverlo a rgb igual.
          const b = canales(getComputedStyle(document.body).backgroundColor)
          let out = b.length >= 3 && (b[3] ?? 1) >= 0.999 ? [b[0], b[1], b[2]] : [246, 239, 221]
          for (const c of capas.reverse()) {
            out = [0, 1, 2].map((i) => c[3] * c[i] + (1 - c[3]) * out[i])
          }
          return out
        }

        const salida: string[] = []
        for (const el of document.querySelectorAll<HTMLElement>('body *')) {
          if (el.offsetParent === null) continue
          // el texto solo para lectores de pantalla no se ve: medirle el
          // contraste no dice nada y ensucia el informe
          if (el.closest('.sr-solo')) continue
          // solo nodos con texto propio
          const texto = [...el.childNodes]
            .filter((n) => n.nodeType === 3)
            .map((n) => n.textContent?.trim())
            .filter(Boolean)
            .join(' ')
          if (!texto) continue

          const cs = getComputedStyle(el)
          if (cs.opacity !== '' && Number(cs.opacity) < 0.9) continue
          const px = parseFloat(cs.fontSize)
          const peso = Number(cs.fontWeight) || 400
          const grande = px >= 24 || (px >= 18.66 && peso >= 700)
          const minimo = grande ? 3 : 4.5

          // El color del texto también puede venir con alpha (`--papel-alto`
          // de noche lo tiene): se compone sobre el fondo, que es lo que se ve.
          // Sin esto el botón «Agregar a mi huerta» pasaba con texto invisible.
          const f = fondo(el)
          const c = canales(cs.color)
          const ac = c[3] ?? 1
          const color = ac >= 0.999 ? rgb(cs.color) : [0, 1, 2].map((i) => ac * c[i] + (1 - ac) * f[i])
          const r = ratio(color, f)
          if (r < minimo) {
            salida.push(
              `"${texto.slice(0, 30)}" ${r.toFixed(2)}:1 (pide ${minimo}) · ${px}px/${peso} · .${el.className}`,
            )
          }
        }
        return salida
      })

      flojos.push(...malos.map((m) => `${nombre}: ${m}`))
    }

    expect(flojos).toEqual([])
  })
}

/** El foco de teclado tiene que verse; si no, navegar a ciegas. */
for (const tema of TEMAS) {
  test(`el foco por teclado es visible en toda la app · tema ${tema}`, async ({ page }) => {
    await conTema(page, tema)
    for (const { ruta } of PANTALLAS) {
      await abrir(page, ruta)

      await page.keyboard.press('Tab')
      const foco = await page.evaluate(() => {
        const el = document.activeElement
        if (!el || el === document.body) return null
        const cs = getComputedStyle(el)
        return {
          outline: cs.outlineWidth,
          estilo: cs.outlineStyle,
          sombra: cs.boxShadow,
        }
      })
      expect(foco, ruta).not.toBeNull()
      const grosor = parseFloat(foco!.outline)
      expect(grosor > 0 && foco!.estilo !== 'none', `${ruta}: foco sin contorno`).toBe(true)
    }
  })
}

/** Una sola h1 por pantalla y sin saltos de nivel. */
test('la jerarquía de encabezados es navegable', async ({ page }) => {
  await conDemo(page)
  const problemas: string[] = []

  for (const { ruta, nombre, entrar } of PANTALLAS) {
    await abrir(page, ruta, entrar)

    const niveles = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')]
        .filter((h) => h.offsetParent !== null)
        .map((h) => ({
          n: Number(h.tagName[1]),
          texto: (h.textContent ?? '').slice(0, 24),
        })),
    )

    const h1 = niveles.filter((x) => x.n === 1)
    if (h1.length !== 1) problemas.push(`${nombre}: ${h1.length} h1 (tiene que haber 1)`)

    for (let i = 1; i < niveles.length; i++) {
      if (niveles[i].n - niveles[i - 1].n > 1) {
        problemas.push(
          `${nombre}: salto h${niveles[i - 1].n}→h${niveles[i].n} en "${niveles[i].texto}"`,
        )
      }
    }
  }

  expect(problemas).toEqual([])
})

/**
 * Con la letra agrandada, el rótulo crece, las cinco pestañas siguen en
 * pantalla y cada rótulo queda dentro de la suya. Sin el corte en em, a 130 %
 * «Mi huerta» quedaba afuera.
 */
for (const [ancho, letra] of [
  [390, 100],
  [390, 130],
  [360, 130],
  [320, 100],
  [320, 130],
] as const) {
  test(`las cinco pestañas entran · ${ancho} px, letra al ${letra} %`, async ({ page }) => {
    await page.setViewportSize({ width: ancho, height: 844 })
    await abrir(page, '/#/hoy', async (p) => {
      await p.addStyleTag({ content: `html { font-size: ${letra}% }` })
    })
    // en px fijos el rótulo no crecía, y la letra agrandada no llegaba a la barra
    const tamano = await page
      .locator('.tabbar__etiqueta')
      .first()
      .evaluate((e) => parseFloat(getComputedStyle(e).fontSize))
    expect(tamano, 'el rótulo no crece con la letra').toBeCloseTo((12 * letra) / 100, 1)

    const medidas = await page.locator('.tabbar__tab').evaluateAll((tabs) =>
      tabs.map((t) => {
        const caja = t.getBoundingClientRect()
        const rotulo = t.querySelector('.tabbar__etiqueta')!.getBoundingClientRect()
        return {
          nombre: t.textContent,
          caja: { izq: caja.left, der: caja.right, abajo: caja.bottom },
          rotulo: { izq: rotulo.left, der: rotulo.right, abajo: rotulo.bottom },
        }
      }),
    )
    expect(medidas).toHaveLength(5)
    for (const { nombre, caja, rotulo } of medidas) {
      expect(caja.izq, `${nombre}: se sale por la izquierda`).toBeGreaterThanOrEqual(0)
      expect(caja.der, `${nombre}: se sale por la derecha`).toBeLessThanOrEqual(ancho)
      expect(caja.abajo, `${nombre}: se sale por abajo`).toBeLessThanOrEqual(844)
      expect(caja.der - caja.izq, `${nombre}: menos de 44 px para el dedo`).toBeGreaterThanOrEqual(44)
      expect(rotulo.izq, `${nombre}: el rótulo se sale de su pestaña`).toBeGreaterThanOrEqual(caja.izq - 0.5)
      expect(rotulo.der, `${nombre}: el rótulo se sale de su pestaña`).toBeLessThanOrEqual(caja.der + 0.5)
      expect(rotulo.abajo, `${nombre}: el rótulo se sale por abajo de su pestaña`).toBeLessThanOrEqual(caja.abajo + 0.5)
    }
  })
}

/**
 * La barra crece con la letra, y lo de abajo de cada pantalla tiene que
 * despejarla. Con el alto fijo de 72, a 320 px y 130 % «Sumar una compostera»
 * quedaba con 29 de sus 48 px para tocar.
 */
for (const [ancho, letra] of [
  [320, 130],
  [360, 200],
] as const) {
  test(`nada queda detrás de la barra · ${ancho} px, letra al ${letra} %`, async ({ page }) => {
    await page.setViewportSize({ width: ancho, height: 844 })
    for (const ruta of ['/#/hoy', '/#/explorar', '/#/calendario', '/#/compost', '/#/huerta']) {
      await abrir(page, ruta, async (p) => {
        await p.addStyleTag({ content: `html { font-size: ${letra}% }` })
      })
      // dos cuadros: el que mide la barra y el que repinta el pie de la pantalla
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
      const { barra, abajo, nombre } = await page.evaluate(() => {
        const enfocables = [...document.querySelectorAll<HTMLElement>('.pantalla a[href], .pantalla button, .pantalla input')]
          .filter((e) => e.getClientRects().length > 0)
        const ultimo = enfocables[enfocables.length - 1]
        return {
          barra: document.querySelector('.tabbar')!.getBoundingClientRect().top,
          abajo: ultimo.getBoundingClientRect().bottom,
          nombre: ultimo.getAttribute('aria-label') ?? ultimo.textContent?.trim(),
        }
      })
      expect(abajo, `${ruta}: «${nombre}» queda detrás de la barra`).toBeLessThanOrEqual(barra + 0.5)
    }
  })
}

/**
 * El título de una ficha crece con la letra. Sin corte de palabra, a 390 px y
 * 150 % «Tomate indeterminado» se salía y la página scrolleaba de costado.
 */
for (const [ancho, letra] of [
  [360, 130],
  [390, 150],
  [320, 200],
] as const) {
  test(`el título de una ficha no se sale · ${ancho} px, letra al ${letra} %`, async ({ page }) => {
    await page.setViewportSize({ width: ancho, height: 844 })
    await abrir(page, '/#/explorar/tomate-indeterminado', async (p) => {
      await p.addStyleTag({ content: `html { font-size: ${letra}% }` })
    })
    const { titulo, pagina } = await page.evaluate(() => ({
      titulo: document.querySelector('.encabezado__titulo')!.getBoundingClientRect().right,
      pagina: document.documentElement.scrollWidth,
    }))
    expect(titulo, 'el título se sale por la derecha').toBeLessThanOrEqual(ancho)
    expect(pagina, 'la página scrollea de costado').toBeLessThanOrEqual(ancho)
  })
}

/**
 * El surco es un svg: sin ancho explícito se quedaba en sus 152 px aunque el
 * bancal midiera menos, y a 320 px Mi huerta scrolleaba de costado.
 */
for (const letra of [100, 200]) {
  test(`el croquis no se sale · 320 px, letra al ${letra} %`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 })
    await conDemo(page)
    await abrir(page, '/#/huerta', async (p) => {
      await p.addStyleTag({ content: `html { font-size: ${letra}% }` })
      // el croquis llega después del primer título: sin esperarlo no mide nada
      await expect(p.locator('.surco').first(), 'la huerta de ejemplo tiene un bancal en surcos').toBeAttached()
    })
    const { surcos, pagina } = await page.evaluate(() => ({
      surcos: [...document.querySelectorAll('.surco')].map((s) => {
        const celda = s.closest('.croquis-celda')!.getBoundingClientRect()
        const r = s.getBoundingClientRect()
        return { izq: r.left - celda.left, der: celda.right - r.right }
      }),
      pagina: document.documentElement.scrollWidth,
    }))
    for (const s of surcos) expect(Math.min(s.izq, s.der), 'el surco se sale de su celda').toBeGreaterThanOrEqual(0)
    expect(pagina, 'la página scrollea de costado').toBeLessThanOrEqual(320)
  })
}

/**
 * Con cinco casilleros, «Trasplante» ensanchaba su columna y a 320 px la página
 * de la planta scrolleaba de costado. Al 200 %, también el «Anotar algo».
 */
for (const [ancho, letra] of [
  [320, 100],
  [390, 130],
  [320, 200],
] as const) {
  test(`la página de la planta no se sale · ${ancho} px, letra al ${letra} %`, async ({ page }) => {
    await page.setViewportSize({ width: ancho, height: 844 })
    await conDemo(page)
    await abrir(page, '/#/huerta', async (p) => {
      await p.addStyleTag({ content: `html { font-size: ${letra}% }` })
      await p
        .locator('section.lugar', { has: p.getByRole('button', { name: /^Almaciguera del balcón/ }) })
        .getByRole('link', { name: /Los del cajón/ })
        .click()
      await expect(p.locator('.pagina-planta-casillero'), 'Los del cajón pasa por cinco hitos').toHaveCount(5)
    })
    const { casilleros, pagina } = await page.evaluate(() => ({
      casilleros: [...document.querySelectorAll('.pagina-planta-casillero')].map((c) => ({
        der: c.getBoundingClientRect().right,
        desborda: c.scrollWidth > c.clientWidth,
      })),
      pagina: document.documentElement.scrollWidth,
    }))
    for (const c of casilleros) {
      expect(c.der, 'un casillero se sale por la derecha').toBeLessThanOrEqual(ancho)
      expect(c.desborda, 'el texto se sale de su casillero').toBe(false)
    }
    expect(pagina, 'la página scrollea de costado').toBeLessThanOrEqual(ancho)
  })
}

/**
 * La zona segura de abajo cambia sin que cambie el ancho (Safari al esconder
 * su barra, Android de borde a borde), y lo que mide la barra tiene que
 * seguirla. Mirando sólo el contenido, --tab-ocupa se quedaba en 72 con la
 * barra en 93.
 */
test('lo que ocupa la barra sigue a la zona segura', async ({ page }) => {
  await abrir(page, '/#/hoy')
  const cdp = await page.context().newCDPSession(page)
  const medir = () =>
    page.evaluate(() => ({
      barra: document.querySelector<HTMLElement>('.tabbar')!.offsetHeight,
      ocupa: parseFloat(document.documentElement.style.getPropertyValue('--tab-ocupa')),
    }))
  const sinZona = (await medir()).barra
  for (const bottom of [34, 0]) {
    await cdp.send('Emulation.setSafeAreaInsetsOverride', { insets: { bottom, bottomMax: bottom } })
    await expect.poll(async () => (await medir()).barra).toBe(bottom ? sinZona + bottom - 13 : sinZona)
    // el observador contesta en el cuadro siguiente
    await expect
      .poll(async () => {
        const { barra, ocupa } = await medir()
        return ocupa - barra
      }, { message: `con ${bottom} px de zona segura` })
      .toBe(0)
  }
})

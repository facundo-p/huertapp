import { test, expect, type Page } from '@playwright/test'
import { conHelada } from './apoyo-pronostico'

/**
 * Accesibilidad, como test y no como revisión de una sola vez.
 *
 * El brief la pone como no negociable: el color nunca es el único canal, los
 * targets táctiles ≥ 44 px y contraste AA. Las tres cosas se rompen solas al
 * agregar pantallas, así que se miden acá, en las siete pantallas, con datos
 * cargados —que es cuando aparecen los casos difíciles.
 */

const PANTALLAS = [
  { ruta: '/#/hoy', nombre: 'Esta semana' },
  { ruta: '/#/explorar', nombre: 'Explorar' },
  { ruta: '/#/explorar/tomate', nombre: 'Ficha' },
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
  { ruta: '/#/compost', nombre: 'Compost' },
  { ruta: '/#/compost/cocina-tachos', nombre: 'Compost capítulo' },
  // La ficha de una planta se llega clickeando: el id lo genera la app. Va la
  // zanahoria porque es la que trae el bloque de germinación entero —los tres
  // chips para decir cuándo asomó y el diagnóstico de la demora.
  {
    ruta: '/#/huerta',
    nombre: 'Planta',
    entrar: async (page: Page) => {
      await page.getByRole('link', { name: /Zanahoria/ }).click()
      await page.getByRole('button', { name: /Por qué puede estar tardando/ }).click()
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
  { ruta: '/#/ajustes', nombre: 'Ajustes' },
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

/**
 * Abre una pantalla y espera a que haya dibujado. Sin esto los tests miden a
 * veces el esqueleto vacío y pasan sin haber revisado nada: un test de
 * accesibilidad que pasa por llegar temprano es peor que no tenerlo.
 */
async function abrir(page: Page, ruta: string, entrar?: (page: Page) => Promise<void>) {
  await page.goto(ruta)
  await page.waitForLoadState('networkidle')
  await page.waitForFunction(
    () =>
      document.querySelectorAll('h1, h2, h3').length > 1 ||
      !!document.querySelector('.estado-vacio'),
    null,
    { timeout: 15_000 },
  )
  await page.evaluate(() => document.fonts.ready)
  if (entrar) {
    await entrar(page)
    await page.evaluate(() => document.fonts.ready)
  }
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
      return (
        [...document.querySelectorAll<HTMLElement>('button, a[href], [role="radio"]')]
          .filter((el) => el.offsetParent !== null && !el.classList.contains('sr-solo'))
          .map((el) => ({ el, r: el.getBoundingClientRect() }))
          .filter(({ r }) => r.width > 0 && r.height > 0)
          // Los enlaces dentro de un párrafo (fuentes, referencias) son texto
          // corrido: agrandarlos rompería la línea. WCAG los exime por eso mismo.
          .filter(({ el }) => !el.closest('p, .dato__texto, .glosario__texto'))
          .filter(({ r }) => r.height < MIN || r.width < MIN)
          .map(
            ({ el, r }) =>
              `${el.tagName.toLowerCase()}.${el.className} ${Math.round(r.width)}×${Math.round(r.height)}`,
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
        const rgb = (c: string) => (c.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number)
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
            const v = (getComputedStyle(n).backgroundColor.match(/[\d.]+/g) ?? []).map(Number)
            if (v.length < 3) continue
            const a = v[3] ?? 1
            if (a === 0) continue
            capas.push([v[0], v[1], v[2], a])
            if (a >= 0.999) break
          }
          // La base es el body, que siempre pinta `--papel` opaco. Se lee
          // computado y no como custom property: `--papel` es un hex y hay que
          // resolverlo a rgb igual.
          const b = (getComputedStyle(document.body).backgroundColor.match(/[\d.]+/g) ?? []).map(
            Number,
          )
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
          const c = (cs.color.match(/[\d.]+/g) ?? []).map(Number)
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

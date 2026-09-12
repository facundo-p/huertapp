import { test, expect } from '@playwright/test'

/**
 * El grano del suelo, medido sobre el píxel que se ve.
 *
 * `accesibilidad.spec.ts` compone las capas leyendo `backgroundColor`, y el
 * grano es un `background-image`: para ese test la textura no existe. O sea
 * que subirle --grano-fuerza baja el contraste de verdad y no falla nada.
 *
 * La primera versión de esta guarda leía el tile del CSS y lo componía a mano.
 * Pasaba en verde con el grano SIN DIBUJAR —el z-index lo dejaba abajo del
 * fondo del body—, que es el mismo error de siempre: medir la propiedad y no
 * lo que se ve. Ahora se saca una captura de un pedazo de suelo vacío, se la
 * devuelve al navegador y se leen los píxeles: el más oscuro del suelo es el
 * peor fondo que puede tocarle a una letra.
 */

const TEMAS = ['dia', 'noche'] as const

/** Los que se usan como texto sobre el suelo. --tinta-apagada no está: es
 *  decorativo por definición y el theme ya dice que un dato ahí está mal. */
const TEXTOS = [
  '--tinta',
  '--tinta-media',
  '--tinta-suave',
  '--tinta-tenue',
  '--verde-hoja',
  '--verde-prof',
  '--sol-texto',
  '--terracota-texto',
]

for (const tema of TEMAS) {
  test(`el grano del suelo no se come el contraste · tema ${tema}`, async ({ page }) => {
    await page.addInitScript((t) => {
      try {
        localStorage.setItem('huerta-gba:tema', t)
      } catch {
        /* storage bloqueado: corre en el tema por defecto */
      }
    }, tema)
    await page.goto('/#/hoy')
    await page.waitForLoadState('networkidle')

    // Se esconde la app y queda la pantalla entera de suelo. Buscar un hueco
    // libre entre el contenido es frágil: el primer intento agarró el
    // encabezado y midió el blanco de un botón contra la tinta de un título.
    // `visibility` y no `display`: el layout queda igual y el grano se pinta,
    // porque cuelga del body y no del root de React.
    await page.locator('#root').evaluate((el) => {
      ;(el as HTMLElement).style.visibility = 'hidden'
    })
    const png = (await page.screenshot()).toString('base64')

    const medido = await page.evaluate(
      async ({ png, tokens }: { png: string; tokens: string[] }) => {
        const img = new Image()
        img.src = `data:image/png;base64,${png}`
        await img.decode()
        const lienzo = document.createElement('canvas')
        lienzo.width = img.width
        lienzo.height = img.height
        const ctx = lienzo.getContext('2d')!
        ctx.drawImage(img, 0, 0)
        const px = ctx.getImageData(0, 0, lienzo.width, lienzo.height).data

        const f = (v: number) => {
          const s = v / 255
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
        }
        const lum = ([r, g, b]: number[]) => 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
        const ratio = (x: number[], y: number[]) => {
          const [p, q] = [lum(x), lum(y)].sort((m, n) => n - m)
          return (p + 0.05) / (q + 0.05)
        }

        let masOscuro = [255, 255, 255]
        let masClaro = [0, 0, 0]
        for (let i = 0; i < px.length; i += 4) {
          const p = [px[i], px[i + 1], px[i + 2]]
          if (lum(p) < lum(masOscuro)) masOscuro = p
          if (lum(p) > lum(masClaro)) masClaro = p
        }

        const rgb = (c: string) => (c.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number)
        const sonda = document.createElement('span')
        document.body.appendChild(sonda)
        const pares = tokens.map((t) => {
          sonda.style.color = `var(${t})`
          return { token: t, contraste: ratio(rgb(getComputedStyle(sonda).color), masOscuro) }
        })
        sonda.remove()

        return {
          fuerza: Number(getComputedStyle(document.body, '::before').opacity),
          papel: rgb(getComputedStyle(document.body).backgroundColor),
          masOscuro,
          masClaro,
          // en canales y no en luminancia: de noche los valores son tan bajos
          // que la luminancia redondea todo a cero y el grano parece no estar
          amplitud: Math.max(...[0, 1, 2].map((i) => masClaro[i] - masOscuro[i])),
          pares,
        }
      },
      { png, tokens: TEXTOS },
    )

    // el informe sale siempre: cuando falla, el número que hay que tocar es
    // --grano-fuerza y conviene tenerlo a mano
    console.log(
      `[${tema}] fuerza ${medido.fuerza} · suelo dibujado ${medido.masOscuro.join(',')} a ` +
        `${medido.masClaro.join(',')} (papel ${medido.papel.join(',')}) · amplitud ${medido.amplitud}`,
    )
    for (const p of medido.pares) console.log(`   ${p.token.padEnd(20)} ${p.contraste.toFixed(2)}:1`)

    // Que el grano EXISTA. Sin esto la guarda pasa con la textura apagada o
    // tapada, que fue exactamente lo que pasó.
    expect(medido.amplitud, 'el suelo salió plano: el grano no se está dibujando').toBeGreaterThan(1)

    const flojos = medido.pares.filter((p) => p.contraste < 4.5)
    expect(flojos.map((p) => `${p.token} ${p.contraste.toFixed(2)}:1`)).toEqual([])
  })
}

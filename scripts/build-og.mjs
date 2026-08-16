/**
 * Genera la imagen de previsualización (og:image) — la tarjeta que se ve
 * cuando alguien pega el link en WhatsApp, Twitter o Instagram.
 *
 * Para esta app es probablemente el activo de difusión más importante: se va a
 * compartir mucho más por WhatsApp que por buscador, y un link sin imagen se
 * ve como spam.
 *
 * Mismo truco que los íconos: se compone en HTML y lo renderiza el Chromium de
 * Playwright, que ya está instalado para los tests. Se corre a mano cuando
 * cambia el mensaje: `npm run og`.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { chromium } from '@playwright/test'
import { iconoSvg } from './icono-app.mjs'

// Tamaño canónico de Open Graph. WhatsApp recorta a cuadrado en la vista de
// chat, así que lo importante va al centro y nada crítico toca los bordes.
const ANCHO = 1200
const ALTO = 630

/**
 * La fuente va embebida como data URI, no como `file://`.
 *
 * Con `setContent` la página queda en `about:blank` y el navegador bloquea
 * cualquier `file://`: el @font-face falla en silencio y la tarjeta sale con la
 * tipografía del sistema, que es justo lo que no queremos. En base64 no depende
 * de ningún permiso.
 */
async function fuente(familia, archivo, pesos) {
  const ruta = new URL(`../node_modules/@fontsource-variable/${archivo}`, import.meta.url)
  const b64 = (await readFile(ruta)).toString('base64')
  return `
  @font-face {
    font-family: '${familia}';
    font-weight: ${pesos};
    src: url(data:font/woff2;base64,${b64}) format('woff2-variations');
  }`
}

const html = `<!doctype html>
<meta charset="utf-8">
<style>
  ${await fuente('Quicksand', 'quicksand/files/quicksand-latin-wght-normal.woff2', '300 700')}
  ${await fuente('Nunito', 'nunito/files/nunito-latin-wght-normal.woff2', '200 1000')}

  * { margin: 0; box-sizing: border-box; }
  body {
    width: ${ANCHO}px; height: ${ALTO}px;
    display: flex; flex-direction: column; justify-content: center;
    gap: 34px; padding: 78px 88px;
    background-color: #f6efdd;
    /* la misma textura de papel de la app, para que la tarjeta y la app se
       reconozcan como la misma cosa */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.29 0 0 0 0 0.25 0 0 0 0 0.12 0 0 0 0.045 0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
    color: #3a4030;
    font-family: 'Nunito', sans-serif;
  }

  .fila { display: flex; align-items: center; gap: 36px; }
  .marca { width: 150px; height: 150px; border-radius: 34px; flex: none;
           box-shadow: 0 10px 28px rgba(51, 80, 43, 0.26); overflow: hidden; }
  .marca svg { width: 100%; height: 100%; display: block; }

  h1 { font-family: 'Quicksand', sans-serif; font-weight: 700; font-size: 92px;
       line-height: 1; letter-spacing: -0.015em; }
  .onda { margin-top: 14px; height: 10px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='10' viewBox='0 0 28 6'%3E%3Cpath d='M0 3 Q 3.5 0, 7 3 T 14 3 T 21 3 T 28 3' fill='none' stroke='%237fa06f' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: repeat-x; }

  .bajada { font-size: 43px; line-height: 1.28; font-weight: 600; color: #5c6350; max-width: 15.5em; }
  .bajada b { color: #33502b; font-weight: 800; }

  .patas { display: flex; gap: 14px; flex-wrap: wrap; }
  .pata { padding: 12px 26px; border-radius: 999px; background: #fdf9ee;
          border: 2px solid #ddd2b6; font-size: 28px; font-weight: 700; color: #5c6350; }
  .pata.es-verde { background: #e2ecd8; border-color: #4b713e; color: #33502b; }
</style>

<div class="fila">
  <div class="marca">${iconoSvg()}</div>
  <div>
    <h1>Huerta GBA</h1>
    <div class="onda"></div>
  </div>
</div>

<p class="bajada">Qué sembrar y cuándo en el <b>Gran Buenos Aires</b>, afinado a períodos de 10 días y a tu zona.</p>

<div class="patas">
  <span class="pata es-verde">55 especies</span>
  <span class="pata">Con las fuentes de cada dato</span>
  <span class="pata">Funciona sin internet</span>
</div>
`

const navegador = await chromium.launch()
const pagina = await navegador.newPage({
  viewport: { width: ANCHO, height: ALTO },
  deviceScaleFactor: 1,
})
await pagina.setContent(html)
await pagina.evaluate(() => document.fonts.ready)

// Que la tipografía haya cargado no es un detalle estético: si falla, la
// tarjeta sale con la fuente del sistema y no se parece en nada a la app.
const fallidas = await pagina.evaluate(() =>
  [...document.fonts].filter((f) => f.status !== 'loaded').map((f) => f.family),
)
if (fallidas.length) throw new Error(`no cargaron las fuentes: ${fallidas.join(', ')}`)

const png = await pagina.screenshot()
await writeFile(new URL('../public/og-image.png', import.meta.url), png)
console.log(`✓ public/og-image.png — ${ANCHO}×${ALTO} (${(png.length / 1024).toFixed(0)} KB)`)

await navegador.close()

/**
 * La versión de la app, en un solo lugar.
 *
 * Sale de `package.json` y la inyecta Vite en el build (ver `vite.config.ts`).
 * Se usa el esquema **SemVer de tres partes**, `MAYOR.MENOR.PARCHE`, y no uno
 * de cuatro: el cuarto segmento suele codificar el número de build, y acá eso
 * ya existe con más información — el service worker se identifica con un hash
 * del contenido que precachea, así que dos builds distintos son distintos
 * aunque la versión no cambie.
 *
 * Qué significa cada parte en este proyecto:
 *
 * - **MAYOR**: cambia lo que la gente ya sabía usar, o los datos guardados
 *   necesitan migración.
 * - **MENOR**: funciones nuevas, y **también datos nuevos o corregidos** —
 *   sumar una especie o cambiar una ventana de siembra no es un detalle
 *   técnico, es de lo que se trata la app.
 * - **PARCHE**: arreglos, textos, accesibilidad, performance.
 */
export const VERSION = __VERSION_APP__

/** El commit con el que se compiló, para poder reproducir un reporte. */
export const COMMIT = __COMMIT_APP__

/** Cómo se muestra: "1.0.0 (a1b2c3d)". */
export const VERSION_LARGA = `${VERSION} (${COMMIT})`

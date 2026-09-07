import type { EstadoMes } from './data/especies'

// El año como un reloj: 36 décadas de 10°, arrancando a las 12 en punto
// (0° = 1 de enero) y girando en sentido horario.
//
// Todo lo de acá es geometría pura y se testea sin pintar nada: un error de
// medio grado no rompe ningún render pero corre el calendario entero.

export const GRADOS_POR_DECADA = 10

/** Color de cada tramo del relleno, por estado. */
const RELLENO: Record<'ideal' | 'posible' | 'nada', string> = {
  ideal: 'var(--verde-hoja)',
  posible: 'var(--sol)',
  nada: 'var(--anillo-vacio)',
}

/**
 * El `conic-gradient` del relleno: 36 tramos duros de 10°, sin degradado
 * entre uno y otro.
 */
export function relleno(decadas: EstadoMes[], vacio = RELLENO.nada): string {
  const tramos = decadas.map((e, i) => {
    const c = e ? RELLENO[e] : vacio
    return `${c} ${i * GRADOS_POR_DECADA}deg ${(i + 1) * GRADOS_POR_DECADA}deg`
  })
  return `conic-gradient(${tramos.join(',')})`
}

/**
 * La capa de marcas, encima del relleno: barras de mes cada 30° y hairlines
 * de década cada 10°, con todo lo demás transparente.
 *
 * Sin esto el anillo no se puede leer: son 36 tramos de color y nada que diga
 * dónde empieza cada mes.
 *
 * `k` escala el ancho de las barras. En el anillo chico va 1.5 y `tercio` en
 * transparente: a 56 px las hairlines de década se empastan entre sí.
 */
export function marcas(mes: string, tercio: string, k = 1): string {
  const st: string[] = []
  let cur = 0
  for (let i = 0; i < 36; i++) {
    const a = i * GRADOS_POR_DECADA
    const esMes = i % 3 === 0
    const w = (esMes ? 1.8 : 1) * k
    const c = esMes ? mes : tercio
    const s0 = a - w / 2
    const e0 = a + w / 2
    // la marca de 0° se parte en dos: la mitad de atrás cierra el círculo
    if (i === 0) st.push(`${c} 0deg ${e0}deg`)
    else st.push(`transparent ${cur}deg ${s0}deg`, `${c} ${s0}deg ${e0}deg`)
    cur = e0
  }
  st.push(`transparent ${cur}deg 359.1deg`, `${mes} 359.1deg 360deg`)
  return `conic-gradient(${st.join(',')})`
}

/**
 * Dónde apunta la aguja de hoy: al CENTRO de la década en curso, no al
 * comienzo del año. Ponerla en 0° es el error fácil, y deja la aguja clavada
 * en las 12 todo el año.
 */
export function anguloDeDecada(decada: number): number {
  return (decada - 1) * GRADOS_POR_DECADA + GRADOS_POR_DECADA / 2
}

/** Dónde va la inicial de un mes: centrada en su mes. */
export function anguloDeMes(mes: number): number {
  return (mes - 1) * 30 + 15
}

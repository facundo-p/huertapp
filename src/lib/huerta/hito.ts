import type { EspecieEnriquecida } from '../data/types'
import { estadoHito, estimar, textoHito, type EstadoHito } from './estimar'
import {
  germinacion,
  germinacionPendiente,
  textoGerminacion,
  type EstadoGerminacion,
} from './germinacion'
import { hoyISO, type Planta } from './tipos'

/**
 * La línea que resume en qué anda una planta: la misma frase que muestra la
 * fila del gantt y la que la ficha del lugar levanta cuando está plegada.
 *
 * Vive acá y no en el componente porque la usan dos lugares, y la misma frase
 * dicha en dos lados se despega enseguida.
 *
 * Esperar a que asome tiene precedencia: mientras no germinó, ése es EL dato y
 * los demás hitos se callan (la regla es de `germinacionPendiente`).
 */

export interface Linea {
  texto: string
  estado: EstadoHito
}

/** Los que no están acá —temprano, germinó, no aplica— no urgen. */
const DE_GERMINACION: Partial<Record<EstadoGerminacion, EstadoHito>> = {
  demorada: 'demorado',
  en_ventana: 'listo',
}

export function hitoDePlanta(p: Planta, e: EspecieEnriquecida, hoy = hoyISO()): Linea | null {
  const germ = germinacion(p, e, hoy)
  if (germinacionPendiente(germ)) {
    return {
      texto: textoGerminacion(germ),
      estado: DE_GERMINACION[germ.estado] ?? 'neutro',
    }
  }
  const proximo = estimar(p, e, hoy).proximo
  if (!proximo) return null
  return {
    texto: `${proximo.titulo}: ${textoHito(proximo)}`,
    estado: estadoHito(proximo),
  }
}

const PESO: Record<EstadoHito, number> = { demorado: 0, listo: 1, neutro: 2 }

/**
 * Lo más urgente que tiene el lugar para decir. Alimenta la ficha plegada
 * cuando el motor de tareas no emitió ninguna: plegar tiene que ahorrar
 * espacio, no información.
 */
export function hitoDelLugar(
  plantas: Planta[],
  porSlug: Map<string, EspecieEnriquecida>,
  hoy = hoyISO(),
): Linea | null {
  const lineas = plantas
    .map((p) => {
      const e = porSlug.get(p.slug)
      return e ? hitoDePlanta(p, e, hoy) : null
    })
    .filter((l): l is Linea => !!l)
  if (!lineas.length) return null
  return [...lineas].sort((a, b) => PESO[a.estado] - PESO[b.estado])[0]
}

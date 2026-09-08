import type { Decada, EspecieEnriquecida, Grupo, Mes, Zona } from './data/types'
import { decadasDelAnio, estado, type Capa, type EstadoMes } from './data/especies'
import { ventanas } from './huerta/gantt'
import { diasEntre, hoyISO, type Planta } from './huerta/tipos'
import { decadasDelMes, mesDeDecada, ultimoDiaDeDecada } from './fechas'

/**
 * La grilla del Calendario: qué se dibuja en cada fila y qué dice el panel
 * del mes. Todo puro y en décadas (36 por año): el catálogo no sabe de días.
 */

export type CapaCalendario = Capa | 'cosecha'

/**
 * La ventana de cosecha no está en el catálogo: se DERIVA de cada tramo de
 * siembra (ideal y posible) más `dias_a_cosecha`, proyectada sobre las 36
 * décadas con vuelta de año. Sin `dias_a_cosecha` son 36 vacíos: la fila se
 * muestra vacía, no se oculta, porque un hueco es más honesto que inventar.
 */
export function decadasDeCosecha(e: EspecieEnriquecida, zona: Zona): EstadoMes[] {
  const salida: EstadoMes[] = Array.from({ length: 36 }, () => null)
  const r = e.dias_a_cosecha
  if (!r) return salida
  const siembra = decadasDelAnio(e, zona, 'siembra')
  // una década son ~10 días: el rango se corre en décadas enteras
  const desde = Math.floor(r.min / 10)
  const hasta = Math.ceil(r.max / 10)
  for (let i = 0; i < 36; i++) {
    const s = siembra[i]
    if (!s) continue
    for (let k = desde; k <= hasta; k++) {
      const j = (i + k) % 36
      // ideal pisa a posible: una década que se cosecha de una siembra ideal
      // es cosecha ideal, aunque otra siembra posible también caiga ahí
      if (s === 'ideal' || salida[j] === null) salida[j] = s
    }
  }
  return salida
}

/** Las 36 décadas de una capa cualquiera, en el orden de las columnas. */
export function decadasDeCapa(e: EspecieEnriquecida, zona: Zona, capa: CapaCalendario): EstadoMes[] {
  return capa === 'cosecha' ? decadasDeCosecha(e, zona) : decadasDelAnio(e, zona, capa)
}

export interface Tramo {
  /** décadas 1..36, inclusive */
  desde: Decada
  hasta: Decada
  estado: 'ideal' | 'posible'
}

/**
 * Décadas contiguas del mismo estado, como tramos. No cruza el fin de año: la
 * grilla es lineal y un tramo que cruza se dibuja en dos pedazos. «Agosto
 * posible + septiembre ideal» son dos tramos que se tocan, y así se leen.
 */
export function tramos(decadas: EstadoMes[]): Tramo[] {
  const salida: Tramo[] = []
  for (let i = 0; i < decadas.length; i++) {
    const st = decadas[i]
    if (!st) continue
    const ultimo = salida.at(-1)
    if (ultimo && ultimo.estado === st && ultimo.hasta === i) ultimo.hasta = (i + 1) as Decada
    else salida.push({ desde: (i + 1) as Decada, hasta: (i + 1) as Decada, estado: st })
  }
  return salida
}

export interface FilaCalendario {
  especie: EspecieEnriquecida
  decadas: EstadoMes[]
  tramos: Tramo[]
  /** hay al menos una planta activa de esta especie en la huerta */
  enMiHuerta: boolean
}

export interface GrupoCalendario {
  grupo: Grupo
  filas: FilaCalendario[]
}

/** Las especies con alguna planta activa (ni archivada ni terminada). */
export function slugsEnMiHuerta(plantas: Planta[]): Set<string> {
  return new Set(plantas.filter((p) => !p.archivada && p.etapa !== 'terminada').map((p) => p.slug))
}

/**
 * Los grupos y filas de la grilla. `soloMia` deja las especies plantadas y
 * borra los grupos que quedan vacíos; en la capa de trasplante van solo las
 * que se trasplantan, como siempre.
 */
export function filasCalendario(
  porGrupo: Map<Grupo, EspecieEnriquecida[]>,
  orden: Grupo[],
  plantas: Planta[],
  zona: Zona,
  { capa, soloMia, grupo }: { capa: CapaCalendario; soloMia: boolean; grupo: Grupo | null },
): GrupoCalendario[] {
  const mias = slugsEnMiHuerta(plantas)
  return orden
    .filter((g) => !grupo || g === grupo)
    .map((g) => ({
      grupo: g,
      filas: (porGrupo.get(g) ?? [])
        .filter((e) => !soloMia || mias.has(e.slug))
        .filter((e) => capa !== 'trasplante' || decadasDelAnio(e, zona, 'trasplante').some(Boolean))
        .sort((a, b) => a.nombre_comun.localeCompare(b.nombre_comun, 'es'))
        .map((e) => {
          const decadas = decadasDeCapa(e, zona, capa)
          return { especie: e, decadas, tramos: tramos(decadas), enMiHuerta: mias.has(e.slug) }
        }),
    }))
    .filter((s) => s.filas.length > 0)
}

export interface TercioDelMes {
  decada: Decada
  /** nombres para sembrar, ideal primero, cortados en `limite` */
  siembra: string[]
  /** cuántos quedaron fuera del corte */
  demas: number
  /** «trasplantás los del cajón», «cosechás rúcula» */
  enTuHuerta: string[]
}

/**
 * La fecha en que empieza y termina una década, elegida en el año en que cae
 * más cerca de hoy (mirando hasta 45 días para atrás): el panel habla de la
 * próxima vez que ese tercio ocurre, no de la del año pasado.
 */
function fechasDeDecada(d: Decada, hoy: string): [string, string] {
  const anio = Number(hoy.slice(0, 4))
  const mes = mesDeDecada(d)
  const mm = String(mes).padStart(2, '0')
  const t = (d - 1) % 3
  const dia1 = t === 0 ? 1 : t === 1 ? 11 : 21
  for (const a of [anio, anio + 1]) {
    const desde = `${a}-${mm}-${String(dia1).padStart(2, '0')}`
    const hasta = `${a}-${mm}-${String(ultimoDiaDeDecada(d)).padStart(2, '0')}`
    if (diasEntre(hoy, hasta) >= -45) return [desde, hasta]
  }
  return [`${anio + 1}-${mm}-01`, `${anio + 1}-${mm}-${ultimoDiaDeDecada(d)}`]
}

const seSolapan = (a: [number, number], b: [number, number]) => a[0] <= b[1] && b[0] <= a[1]

/** Cuántas décadas seguidas de ventana ideal quedan desde `d`, incluida. */
function decadasIdealesDesde(e: EspecieEnriquecida, d: Decada, zona: Zona): number {
  let n = 0
  let x = d
  while (n < 36 && estado(e, x, zona, 'siembra') === 'ideal') {
    n++
    x = ((x % 36) + 1) as Decada
  }
  return n
}

/**
 * Los tres textos del panel del mes: qué se siembra en cada tercio y qué pasa
 * en tu huerta según las `ventanas()` de cada planta activa.
 *
 * Relevancia: primero lo ideal que antes se cierra —el mismo criterio de
 * «Sembrá ahora»—, después lo ideal que sigue, después lo posible. Con orden
 * alfabético los tres tercios mostraban los mismos siete nombres y el corte
 * no decía nada.
 */
export function terciosDelMes(
  mes: Mes,
  especies: EspecieEnriquecida[],
  porSlug: Map<string, EspecieEnriquecida>,
  plantas: Planta[],
  zona: Zona,
  hoy = hoyISO(),
  limite = 7,
): TercioDelMes[] {
  const activas = plantas.filter((p) => !p.archivada && p.etapa !== 'terminada')
  return decadasDelMes(mes).map((d) => {
    const ideal: { nombre: string; quedan: number }[] = []
    const posible: string[] = []
    for (const e of especies) {
      const st = estado(e, d, zona, 'siembra')
      if (st === 'ideal') ideal.push({ nombre: e.nombre_comun, quedan: decadasIdealesDesde(e, d, zona) })
      else if (st === 'posible') posible.push(e.nombre_comun)
    }
    const orden = (a: string, b: string) => a.localeCompare(b, 'es')
    const todos = [
      ...ideal.sort((a, b) => a.quedan - b.quedan || orden(a.nombre, b.nombre)).map((x) => x.nombre),
      ...posible.sort(orden),
    ]

    const [desde, hasta] = fechasDeDecada(d, hoy)
    const rango: [number, number] = [diasEntre(hoy, desde), diasEntre(hoy, hasta)]
    const enTuHuerta: string[] = []
    for (const p of activas) {
      const e = porSlug.get(p.slug)
      if (!e) continue
      const v = ventanas(p, e, hoy)
      const nombre = (p.apodo || e.nombre_comun).toLowerCase()
      if (v.trasplante && seSolapan(v.trasplante, rango)) enTuHuerta.push(`trasplantás ${nombre}`)
      if (v.cosecha && seSolapan(v.cosecha, rango)) enTuHuerta.push(`cosechás ${nombre}`)
    }

    return {
      decada: d,
      siembra: todos.slice(0, limite),
      demas: Math.max(0, todos.length - limite),
      enTuHuerta: [...new Set(enTuHuerta)],
    }
  })
}

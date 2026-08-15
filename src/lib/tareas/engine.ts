import type { ClimaDecada, EspecieEnriquecida, Zona } from '../data/types'
import { estadoSiembra, metodoDelMes } from '../data/especies'
import { decadaDe, mesDeDecada, nombreDecada, siguienteDecada } from '../fechas'
import { diasEntre, hoyISO, type Planta } from '../huerta/tipos'
import { estimar } from '../huerta/estimar'
import { germinacion } from '../huerta/germinacion'

/**
 * Motor de tareas: función pura de (plantas, especies, zona, hoy) a lista de
 * tareas. Sin fechas implícitas ni estado escondido, así se puede testear
 * inyectando el día.
 *
 * Dos reglas de diseño:
 *
 * 1. **Los ids son determinísticos.** Se arman con el tipo, la planta y el
 *    hito, nunca con un contador ni con la fecha de hoy. Si no, al día
 *    siguiente la misma tarea tendría otro id y reaparecería aunque la hayas
 *    completado.
 *
 * 2. **Toda tarea dice de dónde sale.** El campo `fuente` lleva el dato y su
 *    confianza ("según la ficha: 30-60 días · confianza 9/10"). Una app que te
 *    dice qué hacer sin decir por qué es una app en la que no se puede confiar.
 */

export type TipoTarea = 'trasplantar' | 'revisar_germinacion' | 'cosechar' | 'helada' | 'sembrar'

export interface Tarea {
  id: string
  tipo: TipoTarea
  plantaId?: string
  slug?: string
  titulo: string
  detalle: string
  /** de dónde sale el consejo, para poder desconfiar con criterio */
  fuente: string
  /** menor = más arriba */
  prioridad: number
  /** true si ya se pasó de tiempo */
  atrasada?: boolean
}

export interface EstadoTarea {
  /** ids completados, con la fecha en que se completaron */
  completadas: Record<string, string>
  /** ids pospuestos, con la fecha hasta la que se ocultan */
  pospuestas: Record<string, string>
}

export const ESTADO_VACIO: EstadoTarea = { completadas: {}, pospuestas: {} }

const conf = (n: number) => `confianza ${n}/10`

export interface EntradaMotor {
  plantas: Planta[]
  porSlug: Map<string, EspecieEnriquecida>
  /** la zona ya viene resuelta acá: son sus 36 décadas */
  clima: ClimaDecada[]
  hoy?: string
}

export function derivarTareas({ plantas, porSlug, clima, hoy = hoyISO() }: EntradaMotor): Tarea[] {
  const tareas: Tarea[] = []
  const decada = decadaDe(new Date(`${hoy}T12:00:00`))
  const activas = plantas.filter((p) => !p.archivada && p.etapa !== 'terminada')

  for (const p of activas) {
    const e = porSlug.get(p.slug)
    if (!e) continue
    const nombre = p.apodo || e.nombre_comun

    // ── germinación pasada de plazo ──────────────────────────────────────────
    const g = germinacion(p, e, hoy)
    if (g?.estado === 'demorada') {
      tareas.push({
        id: `revisar_germinacion:${p.id}`,
        tipo: 'revisar_germinacion',
        plantaId: p.id,
        slug: e.slug,
        titulo: `${nombre}: fijate si asomó`,
        detalle:
          g.diasDeMas === 1
            ? 'Se pasó por un día del plazo de germinación.'
            : `Hace ${g.diasDeMas} días que se pasó del plazo. Si no hay nada, puede que esas semillas no prosperen.`,
        fuente: `según la ficha: germina en ${e.dias_germinacion!.min}-${e.dias_germinacion!.max} días · ${conf(e.germinacion.confianza)}`,
        prioridad: 2,
        atrasada: true,
      })
    }

    const est = estimar(p, e, hoy)

    // ── trasplante ───────────────────────────────────────────────────────────
    if (p.etapa === 'almacigo' && est.trasplante?.enVentana) {
      const riesgo = clima[decada - 1]?.helada ?? 0
      const peligroso = e.temperaturas.helada === 'muere' && riesgo >= 0.2
      tareas.push({
        id: `trasplantar:${p.id}`,
        tipo: 'trasplantar',
        plantaId: p.id,
        slug: e.slug,
        titulo: `${nombre}: hora de trasplantar`,
        detalle: peligroso
          ? `Está en edad, pero todavía hay ${Math.round(riesgo * 100)} % de probabilidad de helada y no la banca. Si podés, esperá o cubrila de noche.`
          : `Ya tiene edad de pasar a su lugar definitivo. ${e.transplante.signos_listo}`,
        fuente: `según la ficha: ${e.dias_a_trasplante!.min}-${e.dias_a_trasplante!.max} días desde la siembra · ${conf(e.transplante.confianza)}`,
        prioridad: peligroso ? 3 : 1,
      })
    }

    // ── cosecha ──────────────────────────────────────────────────────────────
    if (est.cosecha?.enVentana && p.etapa !== 'cosechando') {
      tareas.push({
        id: `cosechar:${p.id}`,
        tipo: 'cosechar',
        plantaId: p.id,
        slug: e.slug,
        titulo: `${nombre} ya estaría para cosechar`,
        detalle: e.cosecha.indicadores_listo,
        fuente: `según la ficha: ${e.dias_a_cosecha!.min}-${e.dias_a_cosecha!.max} días desde la siembra · ${conf(e.cosecha.confianza)}`,
        prioridad: 2,
      })
    }
  }

  // ── helada a la vista ──────────────────────────────────────────────────────
  const riesgo = clima[siguienteDecada(decada) - 1]?.helada ?? 0
  if (riesgo >= 0.3) {
    const expuestas = activas.filter((p) => {
      const e = porSlug.get(p.slug)
      const tolera = e?.temperaturas.crecimiento.tolera_min
      return (
        e?.temperaturas.helada === 'muere' &&
        (tolera == null || tolera > 0) &&
        p.etapa !== 'almacigo'
      )
    })
    if (expuestas.length) {
      const nombres = expuestas
        .map((p) => (p.apodo || porSlug.get(p.slug)!.nombre_comun).toLowerCase())
        .slice(0, 3)
      tareas.push({
        id: `helada:${nombreDecada(siguienteDecada(decada))}`,
        tipo: 'helada',
        titulo: 'Puede helar',
        detalle: `Todavía hay ${Math.round(riesgo * 100)} % de probabilidad de helada. Cubrí de noche ${nombres.join(', ')}${expuestas.length > 3 ? ' y las demás' : ''}: la helada las mata.`,
        fuente: 'estadística de heladas del AMBA (FAUBA, umbral de 3 °C) para tu zona',
        prioridad: 0,
      })
    }
  }

  return tareas.sort((a, b) => a.prioridad - b.prioridad || a.titulo.localeCompare(b.titulo, 'es'))
}

/** Saca de la lista lo completado y lo pospuesto que sigue vigente. */
export function tareasVisibles(tareas: Tarea[], estado: EstadoTarea, hoy = hoyISO()): Tarea[] {
  return tareas.filter((t) => {
    if (estado.completadas[t.id]) return false
    const hasta = estado.pospuestas[t.id]
    return !hasta || diasEntre(hoy, hasta) <= 0
  })
}

/**
 * Especies para sembrar ahora, ordenadas por cuánto falta para que se cierre
 * la ventana ideal: primero lo que se te va.
 */
export interface Sugerencia {
  especie: EspecieEnriquecida
  /** cuántas décadas quedan de ventana ideal */
  decadasRestantes: number
  seCierra: boolean
  enAlmacigo: boolean
}

export function paraSembrarAhora(
  especies: EspecieEnriquecida[],
  zona: Zona,
  hoy = hoyISO(),
  limite = 12,
): Sugerencia[] {
  const decada = decadaDe(new Date(`${hoy}T12:00:00`))
  const mes = mesDeDecada(decada)

  return especies
    .filter((e) => estadoSiembra(e, decada, zona) === 'ideal')
    .map((e) => {
      let restantes = 0
      let d = decada
      while (estadoSiembra(e, d, zona) === 'ideal' && restantes < 36) {
        restantes++
        d = siguienteDecada(d)
      }
      const metodo = metodoDelMes(e, mes)
      return {
        especie: e,
        decadasRestantes: restantes,
        seCierra: restantes <= 2,
        enAlmacigo: metodo === 'almacigo' || metodo === 'almacigo_protegido',
      }
    })
    .sort((a, b) => a.decadasRestantes - b.decadasRestantes || a.especie.nombre_comun.localeCompare(b.especie.nombre_comun, 'es'))
    .slice(0, limite)
}

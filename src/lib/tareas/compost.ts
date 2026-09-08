import type { Compostera } from '../huerta/tipos'
import { diasEntre } from '../huerta/tipos'
import { baseDelGiro, proximoGiro, revisionListo, textoRitmo } from '../huerta/compostera'
import type { Guia } from '../compostaje'
import type { Tarea } from './engine'

const conf = (n: number | null) => (n == null ? 'confianza s/d' : `confianza ${n}/10`)
const primeraFrase = (s: string | null) => (s ?? '').split('. ')[0].replace(/\.$/, '')
/** solo la inicial: «la Ciudad» y «la Provincia» siguen con mayúscula */
const minuscula = (s: string) => s.charAt(0).toLowerCase() + s.slice(1)

/**
 * Las tareas de las composteras, para un día dado. Girar sale de TU ritmo y
 * se cuenta desde el último giro anotado; la fuente cita igual lo que dice la
 * guía, así se ve si te alejaste mucho. «¿Ya está?» sale del plazo de la
 * guía para ese sistema, contado desde que dejó de recibir restos.
 */
export function tareasDeCompost(composteras: Compostera[], guia: Guia | null | undefined, hoy: string): Tarea[] {
  const tareas: Tarea[] = []
  for (const c of composteras) {
    const sis = guia?.sistemas[c.sistema]

    const giro = proximoGiro(c)
    if (giro && giro <= hoy) {
      const hace = diasEntre(baseDelGiro(c), hoy)
      const porQue = primeraFrase(sis?.girar.por_que.valor ?? null)
      tareas.push({
        id: `girar_compost:${c.id}:${giro}`,
        fecha: hoy,
        tipo: 'girar_compost',
        composteraId: c.id,
        titulo: `${c.nombre}: revolvé el compost`,
        detalle: `${c.girada ? 'Hace' : 'Sin giro anotado desde hace'} ${hace} ${hace === 1 ? 'día' : 'días'}.${porQue ? ` ${porQue}.` : ''}`,
        fuente: sis
          ? `tu ritmo: ${textoRitmo(c.ritmoDias)} · la guía: ${minuscula(primeraFrase(sis.girar.cuando.valor))} · ${conf(sis.girar.cuando.confianza)}`
          : `tu ritmo: ${textoRitmo(c.ritmoDias)}`,
        prioridad: 2,
        atrasada: giro < hoy,
      })
    }

    const revision = sis ? revisionListo(c, sis.listo_desde.dias) : null
    if (revision && revision <= hoy && c.cerrada && sis) {
      const senales = guia!.comun.listo.senales.items.slice(0, 3).map((s) => s.toLowerCase())
      tareas.push({
        id: `compost_listo:${c.id}:${c.cerrada}`,
        fecha: hoy,
        tipo: 'compost_listo',
        composteraId: c.id,
        titulo: `${c.nombre}: fijate si el compost ya está`,
        detalle: `Las señales: ${senales.join('; ')}.`,
        fuente: `según la guía: ${sis.listo_desde.valor ?? 's/d'} · ${conf(sis.listo_desde.confianza)}`,
        prioridad: 3,
      })
    }
  }
  return tareas
}

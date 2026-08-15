import { sumarDias } from '../huerta/estimar'
import { derivarTareas, tareasVisibles, type EntradaMotor, type EstadoTarea } from './engine'

/**
 * La agenda de los próximos días: qué avisar y cuándo.
 *
 * Existe porque el service worker, que es el único que puede despertar a la app
 * cuando está cerrada, no puede correr el motor de tareas: necesitaría las 55
 * especies y el modelo climático adentro. Duplicarlo ahí sería tener dos
 * fuentes de verdad, y la de background siempre sería la vieja.
 *
 * Entonces el motor corre acá, adelantado: se lo evalúa día por día sobre las
 * próximas semanas y se anota **solo los días en que aparece algo nuevo**. Un
 * aviso por cada día en que la huerta cambia de estado, no un recordatorio
 * diario de lo mismo —que es la forma más rápida de que alguien apague las
 * notificaciones para siempre.
 */

export interface Aviso {
  /** día en que corresponde avisar (ISO) */
  fecha: string
  titulo: string
  cuerpo: string
}

const MAX_AVISOS = 10

export function construirAgenda(
  entrada: Omit<EntradaMotor, 'hoy'>,
  estado: EstadoTarea,
  hoy: string,
  dias = 21,
): Aviso[] {
  const avisos: Aviso[] = []
  let previas = new Set<string>()

  for (let i = 0; i <= dias; i++) {
    const fecha = sumarDias(hoy, i)
    const tareas = tareasVisibles(derivarTareas({ ...entrada, hoy: fecha }), estado, fecha)
    const ids = new Set(tareas.map((t) => t.id))

    // solo si hay algo que no estaba ayer: si no, es el mismo aviso repetido
    const hayNovedad = tareas.some((t) => !previas.has(t.id))
    previas = ids

    if (!hayNovedad || tareas.length === 0) continue

    const [primera] = tareas
    avisos.push(
      tareas.length === 1
        ? { fecha, titulo: primera.titulo, cuerpo: primera.detalle }
        : {
            fecha,
            titulo: `${tareas.length} cosas para hacer en la huerta`,
            cuerpo: tareas.map((t) => t.titulo).join(' · '),
          },
    )
    if (avisos.length >= MAX_AVISOS) break
  }

  return avisos
}

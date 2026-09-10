import { Link } from 'react-router'
import type { EspecieEnriquecida } from '../lib/data/types'
import { ETAPA_INFO, type Planta } from '../lib/huerta/tipos'
import { hitoDePlanta } from '../lib/huerta/hito'
import { pct, ventanas, visible } from '../lib/huerta/gantt'
import { cantidadCorta } from '../lib/huerta/tanda'
import { IconoAlerta, IconoGrupo, IconoReloj } from '../icons'
import './GanttPlanta.css'

interface Props {
  planta: Planta
  especie: EspecieEnriquecida
  pendientes: number
  /** solo en plantación libre: en surcos o en macetas no hay nota que dar */
  conNota?: boolean
}

/** El estado del hito manda color, peso e ícono. El color nunca va solo. */
const CLASE_HITO = { demorado: 'es-demorada', listo: 'es-lista', neutro: '' } as const

/**
 * Una planta como una fila de gantt: el ciclo proyectado sobre 180 días, con
 * hoy fijo en el 33 %.
 *
 * Reemplaza a la tarjeta plegable. Ya no se pliega: la fila entera mide menos
 * que la tarjeta cerrada más su detalle, así que plegarla no ahorraba nada y
 * escondía justo lo que se viene a mirar.
 */
export function GanttPlanta({ planta, especie, pendientes, conNota }: Props) {
  const v = ventanas(planta, especie)
  const hito = hitoDePlanta(planta, especie)
  const nombre = planta.apodo || especie.nombre_comun

  const tramo = (t: [number, number]) => ({
    left: `${pct(t[0])}%`,
    width: `${pct(t[1]) - pct(t[0])}%`,
  })

  // Crecer va de la siembra hasta que arranca el trasplante; sin trasplante,
  // hasta la cosecha. Los tres tramos son etapas seguidas, no capas: pintar el
  // trasplante encima del verde lo dejaba como un manchón adentro de otra cosa.
  const finCrecer = visible(v.trasplante) ? v.trasplante![0] : (v.cosecha?.[0] ?? 120)
  // el ícono repite lo que dice el color: atrasado avisa, lo que falta espera.
  // Reloj y no el brote: a 12 px el brote es una mancha que no se identifica.
  const IconoDelHito = hito?.estado === 'demorado' ? IconoAlerta : IconoReloj

  return (
    <Link to={`/huerta/${planta.id}`} className="gantt">
      <span className="gantt__icono" aria-hidden>
        <IconoGrupo grupo={especie.grupo} size={15} decorativo />
      </span>

      <span className="gantt__caja">
        <span className="gantt__cabeza">
          <span className="gantt__nombre">{nombre}</span>
          <span className="gantt__sub">
            {planta.apodo ? `${especie.nombre_comun} · ` : ''}
            {cantidadCorta(planta) ? `${cantidadCorta(planta)} · ` : ''}
            {v.siembra === 0 ? 'sembrada hoy' : `hace ${-v.siembra} días`}
          </span>
          {pendientes > 0 && (
            <span className="gantt__alertas pulso">
              <IconoAlerta size={11} />
              {pendientes}
              <span className="sr-solo">
                {pendientes === 1 ? ' cosa para atender' : ' cosas para atender'}
              </span>
            </span>
          )}
        </span>

        {/* La aguja de hoy es lo ÚNICO vertical del track: es la referencia que
            explica la escala de meses de arriba. */}
        <span className="gantt__banda" aria-hidden>
          <span className="gantt__barra es-crece" style={tramo([v.siembra, finCrecer])} />
          {visible(v.trasplante) && (
            <span className="gantt__barra es-trasplante" style={tramo(v.trasplante!)} />
          )}
          {visible(v.cosecha) && (
            <span className="gantt__barra es-cosecha" style={tramo(v.cosecha!)} />
          )}
          <span className="gantt__hoy" />
        </span>

        {hito && (
          <span className={`gantt__hito ${CLASE_HITO[hito.estado]}`}>
            <IconoDelHito size={12} />
            {hito.texto}
          </span>
        )}

        {/* Cómo está puesta: solo tiene sentido donde no hay una celda por
            planta, que es justo donde la persona lo escribió. */}
        {conNota && planta.comoEsta && <span className="gantt__nota">{planta.comoEsta}</span>}
      </span>

      <span className={`gantt__etapa es-${planta.etapa}`}>{ETAPA_INFO[planta.etapa].etiqueta}</span>
    </Link>
  )
}

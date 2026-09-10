import { Link } from 'react-router'
import type { EspecieEnriquecida } from '../lib/data/types'
import { ETAPA_INFO, type Planta } from '../lib/huerta/tipos'
import { estadoHito, estimar, textoHito } from '../lib/huerta/estimar'
import {
  claseGerminacion,
  germinacion,
  germinacionPendiente,
  textoGerminacion,
} from '../lib/huerta/germinacion'
import { pct, ventanas, visible } from '../lib/huerta/gantt'
import { cantidadCorta } from '../lib/huerta/tanda'
import { IconoAlerta, IconoGrupo, IconoReloj, IconoSembrar } from '../icons'
import './GanttPlanta.css'

interface Props {
  planta: Planta
  especie: EspecieEnriquecida
  pendientes: number
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
export function GanttPlanta({ planta, especie, pendientes }: Props) {
  const v = ventanas(planta, especie)
  const est = estimar(planta, especie)
  const germ = germinacion(planta, especie)
  const nombre = planta.apodo || especie.nombre_comun
  const esperando = germinacionPendiente(germ)

  const tramo = (t: [number, number]) => ({
    left: `${pct(t[0])}%`,
    width: `${pct(t[1]) - pct(t[0])}%`,
  })

  // La barra de crecer va de la siembra hasta donde empieza la cosecha; si la
  // ficha no dice cuándo se cosecha, hasta el borde de la ventana.
  const finCrecer = v.cosecha ? v.cosecha[0] : 120
  // esperar a que asome silencia el próximo hito: es lo que está pasando ahora
  const proximo = esperando ? null : est.proximo
  const claseHito = esperando ? claseGerminacion(germ.estado) : proximo ? CLASE_HITO[estadoHito(proximo)] : ''
  // el ícono repite lo que dice el color: atrasado avisa, lo que falta espera
  const IconoDelHito = claseHito === 'es-demorada' ? IconoAlerta : esperando ? IconoSembrar : IconoReloj

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

        {/* La grilla de meses y la línea de hoy quedan ACOTADAS a esta banda a
            propósito: cruzando la fila entera pasaban por encima del nombre y
            del hito y ensuciaban la lectura. */}
        <span className="gantt__banda" aria-hidden>
          <span className="gantt__barra es-crece" style={tramo([v.siembra, finCrecer])} />
          {visible(v.trasplante) && (
            <span className="gantt__barra es-trasplante" style={tramo(v.trasplante!)} />
          )}
          {visible(v.cosecha) && (
            <span className="gantt__barra es-cosecha" style={tramo(v.cosecha!)} />
          )}
          <span className="gantt__siembra" style={{ left: `${pct(v.siembra)}%` }}>
            <IconoSembrar size={9} />
          </span>
          <span className="gantt__hoy" />
        </span>

        {(esperando || proximo) && (
          <span className={`gantt__hito ${claseHito}`}>
            <IconoDelHito size={12} />
            {esperando ? textoGerminacion(germ) : `${proximo!.titulo}: ${textoHito(proximo!)}`}
          </span>
        )}

        {/* Cómo está puesta: solo tiene sentido donde no hay una celda por
            planta, que es justo donde la persona lo escribió. */}
        {planta.comoEsta && <span className="gantt__nota">{planta.comoEsta}</span>}
      </span>

      <span className={`gantt__etapa es-${planta.etapa}`}>{ETAPA_INFO[planta.etapa].etiqueta}</span>
    </Link>
  )
}

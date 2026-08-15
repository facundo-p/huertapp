import { ETAPAS, ETAPA_INFO, type Etapa } from '../lib/huerta/tipos'
import { IconoAlmacigo, IconoCosechar, IconoFlor, IconoSembrar, IconoTrasplantar } from '../icons'
import './CycleProgress.css'

const ICONO: Record<Etapa, React.ComponentType<{ size?: number }>> = {
  almacigo: IconoAlmacigo,
  trasplantada: IconoTrasplantar,
  creciendo: IconoSembrar,
  cosechando: IconoCosechar,
  terminada: IconoFlor,
}

/**
 * La barrita del ciclo. Las etapas cumplidas van rellenas; la actual, marcada.
 *
 * Una planta sembrada directa nunca pasa por el almácigo NI por el trasplante:
 * esas dos etapas van tachadas en lugar de mostrarse como cumplidas, que sería
 * decirle al usuario que hizo algo que no hizo.
 */
export function CycleProgress({
  etapa,
  directa,
  compacto,
}: {
  etapa: Etapa
  /** sembrada directa o plantada: se saltea almácigo y trasplante */
  directa?: boolean
  compacto?: boolean
}) {
  const indiceActual = ETAPAS.indexOf(etapa)
  const salteadas: Etapa[] = directa ? ['almacigo', 'trasplantada'] : []
  return (
    <ol className={`ciclo ${compacto ? 'ciclo--compacto' : ''}`} aria-label={`Etapa: ${ETAPA_INFO[etapa].etiqueta}`}>
      {ETAPAS.map((e, i) => {
        const Icono = ICONO[e]
        const omitida = salteadas.includes(e)
        const clase = omitida
          ? 'es-omitida'
          : i < indiceActual
            ? 'es-hecha'
            : i === indiceActual
              ? 'es-actual'
              : 'es-pendiente'
        return (
          <li key={e} className={`ciclo__paso ${clase}`}>
            <span className="ciclo__punto">
              <Icono size={compacto ? 13 : 16} />
            </span>
            {!compacto && <span className="ciclo__etiqueta">{ETAPA_INFO[e].etiqueta}</span>}
            <span className="sr-solo">
              {ETAPA_INFO[e].etiqueta}
              {i === indiceActual ? ' (etapa actual)' : omitida ? ' (no corresponde)' : ''}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

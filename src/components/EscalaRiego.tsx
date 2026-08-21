import type { RegimenRiego } from '../lib/data/types'
import { ETIQUETA_RIEGO, REGIMENES_RIEGO, nivelRiego } from '../lib/riego'
import './EscalaRiego.css'

/**
 * Cuánta agua, en barrita de cuatro. El color no alcanza como canal: la
 * etiqueta va en texto al lado, y lleno y vacío se distinguen por relleno y
 * por borde, no sólo por tono.
 */
export function EscalaRiego({ regimen }: { regimen: RegimenRiego }) {
  const nivel = nivelRiego(regimen)
  const total = REGIMENES_RIEGO.length

  return (
    <p className="riego-escala">
      <span
        className="riego-escala__barra"
        role="img"
        aria-label={`riego ${ETIQUETA_RIEGO[regimen].toLowerCase()}, ${nivel} de ${total}`}
      >
        {REGIMENES_RIEGO.map((_, i) => (
          <span key={i} className={`riego-escala__nivel${i < nivel ? ' es-lleno' : ''}`} />
        ))}
      </span>
      <strong className="riego-escala__etiqueta">{ETIQUETA_RIEGO[regimen]}</strong>
    </p>
  )
}

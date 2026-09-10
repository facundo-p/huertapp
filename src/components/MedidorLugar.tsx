import type { Ocupacion } from '../lib/huerta/lugar'
import './MedidorLugar.css'

/**
 * Cuán lleno está el lugar, dibujado.
 *
 * Donde hay unidades va un pip por unidad; donde no las hay —plantación libre—
 * va una barra continua. Nunca pips en un bancal libre: el pip promete una
 * posición discreta que ahí no existe.
 *
 * Decorativo: el texto de al lado dice lo mismo con palabras.
 */
export function MedidorLugar({ ocupacion }: { ocupacion: Ocupacion }) {
  if (ocupacion.continuo) {
    return (
      <span className="medidor medidor--continuo" aria-hidden>
        <i style={{ width: `${Math.round(ocupacion.fraccion * 100)}%` }} />
      </span>
    )
  }

  // una bandeja de 60 celdas no entra en la ficha: pasado el tope se mide
  if (ocupacion.capacidad > 24) {
    return (
      <span className="medidor medidor--continuo" aria-hidden>
        <i style={{ width: `${Math.round(ocupacion.fraccion * 100)}%` }} />
      </span>
    )
  }

  return (
    <span className="medidor medidor--pips" aria-hidden>
      {Array.from({ length: ocupacion.capacidad }, (_, i) => (
        <i key={i} className={i < ocupacion.ocupadas ? 'es-ocupada' : ''} />
      ))}
    </span>
  )
}

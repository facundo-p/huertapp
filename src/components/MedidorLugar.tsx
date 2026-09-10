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
/** Cuántos pips entran en la ficha antes de que dejen de contarse de un vistazo. */
const TOPE_PIPS = 24

export function MedidorLugar({ ocupacion }: { ocupacion: Ocupacion }) {
  if (ocupacion.continuo) {
    return (
      <span className="medidor medidor--continuo" aria-hidden>
        <i style={{ width: `${Math.round(ocupacion.fraccion * 100)}%` }} />
      </span>
    )
  }

  // Una bandeja de 60 celdas no entra en la ficha. Pasado el tope el medidor se
  // vuelve barra, pero MUESCADA y no rayada: sigue diciendo que hay posiciones,
  // que es justo lo que la barra del bancal libre dice que no hay.
  if (ocupacion.capacidad > TOPE_PIPS) {
    return (
      <span className="medidor medidor--muchas" aria-hidden>
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

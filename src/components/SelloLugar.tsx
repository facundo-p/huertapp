import type { ClaseLugar } from '../lib/huerta/lugar'
import './SelloLugar.css'

/**
 * El cuadrado que dice de un vistazo qué clase de lugar es. No son íconos: son
 * dibujos de CSS —una grilla de celdas, tres macetas, un marco con surcos, un
 * marco con plantas sueltas— porque lo que distinguen es una disposición, no una
 * cosa.
 *
 * Los dos bancales comparten marco y color a propósito: son el mismo lugar con
 * distinta disposición, y la diferencia entre puntos y líneas es justo esa.
 *
 * Decorativo: la etiqueta de tipo va al lado, en texto.
 */
export function SelloLugar({ clase }: { clase: ClaseLugar }) {
  return (
    <span className={`sello sello--${clase}`} aria-hidden>
      {clase === 'almaciguera' && (
        <span className="sello__celdas">
          <i />
          <i />
          <i />
          <i />
          <i className="es-vacia" />
          <i className="es-vacia" />
        </span>
      )}
      {clase === 'macetas' && (
        <span className="sello__macetas">
          <i />
          <i />
          <i className="es-tenue" />
        </span>
      )}
      {clase === 'bancal' && (
        <span className="sello__marco sello__surcos">
          <i />
          <i />
          <i className="es-tenue" />
        </span>
      )}
      {clase === 'bancal_libre' && (
        <span className="sello__marco sello__libre">
          <i />
          <i />
          <i className="es-tenue" />
          <i className="es-tenue" />
          <i />
        </span>
      )}
      {clase === 'otro' && <span className="sello__otro" />}
    </span>
  )
}

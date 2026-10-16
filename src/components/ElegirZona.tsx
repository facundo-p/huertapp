import { ZONAS, type Zona } from '../lib/data/types'
import { ZONAS_INFO } from '../lib/zona'
import './opciones.css'

/** Las tres zonas del GBA con su última helada: la usan Ajustes y la ficha de la huerta. */
export function ElegirZona({
  zona,
  onElegir,
  etiqueta = 'Zona de la huerta',
}: {
  zona: Zona
  onElegir: (z: Zona) => void
  etiqueta?: string
}) {
  return (
    <div className="opciones" role="radiogroup" aria-label={etiqueta}>
      {ZONAS.map((z) => {
        const info = ZONAS_INFO[z]
        return (
          <button
            key={z}
            className={`opcion ${zona === z ? 'es-elegida' : ''}`}
            onClick={() => onElegir(z)}
            role="radio"
            aria-checked={zona === z}
          >
            <span className="opcion__marca" aria-hidden />
            <span className="opcion__textos">
              <span className="opcion__nombre">{info.etiqueta}</span>
              <span className="opcion__detalle">{info.detalle}</span>
              <span className="opcion__helada">{info.helada}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

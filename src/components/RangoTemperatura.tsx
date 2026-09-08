import { moverPunta, pctEn, type Rango } from '../lib/filtroTemperatura'
import { IconoTempCalida, IconoTempFria, IconoTempTemplada } from '../icons'
import './RangoTemperatura.css'

interface Props {
  /** hasta dónde llega el riel, sacado del catálogo */
  dominio: Rango
  /** lo elegido; apagado se dibuja igual, en gris, porque la escala también informa */
  valor: Rango
  onCambiar: (r: Rango) => void
  /** "Ideal para germinar": arma el nombre accesible de las dos puntas */
  nombre: string
  activo: boolean
}

/**
 * Rango doble sin librerías: dos <input type="range"> en la misma celda. El
 * input no recibe el click y sí el pulgar, que es lo único agarrable; si no,
 * el de arriba se comería siempre al de abajo.
 */
export function RangoTemperatura({ dominio, valor, onCambiar, nombre, activo }: Props) {
  const izq = pctEn(dominio, valor.min)
  const der = pctEn(dominio, valor.max)
  const cero = dominio.min < 0 && dominio.max > 0 ? pctEn(dominio, 0) : null
  // Con los dos pulgares encimados manda el que todavía tiene para dónde ir:
  // pegados al tope derecho, el de arriba tiene que ser el mínimo.
  const minEncima = izq > 50

  const punta = (p: 'min' | 'max') => (
    <input
      type="range"
      className={`rango__input ${(p === 'min') === minEncima ? 'es-encima' : ''}`}
      min={dominio.min}
      max={dominio.max}
      step={1}
      value={valor[p]}
      disabled={!activo}
      aria-label={`${nombre}, ${p === 'min' ? 'mínimo' : 'máximo'}`}
      aria-valuetext={`${valor[p]} grados`}
      onChange={(ev) => onCambiar(moverPunta(valor, p, Number(ev.target.value), dominio))}
    />
  )

  return (
    <div className={`rango ${activo ? '' : 'es-apagado'}`}>
      <div className="rango__pista" aria-hidden>
        <span className="rango__riel" />
        <span className="rango__tramo" style={{ left: `${izq}%`, width: `${der - izq}%` }} />
        {cero !== null && <span className="rango__cero" style={{ left: `${cero}%` }} />}
      </div>
      {punta('min')}
      {punta('max')}
      {/* frío a la izquierda, calor a la derecha: la dirección, dicha sin depender del color */}
      <div className="rango__marcas" aria-hidden>
        <span className="rango__marca">
          <IconoTempFria size={15} /> {dominio.min}°
        </span>
        <span className="rango__marca">
          <IconoTempTemplada size={15} />
        </span>
        <span className="rango__marca">
          {dominio.max}° <IconoTempCalida size={15} />
        </span>
      </div>
    </div>
  )
}

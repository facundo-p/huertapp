import type { Lugar } from '../lib/huerta/lugar'

/**
 * Cuánto ocupa una planta del lugar donde va, y cómo queda puesta.
 *
 * Lo preguntan el alta y la hoja de trasplante: es el mismo par de campos y la
 * misma regla —dónde va el número lo decide el lugar—, así que vive una sola
 * vez. El `prefijo` separa los `id` cuando las dos hojas están montadas juntas.
 */

interface Props {
  prefijo: string
  lugar: Lugar
  ocupa: string
  onOcupa: (v: string) => void
  comoEsta: string
  onComoEsta: (v: string) => void
  /** "está" al sumarla, "queda" al moverla */
  verbo: string
}

export function CamposOcupacion({
  prefijo,
  lugar,
  ocupa,
  onOcupa,
  comoEsta,
  onComoEsta,
  verbo,
}: Props) {
  // sin unidad el lugar no sabe cuánto entra: el número no diría nada
  if (!lugar.unidad) return null

  return (
    <>
      <div className="alta__campo">
        <label className="alta__label" htmlFor={`${prefijo}-ocupa`}>
          {lugar.continuo ? '¿Cuántos m² ocupa?' : `¿Cuántas ${lugar.unidad} ocupa?`}{' '}
          <span className="alta__opcional">(opcional)</span>
        </label>
        <input
          id={`${prefijo}-ocupa`}
          className="alta__input"
          inputMode="decimal"
          placeholder={lugar.continuo ? '0,5' : '1'}
          value={ocupa}
          onChange={(ev) => onOcupa(ev.target.value)}
        />
      </div>

      {/* En plantación libre no hay una celda por planta: cómo está puesta es
          lo único que ubica a esta entre las demás. */}
      {lugar.continuo && (
        <div className="alta__campo">
          <label className="alta__label" htmlFor={`${prefijo}-como`}>
            ¿Cómo {verbo} puesta? <span className="alta__opcional">(opcional)</span>
          </label>
          <input
            id={`${prefijo}-como`}
            className="alta__input"
            placeholder="Intercalada entre las lechugas…"
            value={comoEsta}
            onChange={(ev) => onComoEsta(ev.target.value)}
          />
        </div>
      )}
    </>
  )
}

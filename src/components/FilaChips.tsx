import type { ComponentType } from 'react'
import type { IconProps } from '../icons/base'
import './FilaChips.css'

export interface OpcionChip {
  valor: string
  Icono: ComponentType<IconProps>
  etiqueta: string
  color: string
}

/**
 * Fila de chips de ícono con una etiqueta que dice de qué dimensión son.
 * El ícono solo nunca alcanza: el nombre va en aria-label y en el title.
 */
export function FilaChips({
  etiqueta,
  opciones,
  activo,
  onElegir,
}: {
  etiqueta: string
  opciones: OpcionChip[]
  activo: string | null
  onElegir: (v: string | null) => void
}) {
  return (
    <div className="fila-chips-grupo">
      <span className="fila-chips__etiqueta">{etiqueta}</span>
      <div className="fila-chips" role="group" aria-label={etiqueta}>
        {opciones.map(({ valor, Icono, etiqueta: nombre, color }) => {
          const activado = activo === valor
          return (
            <button
              key={valor}
              className={`chip ${activado ? 'es-activo' : ''}`}
              style={{ '--chip-color': color } as React.CSSProperties}
              onClick={() => onElegir(activado ? null : valor)}
              aria-pressed={activado}
              aria-label={nombre}
              title={nombre}
            >
              <Icono size={22} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

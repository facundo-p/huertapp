import type { ComponentType, ReactNode } from 'react'
import type { IconProps } from '../icons'
import type { DibujoProps } from '../dibujos'
import './EmptyState.css'

/**
 * O un ícono del sistema en su marco punteado, o un dibujo —nunca los dos: el
 * dibujo ya trae su propia escena y el marco lo vuelve una estampilla.
 */
type Props = { titulo: string; texto: string; accion?: ReactNode } & (
  | { Icono: ComponentType<IconProps>; Dibujo?: never }
  | { Dibujo: ComponentType<DibujoProps>; Icono?: never }
)

/** Estado vacío ilustrado con los íconos del sistema y tono simpático. */
export function EmptyState({ Icono, Dibujo, titulo, texto, accion }: Props) {
  return (
    <div className="estado-vacio aparecer">
      {Dibujo ? (
        <span className="estado-vacio__dibujo">
          <Dibujo size={132} />
        </span>
      ) : (
        Icono && (
          <div className="estado-vacio__marco">
            <Icono size={44} />
          </div>
        )
      )}
      <h2 className="estado-vacio__titulo">{titulo}</h2>
      <p className="estado-vacio__texto">{texto}</p>
      {accion}
    </div>
  )
}

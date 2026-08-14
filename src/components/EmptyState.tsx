import type { ComponentType, ReactNode } from 'react'
import type { IconProps } from '../icons'
import './EmptyState.css'

interface Props {
  Icono: ComponentType<IconProps>
  titulo: string
  texto: string
  accion?: ReactNode
}

/** Estado vacío ilustrado con los íconos del sistema y tono simpático. */
export function EmptyState({ Icono, titulo, texto, accion }: Props) {
  return (
    <div className="estado-vacio aparecer">
      <div className="estado-vacio__marco">
        <Icono size={44} />
      </div>
      <h2 className="estado-vacio__titulo">{titulo}</h2>
      <p className="estado-vacio__texto">{texto}</p>
      {accion}
    </div>
  )
}

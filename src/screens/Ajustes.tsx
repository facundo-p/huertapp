import { Header } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { IconoAjustes } from '../icons'

export function Ajustes() {
  return (
    <div className="pantalla pantalla--detalle">
      <Header titulo="Ajustes" volver />
      <div className="pantalla__cuerpo">
        <EmptyState
          Icono={IconoAjustes}
          titulo="Todavía no hay mucho que ajustar"
          texto="Acá van a estar el backup de tus datos, las notificaciones y la huerta de ejemplo."
        />
      </div>
    </div>
  )
}

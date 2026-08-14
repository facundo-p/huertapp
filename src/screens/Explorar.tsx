import { Header } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { IconoExplorar } from '../icons'

export function Explorar() {
  return (
    <div className="pantalla">
      <Header titulo="Explorar" />
      <div className="pantalla__cuerpo">
        <EmptyState
          Icono={IconoExplorar}
          titulo="55 especies en camino"
          texto="Acá vas a buscar y filtrar todo el catálogo: por mes, grupo, suelo y luz. Llega en la próxima fase."
        />
      </div>
    </div>
  )
}

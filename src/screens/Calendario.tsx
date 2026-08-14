import { Header } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { IconoCalendario } from '../icons'

export function Calendario() {
  return (
    <div className="pantalla">
      <Header titulo="Calendario" />
      <div className="pantalla__cuerpo">
        <EmptyState
          Icono={IconoCalendario}
          titulo="El año de un vistazo"
          texto="La matriz de siembra y trasplante de las 55 especies, mes a mes. Se está regando, ya germina."
        />
      </div>
    </div>
  )
}

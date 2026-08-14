import { Link } from 'react-router'
import { Header } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { IconoHuerta } from '../icons'

export function MiHuerta() {
  return (
    <div className="pantalla">
      <Header titulo="Mi huerta" />
      <div className="pantalla__cuerpo">
        <EmptyState
          Icono={IconoHuerta}
          titulo="Tierra lista, cantero vacío"
          texto="Todavía no agregaste ninguna planta. Explorá qué conviene sembrar este mes y arrancá con la primera."
          accion={
            <Link className="boton-primario" to="/explorar">
              Explorar especies
            </Link>
          }
        />
      </div>
    </div>
  )
}

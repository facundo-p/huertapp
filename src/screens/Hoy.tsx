import { Link } from 'react-router'
import { Header } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { IconoAlmacigo } from '../icons'
import { fechaLarga, saludoEstacional } from '../lib/fechas'
import './Hoy.css'

export function Hoy() {
  const hoy = new Date()
  return (
    <div className="pantalla">
      <Header sobretitulo={fechaLarga(hoy)} titulo={saludoEstacional(hoy)} />
      <div className="pantalla__cuerpo">
        <EmptyState
          Icono={IconoAlmacigo}
          titulo="Tu huerta arranca acá"
          texto="Cuando agregues plantas, esta pantalla te va a decir qué sembrar, trasplantar y revisar cada semana."
          accion={
            <Link className="boton-primario" to="/explorar">
              Ver qué se siembra ahora
            </Link>
          }
        />
      </div>
    </div>
  )
}

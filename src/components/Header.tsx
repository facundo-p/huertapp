import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { IconoAjustes, IconoGlosario, IconoVolver } from '../icons'
import './Header.css'

interface Props {
  titulo: ReactNode
  /** subtítulo chico arriba del título (ej. la fecha) */
  sobretitulo?: ReactNode
  /** pantalla de detalle: muestra flecha de volver y oculta accesos */
  volver?: boolean
  children?: ReactNode
}

export function Header({ titulo, sobretitulo, volver, children }: Props) {
  const navegar = useNavigate()
  return (
    <header className="encabezado">
      {volver && (
        <button className="encabezado__boton" onClick={() => navegar(-1)} aria-label="Volver">
          <IconoVolver size={22} />
        </button>
      )}
      <div className="encabezado__textos">
        {sobretitulo && <p className="encabezado__sobre">{sobretitulo}</p>}
        <h1 className="encabezado__titulo">{titulo}</h1>
      </div>
      {!volver && (
        <div className="encabezado__acciones">
          <Link to="/glosario" className="encabezado__boton" aria-label="Glosario de íconos">
            <IconoGlosario size={22} />
          </Link>
          <Link to="/ajustes" className="encabezado__boton" aria-label="Ajustes">
            <IconoAjustes size={22} />
          </Link>
        </div>
      )}
      {children}
    </header>
  )
}

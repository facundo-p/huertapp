import { NavLink } from 'react-router'
import { IconoCalendario, IconoExplorar, IconoHoy, IconoHuerta } from '../icons'
import './TabBar.css'

const TABS = [
  { a: '/hoy', etiqueta: 'Hoy', Icono: IconoHoy },
  { a: '/explorar', etiqueta: 'Explorar', Icono: IconoExplorar },
  { a: '/calendario', etiqueta: 'Calendario', Icono: IconoCalendario },
  { a: '/huerta', etiqueta: 'Mi huerta', Icono: IconoHuerta },
] as const

export function TabBar() {
  return (
    <nav className="tabbar" aria-label="Navegación principal">
      {TABS.map(({ a, etiqueta, Icono }) => (
        <NavLink key={a} to={a} className="tabbar__tab">
          {({ isActive }) => (
            <>
              <span className="tabbar__pastilla" aria-hidden>
                <Icono size={23} strokeWidth={isActive ? 2 : 1.75} />
              </span>
              <span className="tabbar__etiqueta">{etiqueta}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

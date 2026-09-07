import { NavLink } from 'react-router'
import { IconoCalendario, IconoExplorar, IconoHoy, IconoHuerta } from '../icons'
import './TabBar.css'

const TABS = [
  // La ruta y el archivo siguen siendo «hoy»: el handoff renombra la pestaña,
  // no la pantalla.
  { a: '/hoy', etiqueta: 'Esta semana', Icono: IconoHoy },
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
                <Icono size={22} strokeWidth={isActive ? 2 : 1.75} />
              </span>
              <span className="tabbar__etiqueta">{etiqueta}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

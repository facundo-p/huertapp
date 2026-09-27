import { useLayoutEffect, useRef, type CSSProperties } from 'react'
import { NavLink } from 'react-router'
import { IconoCalendario, IconoCompost, IconoExplorar, IconoHoy, IconoHuerta } from '../icons'
import './TabBar.css'

const TABS = [
  // La ruta y el archivo siguen siendo «hoy»: el handoff renombra la pestaña,
  // no la pantalla.
  { a: '/hoy', etiqueta: 'Esta semana', Icono: IconoHoy, color: 'var(--sol)' },
  { a: '/explorar', etiqueta: 'Explorar', Icono: IconoExplorar, color: 'var(--verde-hoja)' },
  { a: '/calendario', etiqueta: 'Calendario', Icono: IconoCalendario, color: 'var(--agua)' },
  { a: '/compost', etiqueta: 'Compost', Icono: IconoCompost, color: 'var(--terracota)' },
  { a: '/huerta', etiqueta: 'Mi huerta', Icono: IconoHuerta, color: 'var(--oliva)' },
] as const

export function TabBar() {
  const ref = useRef<HTMLElement>(null)

  // con la letra agrandada la barra crece: el pie de cada pantalla y los
  // avisos tienen que despejar lo que mide de verdad, no los 59 de siempre
  useLayoutEffect(() => {
    const barra = ref.current
    if (!barra || typeof ResizeObserver === 'undefined') return
    const raiz = document.documentElement
    const medir = () => raiz.style.setProperty('--tab-ocupa', `${barra.offsetHeight}px`)
    const observador = new ResizeObserver(medir)
    // border-box: la zona segura va en el padding, y cambia sin que cambie el contenido
    observador.observe(barra, { box: 'border-box' })
    medir()
    return () => {
      observador.disconnect()
      raiz.style.removeProperty('--tab-ocupa')
    }
  }, [])

  return (
    <nav ref={ref} className="tabbar" aria-label="Navegación principal">
      {TABS.map(({ a, etiqueta, Icono, color }) => (
        <NavLink key={a} to={a} className="tabbar__tab" style={{ '--c': color } as CSSProperties}>
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

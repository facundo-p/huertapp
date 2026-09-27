import { useEffect, useId, useRef, type ReactNode } from 'react'
import './BottomSheet.css'

interface Props {
  abierto: boolean
  onCerrar: () => void
  titulo: ReactNode
  sobretitulo?: ReactNode
  /** acción fija al pie: no se va con el scroll del contenido */
  pie?: ReactNode
  children: ReactNode
}

/**
 * Hoja que sube desde abajo. Usa <dialog> nativo: trampa de foco, Escape
 * y ::backdrop vienen gratis y sin librerías.
 */
export function BottomSheet({ abierto, onCerrar, titulo, sobretitulo, pie, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  // con nombre, el lector anuncia el título y no sólo «diálogo, Cerrar»
  const idTitulo = useId()
  // El foco vuelve a quien abrió la hoja por nuestra cuenta: que lo haga el
  // <dialog> nativo no está probado en Safari de iOS.
  const origen = useRef<Element | null>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (abierto) {
      if (!d.open) {
        origen.current = document.activeElement
        d.showModal()
      }
      return
    }
    if (d.open) d.close()
    const o = origen.current
    origen.current = null
    // si la hoja lo sacó de la pantalla (borró la fila, navegó), no hay a quién
    if (o instanceof HTMLElement && o.isConnected) o.focus()
  }, [abierto])

  return (
    <dialog
      ref={ref}
      aria-labelledby={idTitulo}
      className="hoja"
      onClose={onCerrar}
      // click en el fondo (el target es el propio dialog, no su contenido)
      onClick={(e) => {
        if (e.target === ref.current) onCerrar()
      }}
    >
      <div className="hoja__panel">
        <div className="hoja__tirador" aria-hidden />
        <div className="hoja__cabeza">
          <div className="hoja__textos">
            {sobretitulo && <p className="hoja__sobre">{sobretitulo}</p>}
            <h2 className="hoja__titulo" id={idTitulo}>
              {titulo}
            </h2>
          </div>
          <button className="hoja__cerrar" onClick={onCerrar} aria-label="Cerrar">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
              <path d="M7 7l10 10M17 7L7 17" />
            </svg>
          </button>
        </div>
        <div className="hoja__cuerpo">{children}</div>
        {pie && <div className="hoja__pie">{pie}</div>}
      </div>
    </dialog>
  )
}

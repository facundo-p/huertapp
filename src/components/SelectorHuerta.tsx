import { BottomSheet } from './BottomSheet'
import { elegirHuertaActiva, sinRomper, useHuerta } from '../lib/huerta/store'
import { deLaHuerta } from '../lib/huerta/huertas'
import { resumenHuerta } from '../lib/huerta/tanda'
import { ZONAS_INFO } from '../lib/zona'
import { IconoEditar } from '../icons'
import type { Huerta } from '../lib/huerta/tipos'
import './opciones.css'
import './SelectorHuerta.css'

interface Props {
  abierto: boolean
  onCerrar: () => void
  /** las fichas se abren afuera: anidar hojas cierra las dos juntas (#181) */
  onEditar: (h: Huerta) => void
  onNueva: () => void
}

/** Las huertas, para pasar de una a otra. La activa, marcada también por forma. */
export function SelectorHuerta({ abierto, onCerrar, onEditar, onNueva }: Props) {
  const { huertas, activa, todas } = useHuerta()

  return (
    <BottomSheet
      abierto={abierto}
      onCerrar={onCerrar}
      titulo="Tus huertas"
      pie={
        <button className="alta__guardar" onClick={onNueva}>
          ＋ Nueva huerta
        </button>
      }
    >
      <div className="opciones" role="radiogroup" aria-label="Huerta abierta">
        {huertas.map((h) => {
          const plantas = deLaHuerta(todas.plantas, h.id).filter((p) => !p.archivada)
          const elegida = h.id === activa.id
          return (
            <div key={h.id} className="selector-huerta__fila">
              <button
                className={`opcion selector-huerta__opcion ${elegida ? 'es-elegida' : ''}`}
                role="radio"
                aria-checked={elegida}
                onClick={() => {
                  onCerrar()
                  sinRomper(elegirHuertaActiva(h.id))
                }}
              >
                <span className="opcion__marca" aria-hidden />
                <span className="opcion__textos">
                  <span className="opcion__nombre">{h.nombre}</span>
                  <span className="opcion__detalle">
                    {ZONAS_INFO[h.zona].etiqueta} · {plantas.length ? resumenHuerta(plantas) : 'todavía vacía'}
                  </span>
                </span>
              </button>
              <button className="selector-huerta__editar" aria-label={`Editar ${h.nombre}`} onClick={() => onEditar(h)}>
                <IconoEditar size={18} />
              </button>
            </div>
          )
        })}
      </div>
    </BottomSheet>
  )
}

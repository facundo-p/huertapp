import { useEffect, useId, useState } from 'react'
import { BottomSheet } from './BottomSheet'
import { ElegirZona } from './ElegirZona'
import { actualizarHuerta, agregarHuerta, borrarHuerta, sinRomper, useHuerta } from '../lib/huerta/store'
import { deLaHuerta, puedeBorrar, textoBorrarHuerta } from '../lib/huerta/huertas'
import type { Huerta } from '../lib/huerta/tipos'
import type { Zona } from '../lib/data/types'
import './AltaPlanta.css'
import './SelectorHuerta.css'

interface Props {
  abierto: boolean
  onCerrar: () => void
  /** con huerta es edición; sin ella, alta */
  huerta?: Huerta
}

// Una huerta es un nombre y una zona. El pronóstico se elige en Ajustes, como
// siempre: pedirlo acá sería sumar la red a algo que no la necesita.
export function FichaHuerta({ abierto, onCerrar, huerta }: Props) {
  const { huertas, activa, todas } = useHuerta()
  const [nombre, setNombre] = useState('')
  const [zona, setZona] = useState<Zona>(activa.zona)
  const [guardando, setGuardando] = useState(false)
  const idNombre = useId()

  useEffect(() => {
    if (!abierto) return
    setNombre(huerta?.nombre ?? '')
    setZona(huerta?.zona ?? activa.zona)
  }, [abierto, huerta, activa.zona])

  async function guardar() {
    if (!nombre.trim() || guardando) return
    setGuardando(true)
    try {
      if (huerta) await actualizarHuerta({ ...huerta, nombre, zona })
      else await agregarHuerta({ nombre, zona })
      onCerrar()
    } finally {
      setGuardando(false)
    }
  }

  async function borrar() {
    if (!huerta) return
    const aviso = textoBorrarHuerta(huerta.nombre, {
      plantas: deLaHuerta(todas.plantas, huerta.id).length,
      lugares: deLaHuerta(todas.ubicaciones, huerta.id).length,
      composteras: deLaHuerta(todas.composteras, huerta.id).length,
    })
    if (!confirm(aviso)) return
    await borrarHuerta(huerta.id)
    onCerrar()
  }

  return (
    <BottomSheet
      abierto={abierto}
      onCerrar={onCerrar}
      titulo={huerta ? 'Editar la huerta' : 'Una huerta nueva'}
      sobretitulo={huerta?.nombre}
      pie={
        <button
          className="alta__guardar"
          onClick={() => sinRomper(guardar())}
          disabled={guardando || !nombre.trim()}
        >
          {guardando ? 'Guardando…' : huerta ? 'Guardar los cambios' : 'Sumar esta huerta'}
        </button>
      }
    >
      <div className="alta__campo">
        <label className="alta__label" htmlFor={idNombre}>
          ¿Cómo le decís?
        </label>
        <input
          id={idNombre}
          className="alta__input"
          placeholder="La de casa, el balcón, la comunitaria…"
          value={nombre}
          onChange={(ev) => setNombre(ev.target.value)}
        />
      </div>

      <div className="alta__campo">
        <span className="alta__label">¿Dónde está?</span>
        <ElegirZona zona={zona} onElegir={setZona} etiqueta="Zona de esta huerta" />
        <p className="alta__ayuda">
          La zona decide el calendario: dentro del GBA la última helada cambia más de un mes.
        </p>
      </div>

      {huerta && puedeBorrar(huertas) && (
        <button className="ficha-huerta__borrar" onClick={() => sinRomper(borrar())}>
          Borrar esta huerta
        </button>
      )}
    </BottomSheet>
  )
}

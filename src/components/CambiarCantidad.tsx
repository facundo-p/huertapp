import { useEffect, useState } from 'react'
import { BottomSheet } from './BottomSheet'
import { cambiarCantidad, sinRomper } from '../lib/huerta/store'
import { aCantidad } from '../lib/huerta/tanda'
import type { Planta } from '../lib/huerta/tipos'
import './AltaPlanta.css'

// La cuenta cambia con la huerta: germinan, raleás, se pierden. Acá se ajusta
// a ojo y queda anotado en el diario sin escribir nada más.

interface Props {
  abierto: boolean
  planta: Planta
  nombre: string
  onCerrar: () => void
  /** después de guardar: el diario de la planta cambió */
  onListo?: () => void
}

export function CambiarCantidad({ abierto, planta, nombre, onCerrar, onListo }: Props) {
  const [cuantas, setCuantas] = useState('')
  const [quePaso, setQuePaso] = useState('')
  const [guardando, setGuardando] = useState(false)

  // prellenar con la cuenta actual recién al abrir, no mientras se edita
  useEffect(() => {
    if (abierto) setCuantas(planta.cantidad != null ? String(planta.cantidad) : '')
  }, [abierto, planta.cantidad])

  const n = aCantidad(cuantas)

  function limpiar() {
    setCuantas('')
    setQuePaso('')
  }

  async function guardar() {
    if (guardando || n == null) return
    setGuardando(true)
    try {
      await cambiarCantidad(planta, n, quePaso)
      limpiar()
      onCerrar()
      onListo?.()
    } finally {
      setGuardando(false)
    }
  }

  return (
    <BottomSheet
      abierto={abierto}
      onCerrar={() => {
        limpiar()
        onCerrar()
      }}
      titulo="¿Cuántas hay?"
      sobretitulo={nombre}
      pie={
        <button className="alta__guardar" onClick={() => sinRomper(guardar())} disabled={guardando || n == null}>
          {guardando ? 'Guardando…' : 'Guardar la cuenta'}
        </button>
      }
    >
      <div className="alta__campo">
        <label className="alta__label" htmlFor="cant-cuantas">
          ¿Cuántas hay ahora?
        </label>
        <input
          id="cant-cuantas"
          className="alta__input"
          inputMode="numeric"
          placeholder="12"
          value={cuantas}
          onChange={(ev) => setCuantas(ev.target.value)}
        />
        <p className="alta__ayuda">A ojo nomás: sirve para saber cuántas siguen en pie.</p>
      </div>

      <div className="alta__campo">
        <label className="alta__label" htmlFor="cant-que">
          ¿Qué pasó? <span className="alta__opcional">(opcional)</span>
        </label>
        <input
          id="cant-que"
          className="alta__input"
          placeholder="Raleé las más débiles… / Se comieron tres las babosas…"
          value={quePaso}
          onChange={(ev) => setQuePaso(ev.target.value)}
        />
      </div>
    </BottomSheet>
  )
}

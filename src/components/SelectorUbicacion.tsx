import { useState } from 'react'
import { useHuerta } from '../lib/huerta/store'
import { FichaUbicacion } from './FichaUbicacion'

// El mismo "¿Dónde?" del alta, para cualquier hoja que mueva plantas de lugar.
// El padre pone el <label> y la clase alta__campo; acá va solo el control.
// "Un lugar nuevo" abre la ficha completa: el lugar nace con sus datos, no
// solo con un nombre.

const NUEVA = '__nueva'

interface Props {
  id: string
  valor: string
  onValor: (v: string) => void
}

export function SelectorUbicacion({ id, valor, onValor }: Props) {
  const { ubicaciones } = useHuerta()
  const [creando, setCreando] = useState(false)
  return (
    <>
      <select
        id={id}
        className="alta__input"
        value={valor}
        onChange={(ev) => {
          if (ev.target.value === NUEVA) setCreando(true)
          else onValor(ev.target.value)
        }}
      >
        <option value="">Sin especificar</option>
        {ubicaciones.map((u) => (
          <option key={u.id} value={u.id}>
            {u.nombre}
          </option>
        ))}
        <option value={NUEVA}>＋ Un lugar nuevo…</option>
      </select>
      <FichaUbicacion
        abierto={creando}
        onCerrar={() => setCreando(false)}
        onListo={(u) => onValor(u.id)}
      />
    </>
  )
}

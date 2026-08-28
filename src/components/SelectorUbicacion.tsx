import { useHuerta, agregarUbicacion } from '../lib/huerta/store'

// El mismo "¿Dónde?" del alta, para cualquier hoja que mueva plantas de lugar.
// El padre pone el <label> y la clase alta__campo; acá va solo el control.

export const NUEVA = '__nueva'

interface Props {
  id: string
  valor: string
  onValor: (v: string) => void
  nombreNuevo: string
  onNombreNuevo: (v: string) => void
}

/** Crea la ubicación si hace falta. Devuelve el id final, o undefined si quedó sin lugar. */
export async function resolverUbicacion(valor: string, nombreNuevo: string): Promise<string | undefined> {
  if (valor === NUEVA && nombreNuevo.trim()) return (await agregarUbicacion(nombreNuevo, 'otro')).id
  return valor && valor !== NUEVA ? valor : undefined
}

export function SelectorUbicacion({ id, valor, onValor, nombreNuevo, onNombreNuevo }: Props) {
  const { ubicaciones } = useHuerta()
  return (
    <>
      <select id={id} className="alta__input" value={valor} onChange={(ev) => onValor(ev.target.value)}>
        <option value="">Sin especificar</option>
        {ubicaciones.map((u) => (
          <option key={u.id} value={u.id}>
            {u.nombre}
          </option>
        ))}
        <option value={NUEVA}>＋ Un lugar nuevo…</option>
      </select>
      {valor === NUEVA && (
        <input
          className="alta__input"
          placeholder="Maceta del balcón, bancal del fondo…"
          value={nombreNuevo}
          onChange={(ev) => onNombreNuevo(ev.target.value)}
          autoFocus
        />
      )}
    </>
  )
}

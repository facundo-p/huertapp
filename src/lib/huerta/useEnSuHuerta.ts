import { useEffect, useState } from 'react'
import { elegirHuertaActiva, useHuerta } from './store'
import { huertaDe } from './huertas'

/**
 * Lo que se abre por el historial puede ser de otra huerta: se pasa a esa, que
 * si no la zona, los lugares y el trasplante serían los de la que estaba
 * abierta. Devuelve si todavía está cambiando. Si la huerta no existe o el
 * cambio falla, devuelve false: mejor «no lo encontramos» que «Cargando…» para siempre.
 */
export function useEnSuHuerta(ajeno: { huertaId?: string } | undefined): boolean {
  const { huertas } = useHuerta()
  const id = ajeno ? huertaDe(ajeno) : undefined
  const existe = !!id && huertas.some((h) => h.id === id)
  const [fallo, setFallo] = useState(false)

  useEffect(() => {
    if (!id || !existe) return
    elegirHuertaActiva(id).catch(() => setFallo(true))
  }, [id, existe])

  return existe && !fallo
}

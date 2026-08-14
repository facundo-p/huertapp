import { useEffect, useState } from 'react'
import { cargarEspecies, type IndiceEspecies } from './data/especies'

/** Carga diferida del catálogo (el JSON no entra al bundle inicial). */
export function useEspecies(): { indice: IndiceEspecies | null; cargando: boolean } {
  const [indice, setIndice] = useState<IndiceEspecies | null>(null)

  useEffect(() => {
    let vivo = true
    cargarEspecies().then((i) => {
      if (vivo) setIndice(i)
    })
    return () => {
      vivo = false
    }
  }, [])

  return { indice, cargando: indice === null }
}

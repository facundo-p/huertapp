import { useEffect, useState } from 'react'
import * as db from '../lib/huerta/db'

/**
 * Miniatura de una foto guardada en IndexedDB.
 * La URL de objeto se libera al desmontar: si no, el Blob queda retenido en
 * memoria por toda la sesión y con veinte fotos se nota.
 */
export function FotoDeDiario({ id }: { id: string }) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    let vivo = true
    let creada: string | null = null

    void db.leerFoto(id).then((f) => {
      if (!f || !vivo) return
      creada = URL.createObjectURL(f.blob)
      setUrl(creada)
    })

    return () => {
      vivo = false
      if (creada) URL.revokeObjectURL(creada)
    }
  }, [id])

  if (!url) return <span className="foto-diario es-cargando" aria-hidden />
  return <img className="foto-diario" src={url} alt="Foto del diario" loading="lazy" />
}

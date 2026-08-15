import { nuevoId, type Foto } from './tipos'

/**
 * Las fotos se guardan como Blob en IndexedDB, achicadas.
 *
 * Una foto de celular moderna pesa 3-6 MB. Veinte fotos y ya estás en 100 MB
 * de un cupo que el navegador puede decidir liberar. A 1280px de lado mayor y
 * webp con calidad 0,82 la misma foto pesa 150-250 KB y sigue siendo más que
 * suficiente para ver una hoja con manchas.
 */

export const LADO_MAX = 1280
const CALIDAD = 0.82

/** webp donde se pueda; si el navegador no lo sabe codificar, jpeg. */
function mejorFormato(): string {
  const c = document.createElement('canvas')
  c.width = c.height = 1
  return c.toDataURL('image/webp').startsWith('data:image/webp') ? 'image/webp' : 'image/jpeg'
}

function escalar(ancho: number, alto: number): { ancho: number; alto: number } {
  const mayor = Math.max(ancho, alto)
  if (mayor <= LADO_MAX) return { ancho, alto }
  const f = LADO_MAX / mayor
  return { ancho: Math.round(ancho * f), alto: Math.round(alto * f) }
}

async function cargarImagen(archivo: File): Promise<{ fuente: CanvasImageSource; ancho: number; alto: number }> {
  // createImageBitmap respeta la orientación EXIF y no bloquea el hilo
  if ('createImageBitmap' in window) {
    try {
      const bmp = await createImageBitmap(archivo, { imageOrientation: 'from-image' })
      return { fuente: bmp, ancho: bmp.width, alto: bmp.height }
    } catch {
      /* algunos Safari viejos no soportan las opciones: cae al <img> */
    }
  }
  const url = URL.createObjectURL(archivo)
  try {
    const img = new Image()
    await new Promise<void>((res, rej) => {
      img.onload = () => res()
      img.onerror = () => rej(new Error('No se pudo leer la imagen.'))
      img.src = url
    })
    return { fuente: img, ancho: img.naturalWidth, alto: img.naturalHeight }
  } finally {
    URL.revokeObjectURL(url)
  }
}

export class FotoInvalida extends Error {}

/** Achica y comprime una foto elegida por el usuario. */
export async function prepararFoto(archivo: File): Promise<Foto> {
  if (!archivo.type.startsWith('image/')) throw new FotoInvalida('Eso no es una imagen.')

  const { fuente, ancho, alto } = await cargarImagen(archivo)
  const destino = escalar(ancho, alto)

  const canvas = document.createElement('canvas')
  canvas.width = destino.ancho
  canvas.height = destino.alto
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new FotoInvalida('El navegador no pudo procesar la imagen.')
  ctx.drawImage(fuente, 0, 0, destino.ancho, destino.alto)
  if ('close' in fuente) (fuente as ImageBitmap).close()

  const tipo = mejorFormato()
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, tipo, CALIDAD))
  if (!blob) throw new FotoInvalida('No se pudo comprimir la imagen.')

  return {
    id: nuevoId(),
    blob,
    tipo,
    ancho: destino.ancho,
    alto: destino.alto,
    creada: new Date().toISOString(),
  }
}

/** URL de objeto para mostrar la foto. Acordate de liberarla al desmontar. */
export const urlDeFoto = (f: Foto): string => URL.createObjectURL(f.blob)

export function pesoLegible(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

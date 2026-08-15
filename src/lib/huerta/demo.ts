import * as db from './db'
import { agregarEntrada, agregarPlanta, agregarUbicacion, marcarGerminada, recargar } from './store'
import { hoyISO, nuevoId, type Foto } from './tipos'
import { sumarDias } from './estimar'

/**
 * Huerta de ejemplo para probar la app sin esperar tres meses.
 * Vive en Ajustes, detrás de una confirmación, y se puede borrar entera.
 */

/** Una foto sintética: sirve para ver el diario con imágenes sin pedir la cámara. */
async function fotoDeMentira(tono: number): Promise<Foto> {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 320
  const ctx = canvas.getContext('2d')!
  const g = ctx.createLinearGradient(0, 0, 320, 320)
  g.addColorStop(0, `hsl(${tono} 45% 62%)`)
  g.addColorStop(1, `hsl(${tono + 25} 40% 38%)`)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 320, 320)
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'
  ctx.lineWidth = 10
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(160, 280)
  ctx.lineTo(160, 150)
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(120, 160, 45, 22, -0.5, 0, Math.PI * 2)
  ctx.ellipse(200, 190, 45, 22, 0.5, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.42)'
  ctx.fill()

  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/webp', 0.8))
  return {
    id: nuevoId(),
    blob: blob!,
    tipo: 'image/webp',
    ancho: 320,
    alto: 320,
    creada: new Date().toISOString(),
  }
}

export async function sembrarDemo(): Promise<void> {
  const hoy = hoyISO()
  const balcon = await agregarUbicacion('Macetas del balcón', 'maceta')
  const bancal = await agregarUbicacion('Bancal del fondo', 'bancal')

  const tomate = await agregarPlanta({
    slug: 'tomate',
    apodo: 'Los del cajón',
    ubicacionId: balcon.id,
    sembrada: sumarDias(hoy, -22),
    metodo: 'almacigo_protegido',
  })

  const lechuga = await agregarPlanta({
    slug: 'lechuga',
    ubicacionId: bancal.id,
    sembrada: sumarDias(hoy, -48),
    metodo: 'directa',
  })

  await agregarPlanta({
    slug: 'albahaca',
    ubicacionId: balcon.id,
    sembrada: sumarDias(hoy, -9),
    metodo: 'almacigo_protegido',
  })

  const rucula = await agregarPlanta({
    slug: 'rucula',
    ubicacionId: bancal.id,
    sembrada: sumarDias(hoy, -31),
    metodo: 'directa',
  })

  // sembrada hace 32 días y germina en 10-20: pasada de plazo, para ver el aviso
  await agregarPlanta({
    slug: 'zanahoria',
    ubicacionId: bancal.id,
    sembrada: sumarDias(hoy, -32),
    metodo: 'directa',
  })

  // las que ya asomaron quedan marcadas; la albahaca (7-14 días, sembrada hace
  // 9) queda en plena ventana, que es el tercer estado
  await marcarGerminada(tomate, sumarDias(hoy, -14))
  await marcarGerminada(lechuga, sumarDias(hoy, -41))
  await marcarGerminada(rucula, sumarDias(hoy, -25))

  const f1 = await fotoDeMentira(95)
  const f2 = await fotoDeMentira(115)
  await db.guardarFoto(f1)
  await db.guardarFoto(f2)

  await agregarEntrada({
    plantaId: tomate.id,
    fecha: sumarDias(hoy, -16),
    tipo: 'nota',
    texto: 'Germinaron 7 de 10. Los tengo contra la ventana que da al norte.',
    fotoIds: [f1.id],
  })
  await agregarEntrada({
    plantaId: tomate.id,
    fecha: sumarDias(hoy, -4),
    tipo: 'riego',
    texto: 'Se secó rápido con el viento. Riego cada dos días.',
    fotoIds: [],
  })
  await agregarEntrada({
    plantaId: tomate.id,
    fecha: sumarDias(hoy, -1),
    tipo: 'nota',
    texto: 'Ya tienen las primeras hojas verdaderas. Falta poco para el trasplante.',
    fotoIds: [f2.id],
  })
  await agregarEntrada({
    plantaId: lechuga.id,
    fecha: sumarDias(hoy, -12),
    tipo: 'plaga',
    texto: 'Babosas. Puse una trampa de cerveza y aflojó.',
    fotoIds: [],
  })
  await agregarEntrada({
    plantaId: lechuga.id,
    fecha: sumarDias(hoy, -2),
    tipo: 'cosecha',
    texto: 'Primer corte de hojas de afuera. Siguen creciendo del centro.',
    fotoIds: [],
  })

  await recargar()
}

export async function borrarTodo(): Promise<void> {
  await db.vaciarTodo()
  await recargar()
}

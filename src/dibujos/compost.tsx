import { Dibujo, type DibujoProps } from './base'
import type { Estado } from '../lib/compostaje'

/**
 * Los tres estados de la compostera, como secuencia: el mismo tacho tres veces
 * y lo que cambia es lo que pasa arriba y cuánto hay adentro. Acá el dibujo no
 * acompaña, explica —es la única pantalla de la app donde se gana ese lugar—,
 * pero sigue siendo dibujo: el texto de al lado dice todo lo que dice él.
 *
 * El color sale solo: heredan `currentColor` del rótulo del estado, que ya es
 * verde, ocre o terracota. La forma cambia en los tres, así que la secuencia
 * nunca depende del color.
 */

/** el tacho, igual en los tres: lo que cambia es arriba */
function Tacho() {
  return (
    <>
      <ellipse cx="48" cy="48" rx="24" ry="7" />
      <path d="M24 48 L29 80 Q48 85 67 80 L72 48" />
    </>
  )
}

function Llenando(props: DibujoProps) {
  return (
    <Dibujo {...props}>
      <Tacho />
      {/* medio cargado, y cayendo lo de hoy */}
      <path d="M28 60 Q48 66 68 60" />
      <path d="M48 34 C41 34 36 29 36 22 C43 22 48 27 48 34 Z" />
      <circle cx="62" cy="30" r="2.6" fill="currentColor" stroke="none" />
      <circle cx="37" cy="39" r="2.2" fill="currentColor" stroke="none" />
    </Dibujo>
  )
}

function Cocinando(props: DibujoProps) {
  return (
    <Dibujo {...props}>
      <Tacho />
      {/* lleno y humeando: es la fase caliente. El nivel va en 58 y no en 55
          —pegado a la boca se leía como una tapa, no como carga. */}
      <path d="M27 58 Q48 64 69 58" />
      <path d="M38 38 C34 33 42 29 38 24" />
      <path d="M48 36 C44 31 52 27 48 22" />
      <path d="M58 38 C54 33 62 29 58 24" />
    </Dibujo>
  )
}

function Madurando(props: DibujoProps) {
  return (
    <Dibujo {...props}>
      <Tacho />
      {/* bajó de volumen y ya brota solo */}
      <path d="M30 64 Q48 70 66 64" />
      <path d="M48 40 V20" />
      <path d="M48 34 C42 34 38 30 38 24 C44 24 48 28 48 34 Z" />
      <path d="M48 28 C54 28 58 24 58 18 C52 18 48 22 48 28 Z" />
    </Dibujo>
  )
}

const POR_ESTADO: Record<Estado['clave'], (p: DibujoProps) => React.ReactElement> = {
  llenando: Llenando,
  cocinando: Cocinando,
  madurando: Madurando,
}

export function DibujoEstado({
  estado,
  ...props
}: DibujoProps & { estado: Estado['clave'] }) {
  const Elegido = POR_ESTADO[estado]
  return <Elegido {...props} />
}

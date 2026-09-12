import { Dibujo, type DibujoProps } from './base'

/**
 * Bancal recién sembrado: la tierra en perspectiva con su cajón, un surco,
 * tres semillas y el cartelito de lo que va ahí. Es el estado vacío de La
 * semana —la primera pantalla de la app—, que hasta ahora mostraba el ícono
 * de casita adentro de un círculo punteado.
 *
 * Dos cosas aprendidas mirando la captura: sin la cara de adelante el
 * trapecio se lee como balde, y con el cartel colgando a un costado del palo
 * se lee como bandera de golf. El cartel va centrado.
 */
export function DibujoCantero(props: DibujoProps) {
  return (
    <Dibujo {...props}>
      <path d="M26 46 H70 L86 62 H10 Z" />
      <path d="M10 62 V76 H86 V62" />
      <path d="M20 57 Q48 60 76 57" />
      <circle cx="34" cy="55.5" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="46" cy="56.5" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="58" cy="55.5" r="2.2" fill="currentColor" stroke="none" />
      <path d="M72 46 V34" />
      <path d="M62 24 H82 V34 H62 Z" />
      <circle cx="66.5" cy="29" r="1.6" fill="currentColor" stroke="none" />
    </Dibujo>
  )
}

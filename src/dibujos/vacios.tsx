import { Dibujo, type DibujoProps } from './base'

/**
 * Los dibujos de los estados vacíos. Son cuatro para ocho pantallas, y el
 * reparto es por lo que la persona tiene que entender, no por la pantalla:
 *
 *  - todavía no cargaste nada → bancal sembrado (La semana) y maceta lista
 *    (Mi huerta): las dos invitan a cargar
 *  - buscaste y no salió nada → la zaranda, que es filtrar y que no quede
 *    nada arriba (Explorar, Calendario)
 *  - esto no existe o ya no está → la etiqueta en blanco (ficha de especie,
 *    planta, compostera, capítulo de compost)
 *
 * Comparten vocabulario a propósito: la etiqueta clavada del bancal es la
 * misma que después aparece sola y sin nombre.
 */

/**
 * Bancal recién sembrado: tierra en perspectiva con su cajón, un surco, tres
 * semillas y el cartelito de lo que va ahí.
 *
 * Dos cosas aprendidas mirando la captura: sin la cara de adelante el trapecio
 * se lee como balde, y con el cartel colgando a un costado del palo se lee
 * como bandera de golf. El cartel va centrado.
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

/**
 * Maceta cargada con tierra, esperando. La boca elíptica no es un adorno: sin
 * ella el trapecio se lee como vaso de plástico, y el hueco que le había
 * dibujado en la tierra, como una boca sonriendo.
 */
export function DibujoMaceta(props: DibujoProps) {
  return (
    <Dibujo {...props}>
      <ellipse cx="48" cy="32" rx="28" ry="8" />
      <path d="M20 32 L28 76 Q48 82 68 76 L76 32" />
      <path d="M20 39 Q48 49 76 39" />
      <path d="M24 46 Q48 56 72 46" />
    </Dibujo>
  )
}

/**
 * Zaranda: pasaste todo por el tamiz y no quedó nada arriba. La malla va
 * adentro del aro y en curva; derecha y pasada de largo, el dibujo se leía
 * como hamaca paraguaya.
 */
export function DibujoZaranda(props: DibujoProps) {
  return (
    <Dibujo {...props}>
      <ellipse cx="48" cy="38" rx="28" ry="9" />
      <path d="M20 38 V50 Q48 62 76 50 V38" />
      <path d="M10 36 H20" />
      <path d="M76 36 H86" />
      <path d="M23 34 H73" />
      <path d="M23 42 H73" />
      <path d="M32 30.6 V45.4" />
      <path d="M48 29 V47" />
      <path d="M64 30.6 V45.4" />
    </Dibujo>
  )
}

/** La etiqueta clavada, sin nombre: acá había algo y ya no está. */
export function DibujoEtiquetaVacia(props: DibujoProps) {
  return (
    <Dibujo {...props}>
      <path d="M48 84 V52" />
      <path d="M28 22 H68 V52 H28 Z" />
      <circle cx="35" cy="29" r="2" fill="currentColor" stroke="none" />
      <path d="M35 38 H61" />
      <path d="M35 45 H53" />
    </Dibujo>
  )
}

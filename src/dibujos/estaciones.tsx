import { Dibujo, type DibujoProps } from './base'
import type { Estacion } from '../lib/fechas'

/**
 * La viñeta de la estación, para el encabezado de La semana. Acompaña al
 * saludo que ya está escrito ahí (`saludoEstacional`): no dice nada que el
 * saludo no diga, y por eso es un dibujo y no un ícono.
 */

function Primavera(props: DibujoProps) {
  return (
    <Dibujo {...props}>
      {/* brote con pimpollo: lo que dice el saludo, «todo quiere brotar» */}
      <path d="M16 77 Q48 82 80 77" />
      <path d="M48 78 V34" />
      <path d="M48 62 C36 62 28 55 27 43 C39 43 47 50 48 62 Z" />
      <path d="M48 52 C60 52 68 45 69 33 C57 33 49 40 48 52 Z" />
      <path d="M48 34 C43 29 43 22 48 17 C53 22 53 29 48 34 Z" />
    </Dibujo>
  )
}

function Verano(props: DibujoProps) {
  return (
    <Dibujo {...props}>
      {/* el sol alto y la planta a la sombra */}
      <circle cx="66" cy="26" r="11" />
      <path d="M66 11 V6" />
      <path d="M79 13 L82 10" />
      <path d="M84 26 H89" />
      <path d="M79 39 L82 42" />
      <path d="M12 80 H52" />
      <path d="M30 80 V54" />
      <path d="M30 68 C20 68 14 62 13 52 C23 52 29 58 30 68 Z" />
      <path d="M30 58 C40 58 46 52 47 42 C37 42 31 48 30 58 Z" />
    </Dibujo>
  )
}

function Otonio(props: DibujoProps) {
  return (
    <Dibujo {...props}>
      {/* hojas que caen sobre el suelo que se está preparando */}
      <path d="M26 44 C26 26 40 14 58 14 C58 32 44 44 26 44 Z" />
      <path d="M26 44 L58 14" />
      <path d="M62 56 C62 48 68 42 76 42 C76 50 70 56 62 56 Z" />
      <path d="M62 56 L76 42" />
      <path d="M14 72 H82" />
      <path d="M22 82 H74" />
    </Dibujo>
  )
}

function Invierno(props: DibujoProps) {
  return (
    <Dibujo {...props}>
      {/* la rama descansa, pero tiene dos hojas: «no del todo» */}
      <path d="M24 82 C34 64 44 54 62 46" />
      <path d="M38 66 L29 55" />
      <path d="M52 52 C52 44 58 38 66 38 C66 46 60 52 52 52 Z" />
      <path d="M72 20 V30 M67.7 22.5 L76.3 27.5 M67.7 27.5 L76.3 22.5" />
      <path d="M28 38 V46 M24.5 40 L31.5 44 M24.5 44 L31.5 40" />
    </Dibujo>
  )
}

const POR_ESTACION: Record<Estacion, (p: DibujoProps) => React.ReactElement> = {
  primavera: Primavera,
  verano: Verano,
  otoño: Otonio,
  invierno: Invierno,
}

export function DibujoEstacion({ estacion, ...props }: DibujoProps & { estacion: Estacion }) {
  const Elegido = POR_ESTACION[estacion]
  return <Elegido {...props} />
}

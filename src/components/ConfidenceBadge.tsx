import { nivelConfianza } from '../lib/data/especies'
import './ConfidenceBadge.css'

interface Props {
  /** `null` = sin dato. No es confianza baja. */
  valor: number | null
  /** compacto: solo el número; extendido: "8/10" */
  compacto?: boolean
}

const TEXTO: Record<string, string> = {
  alta: 'confianza alta',
  media: 'confianza media',
  baja: 'confianza baja',
  sin: 'sin dato confiable',
}

/**
 * Color + forma de borde, nunca solo color. El caso `sin` se distingue por el
 * texto (`s/d`) y no por el borde: los tres bordes ya están usados.
 */
export function ConfidenceBadge({ valor, compacto }: Props) {
  const nivel = nivelConfianza(valor)
  const numero = valor === null ? 's/d' : compacto ? valor : `${valor}/10`
  const detalle = valor === null ? TEXTO.sin : `${TEXTO[nivel]}: ${valor} de 10`
  return (
    <span className={`conf conf--${nivel}`} title={detalle}>
      <span className="sr-solo">{TEXTO[nivel]}, </span>
      {numero}
    </span>
  )
}

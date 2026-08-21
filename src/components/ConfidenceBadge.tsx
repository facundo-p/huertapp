import { nivelConfianza } from '../lib/data/especies'
import './ConfidenceBadge.css'

interface Props {
  /** `null` = no hay dato. No es confianza baja: es no tener número. */
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
 * Badge de confianza del dato: color + forma de borde (nunca solo color).
 *
 * El caso `sin` no puede distinguirse por el borde —`solid`, `dashed` y
 * `dotted` ya están tomados por los tres escalones— así que su canal redundante
 * es **el texto**: dice `s/d` y no un número, que es imposible de confundir con
 * un 3/10 mire quien lo mire.
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

import { nivelConfianza } from '../lib/data/especies'
import './ConfidenceBadge.css'

interface Props {
  valor: number
  /** compacto: solo el número; extendido: "8/10" */
  compacto?: boolean
}

const TEXTO: Record<string, string> = {
  alta: 'confianza alta',
  media: 'confianza media',
  baja: 'confianza baja',
}

/** Badge de confianza del dato: color + forma de borde (nunca solo color). */
export function ConfidenceBadge({ valor, compacto }: Props) {
  const nivel = nivelConfianza(valor)
  return (
    <span className={`conf conf--${nivel}`} title={`${TEXTO[nivel]}: ${valor} de 10`}>
      <span className="sr-solo">{TEXTO[nivel]}, </span>
      {compacto ? valor : `${valor}/10`}
    </span>
  )
}

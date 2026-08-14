import type { EspecieEnriquecida, Mes } from '../lib/data/types'
import { estadoSiembra, estadoTrasplante } from '../lib/data/especies'
import { INICIALES_MES, NOMBRES_MES } from '../lib/fechas'
import './MonthStrip.css'

interface Props {
  especie: EspecieEnriquecida
  /** mes actual, para resaltar la columna */
  mesActual?: Mes
  /** muestra también la capa de trasplante (triangulito) */
  conTrasplante?: boolean
  /** con iniciales de mes debajo (en la ficha sí, en las tarjetas no) */
  conEtiquetas?: boolean
}

/**
 * Tira de 12 meses: verde relleno = ideal, amarillo con anillo = posible.
 * El color nunca es el único canal (relleno vs anillo, y triángulo para trasplante).
 */
export function MonthStrip({ especie, mesActual, conTrasplante, conEtiquetas }: Props) {
  const meses = Array.from({ length: 12 }, (_, i) => (i + 1) as Mes)
  return (
    <ul className={`tira-meses ${conEtiquetas ? 'tira-meses--etiquetada' : ''}`}>
      {meses.map((m) => {
        const siembra = estadoSiembra(especie, m)
        const trasplante = conTrasplante ? estadoTrasplante(especie, m) : null
        const clases = [
          'tira-meses__celda',
          siembra ? `es-${siembra}` : 'es-nada',
          m === mesActual ? 'es-ahora' : '',
        ].join(' ')
        return (
          <li key={m} className="tira-meses__item">
            <span className={clases} title={etiqueta(m, siembra, trasplante)}>
              <span className="sr-solo">{etiqueta(m, siembra, trasplante)}</span>
              {trasplante && <span className={`tira-meses__trasplante es-${trasplante}`} aria-hidden />}
            </span>
            {conEtiquetas && (
              <span className="tira-meses__inicial" aria-hidden>
                {INICIALES_MES[m - 1]}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function etiqueta(
  mes: Mes,
  siembra: 'ideal' | 'posible' | null,
  trasplante: 'ideal' | 'posible' | null,
): string {
  const nombre = NOMBRES_MES[mes - 1]
  const partes: string[] = []
  if (siembra === 'ideal') partes.push('siembra ideal')
  else if (siembra === 'posible') partes.push('siembra posible')
  if (trasplante === 'ideal') partes.push('trasplante ideal')
  else if (trasplante === 'posible') partes.push('trasplante posible')
  return partes.length ? `${nombre}: ${partes.join(' y ')}` : `${nombre}: no se siembra`
}

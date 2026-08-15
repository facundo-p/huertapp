import type { Decada, EspecieEnriquecida, Mes, Zona } from '../lib/data/types'
import { estadosDelMes, necesitaProteccion, type EstadoMes } from '../lib/data/especies'
import { INICIALES_MES, NOMBRES_MES, NOMBRES_TERCIO, decadasDelMes, mesDeDecada } from '../lib/fechas'
import './MonthStrip.css'

interface Props {
  especie: EspecieEnriquecida
  zona: Zona
  /** década actual, para resaltar el tercio en curso */
  decadaActual?: Decada
  /** muestra también la capa de trasplante (barra baja terracota) */
  conTrasplante?: boolean
  /** con iniciales de mes debajo (en la ficha sí, en las tarjetas no) */
  conEtiquetas?: boolean
  /** marca con una cupulita los meses que piden reparo del frío */
  conProteccion?: boolean
}

const MESES = Array.from({ length: 12 }, (_, i) => (i + 1) as Mes)

/**
 * Tira de 12 meses, cada uno partido en sus tres décadas.
 * Verde relleno = ideal, amarillo = se puede, hueco = no.
 * El color nunca es el único canal: la altura de la barra distingue siembra
 * (entera) de trasplante (mitad de abajo), y cada tercio tiene su texto para
 * lector de pantalla.
 */
export function MonthStrip({
  especie,
  zona,
  decadaActual,
  conTrasplante,
  conEtiquetas,
  conProteccion,
}: Props) {
  return (
    <ul className={`tira-meses ${conEtiquetas ? 'tira-meses--etiquetada' : ''}`}>
      {MESES.map((m) => {
        const siembra = estadosDelMes(especie, m, zona, 'siembra')
        const trasplante = conTrasplante ? estadosDelMes(especie, m, zona, 'trasplante') : null
        const decadas = decadasDelMes(m)
        const esMesActual = decadaActual != null && mesDeDecada(decadaActual) === m
        return (
          <li key={m} className="tira-meses__item">
            <span className={`tira-meses__celda ${esMesActual ? 'es-ahora' : ''}`}>
              <span className="sr-solo">{etiquetaMes(m, siembra, trasplante)}</span>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`tira-meses__tercio ${decadas[i] === decadaActual ? 'es-hoy' : ''}`}
                  aria-hidden
                >
                  <span className={`tira-meses__barra es-siembra ${clase(siembra[i])}`} />
                  {trasplante?.[i] && (
                    <span className={`tira-meses__barra es-trasplante ${clase(trasplante[i])}`} />
                  )}
                </span>
              ))}
            </span>
            {conEtiquetas && (
              <span className="tira-meses__inicial" aria-hidden>
                {INICIALES_MES[m - 1]}
              </span>
            )}
            {conProteccion && necesitaProteccion(especie, m) && (
              <span className="tira-meses__cupula" title={`${NOMBRES_MES[m - 1]}: almácigo protegido`}>
                <span className="sr-solo">{NOMBRES_MES[m - 1]}: necesita almácigo protegido</span>
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

const clase = (e: EstadoMes) => (e ? `es-${e}` : 'es-nada')

function etiquetaMes(
  mes: Mes,
  siembra: EstadoMes[],
  trasplante: EstadoMes[] | null,
): string {
  const nombre = NOMBRES_MES[mes - 1]
  const partes: string[] = []
  for (let i = 0; i < 3; i++) {
    const frases: string[] = []
    if (siembra[i]) frases.push(`siembra ${siembra[i] === 'ideal' ? 'ideal' : 'posible'}`)
    if (trasplante?.[i]) frases.push(`trasplante ${trasplante[i] === 'ideal' ? 'ideal' : 'posible'}`)
    if (frases.length) partes.push(`${NOMBRES_TERCIO[i]}: ${frases.join(' y ')}`)
  }
  return partes.length ? `${nombre} — ${partes.join('; ')}` : `${nombre}: no se siembra`
}

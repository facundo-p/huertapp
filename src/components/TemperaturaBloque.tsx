import type { Temperaturas } from '../lib/data/types'
import { ConfidenceBadge } from './ConfidenceBadge'
import { IconoFuente } from '../icons'
import './TemperaturaBloque.css'

const HELADA = {
  muere: { texto: 'La helada la mata', clase: 'muere', emoji: '☠️' },
  sensible: { texto: 'La helada la daña', clase: 'sensible', emoji: '⚠️' },
  tolera: { texto: 'Aguanta las heladas', clase: 'tolera', emoji: '✔️' },
  mejora: { texto: 'La helada la mejora', clase: 'mejora', emoji: '⭐' },
} as const

/** Escala visual de temperatura: rango tolerado con la franja ideal adentro. */
function Escala({
  min,
  idealMin,
  idealMax,
  max,
  unidad = '°C',
}: {
  min: number | null
  idealMin: number | null
  idealMax: number | null
  max: number | null
  unidad?: string
}) {
  // dominio de dibujo: -10 a 45 °C cubre todo lo de la huerta
  const DOM_MIN = -10
  const DOM_MAX = 45
  const pct = (v: number) => ((v - DOM_MIN) / (DOM_MAX - DOM_MIN)) * 100

  const desde = min ?? idealMin
  const hasta = max ?? idealMax
  if (desde === null || hasta === null) return null

  const iMin = idealMin ?? desde
  const iMax = idealMax ?? hasta

  return (
    <div className="escala">
      <div className="escala__riel">
        <span
          className="escala__tolerado"
          style={{ left: `${pct(desde)}%`, width: `${pct(hasta) - pct(desde)}%` }}
        />
        <span
          className="escala__ideal"
          style={{ left: `${pct(iMin)}%`, width: `${Math.max(pct(iMax) - pct(iMin), 2)}%` }}
        />
        {/* referencia: 0 °C */}
        <span className="escala__cero" style={{ left: `${pct(0)}%` }} aria-hidden />
      </div>
      <div className="escala__numeros">
        <span>
          {desde}
          {unidad}
        </span>
        <strong>
          ideal {iMin}–{iMax}
          {unidad}
        </strong>
        <span>
          {hasta}
          {unidad}
        </span>
      </div>
    </div>
  )
}

export function TemperaturaBloque({ t }: { t: Temperaturas }) {
  const helada = t.helada ? HELADA[t.helada] : null
  const hayGerm = t.germinacion.ideal_min !== null || t.germinacion.min !== null
  const hayCrec = t.crecimiento.ideal_min !== null || t.crecimiento.tolera_min !== null

  return (
    <section className="temp">
      <header className="temp__cabeza">
        <h2 className="dato__titulo">Temperaturas</h2>
        <ConfidenceBadge valor={t.confianza} />
      </header>

      {hayGerm && (
        <div className="temp__fila">
          <p className="dato__subtitulo">Para germinar (tierra)</p>
          <Escala
            min={t.germinacion.min}
            idealMin={t.germinacion.ideal_min}
            idealMax={t.germinacion.ideal_max}
            max={t.germinacion.max}
          />
        </div>
      )}

      {hayCrec && (
        <div className="temp__fila">
          <p className="dato__subtitulo">Para crecer (aire)</p>
          <Escala
            min={t.crecimiento.tolera_min}
            idealMin={t.crecimiento.ideal_min}
            idealMax={t.crecimiento.ideal_max}
            max={t.crecimiento.tolera_max}
          />
        </div>
      )}

      {helada && (
        <p className={`temp__helada es-${helada.clase}`}>
          <span aria-hidden>{helada.emoji}</span> {helada.texto}
        </p>
      )}

      <p className="temp__nota">{t.nota}</p>

      {t.fuentes.length > 0 && (
        <ul className="dato__fuentes">
          {t.fuentes.map((f) => (
            <li key={f.url}>
              <a href={f.url} target="_blank" rel="noreferrer noopener" className="fuente">
                <IconoFuente size={14} />
                <span>{f.organizacion}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

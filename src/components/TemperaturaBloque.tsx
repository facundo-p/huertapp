import type { Temperaturas } from '../lib/data/types'
import { modeloEscala, rotuloEscala, textoSinIdeal, type ValoresEscala } from '../lib/escalaTemperatura'
import { ConfidenceBadge } from './ConfidenceBadge'
import { IconoFuente } from '../icons'
import './TemperaturaBloque.css'

const HELADA = {
  muere: { texto: 'La helada la mata', clase: 'muere', emoji: '☠️' },
  sensible: { texto: 'La helada la daña', clase: 'sensible', emoji: '⚠️' },
  tolera: { texto: 'Aguanta las heladas', clase: 'tolera', emoji: '✔️' },
  mejora: { texto: 'La helada la mejora', clase: 'mejora', emoji: '⭐' },
} as const

/**
 * Escala visual de temperatura: la banda ideal con sus alas toleradas, cada
 * número alineado a lo que rotula. La geometría vive en `modeloEscala`; si un
 * extremo no tiene dato, ese lado no se dibuja y la etiqueta dice "s/d".
 */
function Escala({ nombre, ...v }: { nombre: string } & ValoresEscala) {
  const m = modeloEscala(v)
  if (!m) {
    // hay algún viable pero no el par ideal: el dato se dice, no se dibuja
    const texto = textoSinIdeal(v)
    return texto ? (
      <p className="temp__sin">
        <ConfidenceBadge valor={null} compacto /> {texto}
      </p>
    ) : null
  }

  return (
    <div className="escala" role="img" aria-label={rotuloEscala(nombre, v)}>
      <div className="escala__riel" aria-hidden>
        {m.bandas.map((b) => (
          <span
            key={`${b.tipo}-${b.desdePct}`}
            className={b.tipo === 'ideal' ? 'escala__ideal' : 'escala__tolerado'}
            style={{ left: `${b.desdePct}%`, width: `${b.anchoPct}%` }}
          />
        ))}
        {/* referencia: 0 °C */}
        <span className="escala__cero" style={{ left: `${m.ceroPct}%` }} />
      </div>
      <div className="escala__numeros" aria-hidden>
        {m.etiquetas.map((et) =>
          et.lado === 'ideal' ? (
            <strong key={et.lado} className="escala__ideal-num" style={{ left: `${et.pct}%` }}>
              {et.texto}
            </strong>
          ) : (
            <span
              key={et.lado}
              className={`escala__num ${et.sinDato ? 'es-sd' : 'es-centrada'}`}
              style={et.pct === null ? (et.lado === 'min' ? { left: 0 } : { right: 0 }) : { left: `${et.pct}%` }}
            >
              {et.texto}
            </span>
          ),
        )}
      </div>
    </div>
  )
}

export function TemperaturaBloque({
  t,
  germinaAplica = true,
}: {
  t: Temperaturas
  /** false en las de gajo o bulbo: no hay semilla que germinar */
  germinaAplica?: boolean
}) {
  const helada = t.helada ? HELADA[t.helada] : null
  const hayGerm = t.germinacion.ideal_min !== null || t.germinacion.min !== null
  const hayCrec = t.crecimiento.ideal_min !== null || t.crecimiento.tolera_min !== null

  return (
    <section className="temp">
      <header className="temp__cabeza">
        <h2 className="dato__titulo">Temperaturas</h2>
        <ConfidenceBadge valor={t.confianza} />
      </header>

      {/* Se dibuja igual sin dato: desaparecer en silencio parece no tener nada que decir. */}
      {germinaAplica && (
        <div className="temp__fila">
          <p className="dato__subtitulo">Para germinar (tierra)</p>
          {hayGerm ? (
            <Escala
              nombre="temperatura de la tierra para germinar"
              min={t.germinacion.min}
              idealMin={t.germinacion.ideal_min}
              idealMax={t.germinacion.ideal_max}
              max={t.germinacion.max}
            />
          ) : (
            <p className="temp__sin">
              <ConfidenceBadge valor={null} compacto /> No encontramos una fuente que dé la
              temperatura de germinación de esta especie.
            </p>
          )}
        </div>
      )}

      {hayCrec && (
        <div className="temp__fila">
          <p className="dato__subtitulo">Para crecer (aire)</p>
          <Escala
            nombre="temperatura del aire para crecer"
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

import { Link } from 'react-router'
import type { Cuidado, Fuente } from '../lib/data/types'
import { ETIQUETA_CUIDADO, ordenarCuidados } from '../lib/data/cuidados'
import { ConfidenceBadge } from './ConfidenceBadge'
import { IconoCuidado, IconoFuente } from '../icons'
import './Cuidados.css'

/**
 * Lo que hay que ir haciendo entre la siembra y la cosecha.
 *
 * La información ya estaba en la ficha, pero en prosa: "tutorar y realizar
 * desbrote/poda en variedades indeterminadas; intercalar albahaca…". Sirve
 * para leer una vez y no sirve para el sábado a la mañana con la tijera en la
 * mano. Acá cada práctica queda separada, con **cuándo** toca y **qué** se
 * hace, que son las dos preguntas que uno tiene parado frente a la planta.
 *
 * Cada cuidado conserva la confianza y las fuentes del campo del que salió: no
 * se agrega ni una recomendación que no estuviera respaldada.
 */
export function Cuidados({ cuidados }: { cuidados: Cuidado[] }) {
  if (!cuidados.length) return null

  return (
    <section className="dato cuidados">
      <header className="dato__cabeza">
        <span className="dato__icono" aria-hidden>
          <IconoCuidado size={20} />
        </span>
        <h2 className="dato__titulo">Mientras crece</h2>
      </header>

      <p className="cuidados__bajada">
        Lo que hay que ir haciendo entre la siembra y la cosecha. Si alguna de estas palabras no te
        dice nada, están explicadas en el <Link to="/glosario">glosario</Link>.
      </p>

      <ul className="cuidados__lista">
        {ordenarCuidados(cuidados).map((c, i) => (
          <li key={`${c.tipo}-${i}`} className="cuidado">
            <div className="cuidado__cabeza">
              <span className="cuidado__tipo">{ETIQUETA_CUIDADO[c.tipo]}</span>
              <ConfidenceBadge valor={c.confianza} compacto />
            </div>

            <p className="cuidado__cuando">{c.cuando}</p>
            <p className="cuidado__hacer">{c.que_hacer}</p>
            {c.por_que && (
              <p className="cuidado__porque">
                <span className="cuidado__porque-etiqueta">Por qué:</span> {c.por_que}
              </p>
            )}
          </li>
        ))}
      </ul>

      {/* Las fuentes van una vez y no por tarjeta: varios cuidados salen del
          mismo párrafo investigado, así que repetirlas era la misma chapita
          cuatro veces y tres pantallazos más de scroll. */}
      <ul className="dato__fuentes">
        {deduplicar(cuidados.flatMap((c) => c.fuentes)).map((f) => (
          <li key={f.url}>
            <a href={f.url} target="_blank" rel="noreferrer noopener" className="fuente">
              <IconoFuente size={14} />
              <span>{f.organizacion}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

function deduplicar(fuentes: Fuente[]): Fuente[] {
  return [...new Map(fuentes.map((f) => [f.url, f])).values()]
}

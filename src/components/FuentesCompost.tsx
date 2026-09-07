import { FilaConfianza } from './FilaConfianza'
import { IconoFuente } from '../icons'
import type { Fuente } from '../lib/compostaje'

/**
 * La procedencia de un bloque de la guía: los puntos de confianza y los chips
 * de fuente, con el mismo molde que la ficha de especie. Sin fuentes (un
 * bloque `null`) no se dibuja: el «s/d» lo pone el texto.
 */
export function FuentesCompost({
  ids,
  confianza,
  fuentes,
}: {
  ids: string[]
  confianza: number | null
  fuentes: Record<string, Fuente>
}) {
  if (ids.length === 0) return null
  return (
    <div className="compost__fuentes">
      <FilaConfianza valor={confianza} />
      <ul className="dato__fuentes">
        {ids.map((id) => {
          const f = fuentes[id]
          if (!f) return null
          return (
            <li key={id}>
              <a
                href={f.url}
                target="_blank"
                rel="noreferrer noopener"
                className="fuente"
                title={`${f.organizacion}: ${f.titulo}`}
                aria-label={`${f.organizacion}: ${f.titulo}`}
              >
                <span className="fuente__pildora">
                  <IconoFuente size={12} />
                  {f.corto}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

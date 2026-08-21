import type { ComponentType, ReactNode } from 'react'
import type { Dato } from '../lib/data/types'
import type { IconProps } from '../icons'
import { IconoAlerta, IconoFuente } from '../icons'
import { ConfidenceBadge } from './ConfidenceBadge'
import './DatoSection.css'

interface Props {
  titulo: string
  Icono: ComponentType<IconProps>
  /** `null` = sin dato. Necesita `vacio` para dibujarse. */
  dato: Dato | null
  /** Qué decir si no hay dato. Sin esto, un `dato` nulo no dibuja nada. */
  vacio?: string
  /** aclaración corta bajo el título, antes del texto de la fuente */
  bajada?: string
  /** "qué pasa si no se cumple" o señales; se muestra como aviso aparte */
  advertencia?: { titulo: string; texto: string }
  senales?: { titulo: string; texto: string }
  /** lo estructurado del campo (barrita, medidas), debajo del texto citado */
  children?: ReactNode
}

/** Un campo de la ficha: valor + confianza + advertencias + fuentes como links. */
export function DatoSection({
  titulo,
  Icono,
  dato,
  vacio,
  bajada,
  advertencia,
  senales,
  children,
}: Props) {
  if (!dato) {
    if (!vacio) return null
    return (
      <section className="dato dato--sin">
        <header className="dato__cabeza">
          <span className="dato__icono" aria-hidden>
            <Icono size={20} />
          </span>
          <h2 className="dato__titulo">{titulo}</h2>
          <ConfidenceBadge valor={null} />
        </header>
        <p className="dato__valor dato__valor--sin">{vacio}</p>
      </section>
    )
  }

  return (
    <section className="dato">
      <header className="dato__cabeza">
        <span className="dato__icono" aria-hidden>
          <Icono size={20} />
        </span>
        <h2 className="dato__titulo">{titulo}</h2>
        <ConfidenceBadge valor={dato.confianza} />
      </header>

      {bajada && <p className="dato__bajada">{bajada}</p>}

      <p className="dato__valor">{dato.valor}</p>

      {children}

      {senales?.texto && (
        <div className="dato__senales">
          <p className="dato__subtitulo">{senales.titulo}</p>
          <p className="dato__texto-chico">{senales.texto}</p>
        </div>
      )}

      {advertencia?.texto && (
        <div className="dato__aviso">
          <IconoAlerta size={17} />
          <div>
            <p className="dato__subtitulo">{advertencia.titulo}</p>
            <p className="dato__texto-chico">{advertencia.texto}</p>
          </div>
        </div>
      )}

      {dato.fuentes.length > 0 && (
        <ul className="dato__fuentes">
          {dato.fuentes.map((f) => (
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

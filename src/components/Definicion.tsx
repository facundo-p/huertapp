import { useState } from 'react'
import { Link } from 'react-router'
import { BottomSheet } from './BottomSheet'
import { ConfidenceBadge } from './ConfidenceBadge'
import { IconoFuente } from '../icons'
import { conNegritas } from '../lib/negritas'
import type { ContenidoDefinicion } from '../lib/glosario'
import './Definicion.css'

interface Props {
  /** lo que se lee en la pantalla */
  texto: string
  /** el título de la hoja, cuando el texto visible trae más que el nombre */
  titulo?: string
  contenido: ContenidoDefinicion
  /** la clase que le da tipografía y color al término en su contexto */
  className?: string
}

/**
 * Un término de la ficha que se toca y explica qué es.
 *
 * Variante de `ChipHoja`: mismo `<dialog>` por debajo y mismo botón de 44 con
 * la forma adentro. Lo que cambia es la forma —subrayado punteado, porque el
 * término tiene que seguir leyéndose como parte de la frase— y que la hoja
 * muestra en vez de elegir.
 *
 * La hoja es corta a propósito: lo completo está a un toque, en el Glosario.
 */
export function Definicion({ texto, titulo, contenido, className }: Props) {
  const [abierta, setAbierta] = useState(false)
  const nombre = titulo ?? texto

  return (
    <>
      <button
        type="button"
        className={`definicion ${className ?? ''}`}
        onClick={() => setAbierta(true)}
        aria-haspopup="dialog"
      >
        {/* El nombre accesible arranca con el texto que se ve (WCAG 2.5.3):
            dictarle al teléfono lo que uno lee tiene que funcionar. */}
        <span className="definicion__termino">{texto}</span>
        <span className="sr-solo">, ver qué es</span>
      </button>

      <BottomSheet
        abierto={abierta}
        onCerrar={() => setAbierta(false)}
        sobretitulo="Qué es"
        titulo={nombre}
        pie={
          <Link
            to={`/glosario#${contenido.ancla}`}
            className="definicion__glosario"
            onClick={() => setAbierta(false)}
          >
            Verlo en el Glosario →
          </Link>
        }
      >
        <p className="definicion__que">{conNegritas(contenido.que_es)}</p>

        {contenido.detalle && (
          <div>
            <p className="definicion__rotulo">{contenido.detalle.etiqueta}</p>
            <p className="definicion__que">{conNegritas(contenido.detalle.texto)}</p>
          </div>
        )}

        {contenido.receta && (
          <div>
            <p className="definicion__rotulo">{contenido.receta.etiqueta}</p>
            <p className="definicion__que">{conNegritas(contenido.receta.texto)}</p>
            {/* div y no p: dentro de un párrafo el test de 44 px exime al
                link, y esta fuente no es texto corrido */}
            <div className="definicion__cita">
              <ConfidenceBadge valor={contenido.receta.confianza} compacto />
              <a
                href={contenido.receta.fuente.url}
                target="_blank"
                rel="noreferrer noopener"
                className="fuente"
              >
                <span className="fuente__pildora">
                  <IconoFuente size={12} />
                  {contenido.receta.fuente.organizacion}
                </span>
              </a>
            </div>
          </div>
        )}
      </BottomSheet>
    </>
  )
}

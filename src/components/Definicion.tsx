import { useState } from 'react'
import { Link } from 'react-router'
import { BottomSheet } from './BottomSheet'
import { ConfidenceBadge } from './ConfidenceBadge'
import { IconoFuente } from '../icons'
import { conNegritas } from '../lib/negritas'
import type { ContenidoDefinicion, DatoCitado } from '../lib/glosario'
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

        {contenido.dato && <DatoConCita {...contenido.dato} />}

        {contenido.remite && (
          <Remite
            texto={contenido.remite}
            enlace={contenido.enlace}
            alIr={() => setAbierta(false)}
          />
        )}
      </BottomSheet>
    </>
  )
}

/** El remite, con la frase que nombra otro lugar del Glosario hecha link. */
function Remite({
  texto,
  enlace,
  alIr,
}: {
  texto: string
  enlace: ContenidoDefinicion['enlace']
  alIr: () => void
}) {
  const i = enlace ? texto.indexOf(enlace.frase) : -1
  if (!enlace || i < 0) return <p className="definicion__que">{texto}</p>
  return (
    <p className="definicion__que">
      {texto.slice(0, i)}
      <Link to={`/glosario#${enlace.ancla}`} onClick={alIr}>
        {enlace.frase}
      </Link>
      {texto.slice(i + enlace.frase.length)}
    </p>
  )
}

/**
 * Un dato con su cita. Lo que falta se dice, como en el resto de la ficha, y
 * sin el dato no va nada más: ni el «si no se cumple» ni las fuentes, que
 * parecerían respaldar algo.
 */
function DatoConCita({ etiqueta, texto, siNo, confianza, fuentes }: DatoCitado) {
  return (
    <div>
      <div className="definicion__dato">
        <div>
          <p className="definicion__rotulo">{etiqueta}</p>
          {texto ? (
            <p className="definicion__que">{conNegritas(texto)}</p>
          ) : (
            <p className="definicion__que es-sin-dato">No encontramos una fuente que lo diga.</p>
          )}
        </div>
        {texto && siNo && (
          <div>
            <p className="definicion__rotulo">{siNo.etiqueta}</p>
            <p className="definicion__que">{conNegritas(siNo.texto)}</p>
          </div>
        )}
      </div>
      {/* div y no p: dentro de un párrafo el test de 44 px exime a los links,
          y estas fuentes no son texto corrido */}
      <div className="definicion__cita">
        <span className="definicion__confianza">
          <ConfidenceBadge valor={texto ? confianza : null} compacto />
        </span>
        {texto && fuentes.length === 0 && (
          <span className="definicion__sin-fuente">sin fuente</span>
        )}
        {texto &&
          fuentes.map((f) => (
            <a
              key={f.url}
              href={f.url}
              target="_blank"
              rel="noreferrer noopener"
              className="fuente"
            >
              <span className="fuente__pildora">
                <IconoFuente size={12} />
                {f.organizacion}
              </span>
            </a>
          ))}
      </div>
    </div>
  )
}

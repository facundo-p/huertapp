import { Link } from 'react-router'
import type { Decada, EspecieEnriquecida, Zona } from '../lib/data/types'
import { IconoGrupo, IconoLuz, IconoSuelo, IconoReloj } from '../icons'
import { AnilloAnual } from './AnilloAnual'
import { diasHastaCierre, estadoSiembra } from '../lib/data/especies'
import './EspecieCard.css'

interface Props {
  especie: EspecieEnriquecida
  decadaActual: Decada
  zona: Zona
  /** hoy, para poder decir cuántos días quedan de ventana */
  hoy: Date
}

/**
 * Tarjeta minimalista: el nombre arriba y, debajo, el año como anillo con el
 * resto al lado. Toda la densidad va en la ficha.
 */
export function EspecieCard({ especie, decadaActual, zona, hoy }: Props) {
  const estado = estadoSiembra(especie, decadaActual, zona)
  // con décadas ya no hay que decir "último mes": se sabe cuántos días faltan
  const quedan = diasHastaCierre(especie, hoy, zona)

  return (
    <Link to={`/explorar/${especie.slug}`} className="especie-card">
      {/* h2 y no h3: la tarjeta cuelga directo del título de la pantalla, y
          así quien navega por encabezados recorre la lista de especies */}
      <h2 className="especie-card__nombre">{especie.nombre_comun}</h2>

      <AnilloAnual especie={especie} zona={zona} decadaActual={decadaActual} />

      <div className="especie-card__datos">
        {estado === 'ideal' && (
          <span className={`especie-card__ahora ${quedan != null ? 'es-cierra' : ''}`}>
            {/* "quedan 12 días" no entra en media tarjeta: la frase larga vive en la ficha */}
            {quedan != null ? (
              <>
                <IconoReloj size={13} /> {quedan === 1 ? 'último día' : `${quedan} días`}
              </>
            ) : (
              'ahora'
            )}
          </span>
        )}
        {estado === 'posible' && <span className="especie-card__ahora es-posible">se puede</span>}

        <div className="especie-card__iconos">
          <IconoGrupo grupo={especie.grupo} size={20} />
          <IconoSuelo categoria={especie.suelo.categoria_suelo} size={20} />
          <IconoLuz categoria={especie.luz.categoria_luz} size={20} />
        </div>

        {especie.variedades.length > 0 && (
          <span className="especie-card__variedades">{especie.variedades.length} variedades</span>
        )}
      </div>
    </Link>
  )
}

import { Link } from 'react-router'
import type { Decada, EspecieEnriquecida, Zona } from '../lib/data/types'
import { IconoGrupo, IconoLuz, IconoSuelo, IconoReloj } from '../icons'
import { MonthStrip } from './MonthStrip'
import { diasHastaCierre, estadoSiembra } from '../lib/data/especies'
import './EspecieCard.css'

interface Props {
  especie: EspecieEnriquecida
  decadaActual: Decada
  zona: Zona
  /** hoy, para poder decir cuántos días quedan de ventana */
  hoy: Date
}

/** Tarjeta minimalista: nombre + íconos + tira de meses. Toda la densidad va en la ficha. */
export function EspecieCard({ especie, decadaActual, zona, hoy }: Props) {
  const estado = estadoSiembra(especie, decadaActual, zona)
  // con décadas ya no hay que decir "último mes": se sabe cuántos días faltan
  const quedan = diasHastaCierre(especie, hoy, zona)

  return (
    <Link to={`/explorar/${especie.slug}`} className="especie-card etiqueta">
      <div className="especie-card__cabeza">
        {/* h2 y no h3: la tarjeta cuelga directo del título de la pantalla, y
            así quien navega por encabezados recorre la lista de especies */}
        <h2 className="especie-card__nombre">{especie.nombre_comun}</h2>
        {estado === 'ideal' && (
          <span className={`especie-card__ahora ${quedan != null ? 'es-cierra' : ''}`}>
            {quedan != null ? (
              <>
                <IconoReloj size={13} /> {quedan === 1 ? 'último día' : `quedan ${quedan} días`}
              </>
            ) : (
              'ahora'
            )}
          </span>
        )}
        {estado === 'posible' && <span className="especie-card__ahora es-posible">se puede</span>}
      </div>

      <div className="especie-card__iconos">
        <IconoGrupo grupo={especie.grupo} size={21} />
        <IconoSuelo categoria={especie.suelo.categoria_suelo} size={21} />
        <IconoLuz categoria={especie.luz.categoria_luz} size={21} />
      </div>

      <MonthStrip especie={especie} zona={zona} decadaActual={decadaActual} />
    </Link>
  )
}

import { Link } from 'react-router'
import type { EspecieEnriquecida, Mes } from '../lib/data/types'
import { IconoGrupo, IconoLuz, IconoSuelo, IconoReloj } from '../icons'
import { MonthStrip } from './MonthStrip'
import { estadoSiembra, ultimoMesIdeal } from '../lib/data/especies'
import './EspecieCard.css'

interface Props {
  especie: EspecieEnriquecida
  mesActual: Mes
}

/** Tarjeta minimalista: nombre + íconos + tira de meses. Toda la densidad va en la ficha. */
export function EspecieCard({ especie, mesActual }: Props) {
  const estado = estadoSiembra(especie, mesActual)
  const seCierra = estado === 'ideal' && ultimoMesIdeal(especie, mesActual)

  return (
    <Link to={`/explorar/${especie.slug}`} className="especie-card etiqueta">
      <div className="especie-card__cabeza">
        <h3 className="especie-card__nombre">{especie.nombre_comun}</h3>
        {estado === 'ideal' && (
          <span className={`especie-card__ahora ${seCierra ? 'es-cierra' : ''}`}>
            {seCierra ? (
              <>
                <IconoReloj size={13} /> última semana
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

      <MonthStrip especie={especie} mesActual={mesActual} />
    </Link>
  )
}

import { Link } from 'react-router'
import { ConfidenceBadge } from './ConfidenceBadge'
import type { TipoCuidado, VariedadRef } from '../lib/data/types'
import './Variedades.css'

/** Cómo se llama cada campo cuando hay que decirlo en el título de una fila. */
const CAMPO: Record<string, string> = {
  fecha_siembra: 'Cuándo se siembra',
  forma_siembra: 'Cómo se siembra',
  transplante: 'Trasplante',
  cosecha: 'Cosecha',
  germinacion: 'Germinación',
  longevidad: 'Ciclo de vida',
  trucos: 'Manejo',
  riego: 'Riego',
  maceta: 'Maceta',
  suelo: 'Suelo',
  luz: 'Luz',
}

/** Lo que la variedad **no** lleva, dicho en positivo para que se entienda de un vistazo. */
const SIN_CUIDADO: Partial<Record<TipoCuidado, string>> = {
  tutorado: 'No necesita tutor.',
  poda: 'No se desbrota.',
  blanqueo: 'No se blanquea.',
  raleo: 'No se ralea.',
  aporque: 'No se aporca.',
  mulch: 'No lleva mulch.',
}

/**
 * Las variedades que se cultivan distinto de su especie.
 *
 * Cada una dice **qué cambia**, y eso no es decoración: el criterio del
 * catálogo es que una variedad se separa por una diferencia de cultivo citada,
 * así que mostrar solo los nombres escondería justamente lo que la justifica.
 */
export function Variedades({ refs }: { refs: VariedadRef[] }) {
  if (!refs.length) return null

  return (
    <section className="dato variedades">
      <h2 className="dato__titulo">Variedades</h2>
      <p className="variedades__bajada">
        Estas no se cultivan igual entre sí. Si sabés cuál tenés, abrila: su ficha trae el
        calendario y los cuidados que le tocan a esa.
      </p>

      <ul className="variedades__lista">
        {refs.map((v) => (
          <li key={v.slug}>
            <Link to={`/explorar/${v.slug}`} className="variedad">
              <span className="variedad__nombre">{v.nombre_comun}</span>
              <ul className="variedad__cambios">
                {v.cambia.map((c) => (
                  <li key={c.campo} className="variedad__cambio">
                    <div className="variedad__cabeza">
                      <span className="variedad__campo">{CAMPO[c.campo] ?? c.campo}</span>
                      <ConfidenceBadge valor={c.confianza} compacto />
                    </div>
                    <p className="variedad__valor">{c.valor}</p>
                  </li>
                ))}
                {v.quita.map((t) => (
                  <li key={t} className="variedad__cambio">
                    <div className="variedad__cabeza">
                      <span className="variedad__campo">Manejo</span>
                    </div>
                    <p className="variedad__valor">{SIN_CUIDADO[t] ?? `No lleva ${t}.`}</p>
                  </li>
                ))}
              </ul>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

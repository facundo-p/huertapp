import { useState } from 'react'
import { marcarGerminada } from '../lib/huerta/store'
import { causasDeDemora, germinacion, type Causa } from '../lib/huerta/germinacion'
import { desdeISO, type Planta } from '../lib/huerta/tipos'
import { IconoAlerta, IconoFuente, IconoSembrar } from '../icons'
import type { ClimaDecada, EspecieEnriquecida, Fuente } from '../lib/data/types'
import './BloqueGerminacion.css'

const fechaCorta = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short' }).format(desdeISO(iso))

/** Los textos de las pistas marcan lo importante con `**`. */
const negritas = (t: string) =>
  t.split(/\*\*(.+?)\*\*/g).map((x, i) => (i % 2 ? <strong key={i}>{x}</strong> : x))

const fuentesDeLaFicha = (causas: Causa[]): Fuente[] => [
  ...new Map(causas.flatMap((c) => c.fuentes ?? []).map((f) => [f.url, f])).values(),
]

/**
 * "¿Ya tendría que haber asomado?", que es la pregunta que uno se hace mirando
 * la maceta a los diez días. Y si el plazo se pasó, por qué puede estar
 * tardando — separando lo que se puede afirmar con números de lo que es
 * simplemente una lista de cosas para ir a chequear.
 */
export function BloqueGerminacion({
  planta,
  especie,
  clima,
}: {
  planta: Planta
  especie: EspecieEnriquecida
  clima: ClimaDecada[]
}) {
  const [abierto, setAbierto] = useState(false)
  const g = germinacion(planta, especie)
  if (!g || g.estado === 'no_aplica') return null

  if (g.estado === 'germino') {
    return (
      <p className="germ germ--ok">
        <IconoSembrar size={19} />
        <span>
          Germinó el <strong>{fechaCorta(planta.germino!)}</strong>.
        </span>
      </p>
    )
  }

  const causas = g.estado === 'demorada' ? causasDeDemora(planta, especie, clima) : []

  return (
    <div className={`germ germ--${g.estado}`}>
      <div className="germ__cabeza">
        {g.estado === 'demorada' ? <IconoAlerta size={19} /> : <IconoSembrar size={19} />}
        <div>
          <p className="germ__titulo">
            {g.estado === 'temprano' && (g.faltan === 1 ? 'Debería asomar mañana' : `Debería asomar en ${g.faltan} días`)}
            {g.estado === 'en_ventana' && 'Ya podría estar asomando'}
            {g.estado === 'demorada' &&
              (g.diasDeMas === 1
                ? 'Hace 1 día que debería haber asomado'
                : `Hace ${g.diasDeMas} días que debería haber asomado`)}
          </p>
          <p className="germ__detalle">
            La ficha da entre {especie.dias_germinacion!.min} y {especie.dias_germinacion!.max} días:
            del {fechaCorta(g.desde)} al {fechaCorta(g.hasta)}.
          </p>
        </div>
      </div>

      {g.estado !== 'temprano' && (
        <button className="germ__boton" onClick={() => void marcarGerminada(planta)}>
          🌱 Ya asomó
        </button>
      )}

      {g.estado === 'demorada' && (
        <>
          <button
            className="germ__desplegar"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
          >
            {abierto ? 'Ocultar' : '¿Por qué puede estar tardando?'}
          </button>

          {abierto && (
            <ul className="germ__causas">
              {causas.map((c) => (
                <li key={c.titulo} className={`germ__causa es-${c.clase}`}>
                  <p className="germ__causa-titulo">
                    {c.titulo}
                    {c.clase === 'medido' && <span className="germ__sello">según tus datos</span>}
                    {c.clase === 'especie' && (
                      <span className="germ__sello es-ficha">
                        según la ficha de {especie.nombre_comun.toLowerCase()}
                      </span>
                    )}
                  </p>
                  <p className="germ__causa-detalle">{negritas(c.detalle)}</p>
                </li>
              ))}

              {/* Las fuentes van una vez y no por causa: varias pistas salen
                  del mismo párrafo investigado, y repetidas eran seis chapitas
                  de 44 px diciendo lo mismo. */}
              {fuentesDeLaFicha(causas).length > 0 && (
                <li className="germ__fuentes">
                  <p className="germ__causa-detalle">De dónde sale lo de esta especie:</p>
                  <ul className="dato__fuentes">
                    {fuentesDeLaFicha(causas).map((f) => (
                      <li key={f.url}>
                        <a href={f.url} target="_blank" rel="noreferrer noopener" className="fuente">
                          <IconoFuente size={14} />
                          <span>{f.organizacion}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              )}

              <li className="germ__causa es-chequear">
                <p className="germ__causa-detalle">
                  Si pasaron varios días más y no aparece nada, es razonable dar esas semillas por
                  perdidas y volver a sembrar. No es un fracaso: pasa siempre.
                </p>
              </li>
            </ul>
          )}
        </>
      )}
    </div>
  )
}

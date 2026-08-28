import { useState } from 'react'
import { marcarGerminada, sinRomper } from '../lib/huerta/store'
import { causasDeDemora, germinacion, type Causa } from '../lib/huerta/germinacion'
import { desdeISO, hoyISO, type Planta } from '../lib/huerta/tipos'
import { sumarDias } from '../lib/huerta/estimar'
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
 * Un chip que abre el calendario nativo. El input tapa toda la etiqueta en
 * transparente: así abre tocando cualquier parte, no un ícono de 16 px. Y
 * queda siempre vacío porque es una acción, no un campo — se elige y se aplica.
 */
function OtroDia({
  texto,
  clase,
  planta,
  elegir,
}: {
  texto: string
  clase: string
  planta: Planta
  elegir: (fecha: string) => void
}) {
  return (
    <label className={clase}>
      {texto}
      <input
        type="date"
        className="germ__fecha"
        min={planta.sembrada}
        max={hoyISO()}
        value=""
        onChange={(ev) => elegir(ev.target.value)}
      />
    </label>
  )
}

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

  const hoy = hoyISO()

  /** Acota a mano lo que el `min`/`max` del input no garantiza si lo tipean. */
  const asomo = (fecha: string) => {
    if (!fecha) return
    const acotada = fecha < planta.sembrada ? planta.sembrada : fecha > hoy ? hoy : fecha
    sinRomper(marcarGerminada(planta, acotada))
  }

  if (g.estado === 'germino') {
    return (
      <p className="germ germ--ok">
        <IconoSembrar size={19} />
        <span>
          Germinó el <strong>{fechaCorta(planta.germino!)}</strong>.
        </span>
        <OtroDia texto="Corregir" clase="germ__corregir" planta={planta} elegir={asomo} />
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
        <div className="germ__asomo">
          <p className="germ__pregunta">¿Cuándo asomó?</p>
          <div className="germ__opciones">
            <button className="germ__boton" onClick={() => asomo(hoy)}>
              Hoy
            </button>
            <button className="germ__boton es-suave" onClick={() => asomo(sumarDias(hoy, -1))}>
              Ayer
            </button>
            <OtroDia texto="Otro día" clase="germ__boton es-suave" planta={planta} elegir={asomo} />
          </div>
        </div>
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

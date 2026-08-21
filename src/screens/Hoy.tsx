import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Header } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { NoSePudoLeer } from '../components/AvisoDatos'
import { AltaPlanta } from '../components/AltaPlanta'
import { useEspecies } from '../lib/useEspecies'
import { useZona } from '../lib/zona'
import { useHuerta } from '../lib/huerta/store'
import { useEstadoTareas, completar, posponer } from '../lib/tareas/estado'
import { derivarTareas, paraSembrarAhora, tareasVisibles, type Tarea } from '../lib/tareas/engine'
import { hoyISO } from '../lib/huerta/tipos'
import { fechaLarga, nombreDecada, decadaDe, saludoEstacional } from '../lib/fechas'
import {
  IconoAlerta,
  IconoCosechar,
  IconoGrupo,
  IconoHoy,
  IconoProtegido,
  IconoSembrar,
  IconoTrasplantar,
} from '../icons'
import './Hoy.css'

const ICONO_TAREA = {
  helada: IconoAlerta,
  trasplantar: IconoTrasplantar,
  revisar_germinacion: IconoSembrar,
  cosechar: IconoCosechar,
  sembrar: IconoSembrar,
} as const

export function Hoy() {
  const { indice, cargando } = useEspecies()
  const zona = useZona()
  const { plantas, cargado, errorCarga } = useHuerta()
  const estadoTareas = useEstadoTareas()
  const hoy = new Date()
  const iso = hoyISO(hoy)
  const decadaHoy = decadaDe(hoy)

  const [abrirAlta, setAbrirAlta] = useState<string | undefined>()
  const [festejando, setFestejando] = useState<string | null>(null)

  const tareas = useMemo(() => {
    if (!indice) return []
    const clima = indice.db.meta.enriquecido.clima[zona]
    return tareasVisibles(
      derivarTareas({ plantas, porSlug: indice.porSlug, clima, hoy: iso }),
      estadoTareas,
      iso,
    )
  }, [indice, plantas, zona, iso, estadoTareas])

  const sugerencias = useMemo(
    () => (indice ? paraSembrarAhora(indice.todas, zona, iso) : []),
    [indice, zona, iso],
  )

  async function alCompletar(t: Tarea) {
    setFestejando(t.id)
    setTimeout(() => setFestejando(null), 700)
    await completar(t.id)
  }

  const listo = cargado && !cargando

  return (
    <div className="pantalla">
      <Header titulo={fechaLarga(hoy)} sobretitulo={saludoEstacional(hoy)} />

      <div className="pantalla__cuerpo">
        {errorCarga && <NoSePudoLeer error={errorCarga} />}

        {listo && tareas.length > 0 && (
          <section className="hoy__seccion">
            <h2 className="seccion__titulo subrayado-onda">Para hacer</h2>
            <ul className="tareas">
              {tareas.map((t, i) => (
                <li
                  key={t.id}
                  className={`tarea es-${t.tipo} ${festejando === t.id ? 'es-festejando' : ''} aparecer`}
                  style={{ '--retraso': `${Math.min(i, 6) * 0.04}s` } as React.CSSProperties}
                >
                  <TareaFila
                    tarea={t}
                    festejando={festejando === t.id}
                    onCompletar={() => void alCompletar(t)}
                    onPosponer={() => void posponer(t.id)}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {listo && tareas.length === 0 && plantas.length > 0 && (
          <p className="hoy__al-dia">
            🌿 Nada urgente hoy. Aprovechá para mirar cómo van y sacarles una foto.
          </p>
        )}

        {listo && plantas.length === 0 && (
          <EmptyState
            Icono={IconoHoy}
            titulo="Tu huerta está por empezar"
            texto="Cuando cargues lo que plantaste, acá te voy a decir qué toca cada día y por qué."
          />
        )}

        {sugerencias.length > 0 && (
          <section className="hoy__seccion">
            <h2 className="seccion__titulo subrayado-onda">Para sembrar ahora</h2>
            <p className="hoy__bajada">
              En {nombreDecada(decadaHoy)}, ordenado por lo que primero se te cierra.
            </p>
            <ul className="carrusel">
              {sugerencias.map((s) => (
                <li key={s.especie.slug}>
                  <div className="sugerencia etiqueta">
                    <Link to={`/explorar/${s.especie.slug}`} className="sugerencia__link">
                      <span className="sugerencia__icono">
                        <IconoGrupo grupo={s.especie.grupo} size={22} decorativo />
                      </span>
                      <span className="sugerencia__nombre">{s.especie.nombre_comun}</span>
                      <span className={`sugerencia__ventana ${s.seCierra ? 'es-cierra' : ''}`}>
                        {s.seCierra
                          ? s.decadasRestantes === 1
                            ? 'última semana'
                            : 'se cierra pronto'
                          : `quedan ${s.decadasRestantes * 10} días`}
                      </span>
                      {s.enAlmacigo && (
                        <span className="sugerencia__metodo">
                          <IconoProtegido size={13} /> en almácigo
                        </span>
                      )}
                    </Link>
                    <button className="sugerencia__sumar" onClick={() => setAbrirAlta(s.especie.slug)}>
                      Sumar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <AltaPlanta
        abierto={!!abrirAlta}
        slug={abrirAlta}
        onCerrar={() => setAbrirAlta(undefined)}
      />
    </div>
  )
}

function TareaFila({
  tarea: t,
  festejando,
  onCompletar,
  onPosponer,
}: {
  tarea: Tarea
  festejando: boolean
  onCompletar: () => void
  onPosponer: () => void
}) {
  const Icono = ICONO_TAREA[t.tipo]
  const cuerpo = (
    <>
      <span className="tarea__icono">
        {festejando ? <span className="brotar">🌱</span> : <Icono size={21} />}
      </span>
      <span className="tarea__textos">
        <span className="tarea__titulo">
          {t.titulo}
          {t.atrasada && <span className="tarea__atrasada">atrasada</span>}
        </span>
        <span className="tarea__detalle">{t.detalle}</span>
        {/* de dónde sale: sin esto, es una app que manda sin explicar */}
        <span className="tarea__fuente">{t.fuente}</span>
      </span>
    </>
  )

  return (
    <>
      {t.plantaId ? (
        <Link to={`/huerta/${t.plantaId}`} className="tarea__cuerpo">
          {cuerpo}
        </Link>
      ) : (
        <div className="tarea__cuerpo">{cuerpo}</div>
      )}
      <div className="tarea__acciones">
        <button className="tarea__accion es-listo" onClick={onCompletar}>
          Hecho
        </button>
        <button className="tarea__accion" onClick={onPosponer}>
          Más tarde
        </button>
      </div>
    </>
  )
}

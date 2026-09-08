import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Header } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { NoSePudoLeer } from '../components/AvisoDatos'
import { GanttPlanta } from '../components/GanttPlanta'
import { AltaPlanta } from '../components/AltaPlanta'
import { FichaUbicacion } from '../components/FichaUbicacion'
import { FichaCompostera } from '../components/FichaCompostera'
import { useCompostaje } from '../lib/compostaje'
import { diasEnEstado, proximoGiro } from '../lib/huerta/compostera'
import { useEspecies } from '../lib/useEspecies'
import { useZona } from '../lib/zona'
import { useHuerta } from '../lib/huerta/store'
import { useEstadoTareas } from '../lib/tareas/estado'
import { derivarTareas, tareasVisibles } from '../lib/tareas/engine'
import { ESTADO_COMPOST_INFO, desdeISO, hoyISO, type Planta, type Ubicacion } from '../lib/huerta/tipos'
import { resumenHuerta } from '../lib/huerta/tanda'
import { mesesDelEje } from '../lib/huerta/gantt'
import { MES_CORTO } from '../lib/fechas'
import {
  alternarUbicacion,
  guardarPlegado,
  leerPlegado,
  podarPlegado,
  type Plegado,
} from '../lib/huerta/plegado'
import { IconoAlerta, IconoCompost, IconoDesplegar, IconoEditar, IconoHuerta, IconoTacho } from '../icons'
import './MiHuerta.css'

export function MiHuerta() {
  const { indice, cargando } = useEspecies()
  const zona = useZona()
  const { plantas, ubicaciones, composteras, cargado, errorCarga } = useHuerta()
  const guia = useCompostaje()
  const estadoTareas = useEstadoTareas()
  const [abrirAlta, setAbrirAlta] = useState(false)
  const [abrirCompostera, setAbrirCompostera] = useState(false)
  const [editando, setEditando] = useState<Ubicacion | null>(null)
  const [plegado, setPlegado] = useState<Plegado>(leerPlegado)

  const activas = useMemo(
    () =>
      plantas
        .filter((p) => !p.archivada)
        .sort((a, b) => b.sembrada.localeCompare(a.sembrada)),
    [plantas],
  )

  const porUbicacion = useMemo(() => {
    const grupos = new Map<string, Planta[]>()
    for (const p of activas) {
      const clave = p.ubicacionId ?? ''
      grupos.set(clave, [...(grupos.get(clave) ?? []), p])
    }
    return grupos
  }, [activas])

  /**
   * Cuántas cosas pendientes tiene cada planta. Sale del **mismo motor** que
   * alimenta a Hoy: si Mi huerta contara por su cuenta, tarde o temprano las
   * dos pantallas dirían cosas distintas sobre la misma planta. Y respeta lo
   * completado y lo pospuesto, así una tarea que ya resolviste no te sigue
   * mostrando el triangulito.
   */
  const pendientes = useMemo(() => {
    const cuenta = new Map<string, number>()
    if (!indice) return cuenta
    const hoy = hoyISO()
    const tareas = tareasVisibles(
      derivarTareas({
        plantas,
        porSlug: indice.porSlug,
        clima: indice.db.meta.enriquecido.clima[zona],
        composteras,
        guia,
        hoy,
      }),
      estadoTareas,
      hoy,
    )
    for (const t of tareas) {
      const clave = t.plantaId ?? t.composteraId
      if (clave) cuenta.set(clave, (cuenta.get(clave) ?? 0) + 1)
    }
    return cuenta
  }, [indice, plantas, composteras, guia, zona, estadoTareas])

  // los ids de lo que se borró no tienen por qué quedar guardados para siempre
  useEffect(() => {
    if (!cargado) return
    const podado = podarPlegado(
      plegado,
      new Set(ubicaciones.map((u) => u.id)),
      new Set(plantas.map((p) => p.id)),
    )
    if (
      podado.ubicacionesCerradas.length !== plegado.ubicacionesCerradas.length ||
      podado.plantasAbiertas.length !== plegado.plantasAbiertas.length
    ) {
      setPlegado(podado)
      guardarPlegado(podado)
    }
  }, [cargado, ubicaciones, plantas, plegado])

  function guardar(nuevo: Plegado) {
    setPlegado(nuevo)
    guardarPlegado(nuevo)
  }

  const listo = cargado && !cargando

  return (
    <div className="pantalla">
      <Header
        titulo="Mi huerta"
        sobretitulo={listo && activas.length ? resumenHuerta(activas) : 'Lo que tenés plantado'}
      />

      <div className="pantalla__cuerpo">
        {errorCarga && <NoSePudoLeer error={errorCarga} />}

        {listo && activas.length === 0 && (
          <EmptyState
            Icono={IconoHuerta}
            titulo="Todavía no plantaste nada"
            texto="O sí, pero no me contaste. Sumá lo que tengas y te voy siguiendo el ciclo."
            accion={
              <button className="huerta__cta" onClick={() => setAbrirAlta(true)}>
                Sumar la primera
              </button>
            }
          />
        )}

        {listo &&
          activas.length > 0 &&
          [...porUbicacion.entries()].map(([ubiId, lista]) => {
            const ubi = ubicaciones.find((u) => u.id === ubiId)
            const cerrada = plegado.ubicacionesCerradas.includes(ubiId)
            const panel = `ubicacion-${ubiId || 'sin'}`
            const alertas = lista.reduce((n, p) => n + (pendientes.get(p.id) ?? 0), 0)

            return (
              <section key={ubiId || 'sin'} className="huerta__seccion">
                {/* el lápiz va fuera del h2: adentro le sumaría "Editar…" al
                    nombre del encabezado cada vez que se navega por títulos */}
                <div className="huerta__fila">
                  <h2 className="huerta__ubicacion">
                    <button
                      className="huerta__plegar"
                      aria-expanded={!cerrada}
                      aria-controls={panel}
                      onClick={() => guardar(alternarUbicacion(plegado, ubiId))}
                    >
                      <IconoDesplegar
                        size={18}
                        className={`galon ${cerrada ? '' : 'es-abierto'}`}
                      />
                      <span className="huerta__lugar">{ubi ? ubi.nombre : 'Sin lugar asignado'}</span>
                      <span className="huerta__cuenta">{lista.length}</span>
                      {/* plegar una ubicación no puede esconder que algo pide atención */}
                      {cerrada && alertas > 0 && <Alertas cuantas={alertas} />}
                    </button>
                  </h2>
                  {ubi && (
                    <button
                      className="huerta__editar"
                      aria-label={`Editar ${ubi.nombre}`}
                      onClick={() => setEditando(ubi)}
                    >
                      <IconoEditar size={18} />
                    </button>
                  )}
                </div>

                <div id={panel} className="huerta__grilla" hidden={cerrada}>
                  <GanttEje />
                  {lista.map((p, i) => (
                    <div
                      key={p.id}
                      className="aparecer"
                      style={{ '--retraso': `${Math.min(i, 8) * 0.03}s` } as React.CSSProperties}
                    >
                      {indice?.porSlug.get(p.slug) && (
                        <GanttPlanta
                          planta={p}
                          especie={indice.porSlug.get(p.slug)!}
                          pendientes={pendientes.get(p.id) ?? 0}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )
          })}

        {listo && activas.length > 0 && (
          <>
            {/* cada muestra con su palabra: si el wrap las separa, la leyenda
                deja de decir qué es cada color */}
            <p className="gantt-leyenda">
              <span>
                <i className="es-crece" /> creciendo
              </span>
              <span>
                <i className="es-trasplante" /> ventana de trasplante
              </span>
              <span>
                <i className="es-cosecha" /> ventana de cosecha
              </span>
            </p>
            <button
              className="huerta__cta huerta__cta--secundario"
              onClick={() => setAbrirAlta(true)}
            >
              ＋ Sumar otra planta
            </button>
          </>
        )}

        {/* Las composteras viven acá, con lo demás que registrás; la guía es
            la pestaña Compost y no sabe de tus tachos. */}
        {listo && (
          <section className="huerta__seccion huerta__compost">
            <h2 className="huerta__compost-titulo">
              <IconoCompost size={18} />
              Compost
              {composteras.length > 0 && <span className="huerta__cuenta">{composteras.length}</span>}
            </h2>
            {composteras.length > 0 && (
              <ul className="composteras">
                {composteras.map((c) => {
                  const giro = proximoGiro(c)
                  const alertas = pendientes.get(c.id) ?? 0
                  const detalle = [
                    `${ESTADO_COMPOST_INFO[c.estado].etiqueta.toLowerCase()} desde hace ${diasEnEstado(c, hoyISO())} días`,
                    giro ? (giro <= hoyISO() ? 'toca girar' : `girar el ${fechaCorta(giro)}`) : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')
                  return (
                    <li key={c.id}>
                      <Link to={`/huerta/compostera/${c.id}`} className="composteras__fila">
                        <span className="composteras__icono" aria-hidden>
                          {c.sistema === 'tachos' ? <IconoTacho size={20} /> : <IconoHuerta size={20} />}
                        </span>
                        <span className="composteras__textos">
                          <span className="composteras__nombre">{c.nombre}</span>
                          <span className="composteras__detalle">{detalle}</span>
                        </span>
                        {alertas > 0 && <Alertas cuantas={alertas} />}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
            <button className="huerta__cta huerta__cta--secundario" onClick={() => setAbrirCompostera(true)}>
              ＋ {composteras.length ? 'Sumar otra compostera' : 'Sumar una compostera'}
            </button>
          </section>
        )}
      </div>

      <AltaPlanta abierto={abrirAlta} onCerrar={() => setAbrirAlta(false)} />
      <FichaCompostera abierto={abrirCompostera} onCerrar={() => setAbrirCompostera(false)} />
      <FichaUbicacion
        abierto={!!editando}
        ubicacion={editando ?? undefined}
        onCerrar={() => setEditando(null)}
      />
    </div>
  )
}

/**
 * El triangulito con la cuenta. El número va como texto de verdad —no como
 * color ni como tamaño— porque el color nunca puede ser el único canal, y
 * porque "2" y "5" no se distinguen si el aviso es solo un puntito.
 */
function Alertas({ cuantas }: { cuantas: number }) {
  return (
    <span className="huerta__alertas">
      <IconoAlerta size={14} />
      {cuantas}
      <span className="sr-solo">{cuantas === 1 ? ' cosa para atender' : ' cosas para atender'}</span>
    </span>
  )
}

const fechaCorta = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short' }).format(desdeISO(iso))

/**
 * Los siete meses del gantt, una sola vez por lugar. Se calculan desde hoy y
 * no son fijos: en septiembre corresponde jul…ene.
 */
function GanttEje() {
  return (
    <>
      <p className="gantt-eje" aria-hidden>
        {mesesDelEje().map((m, i) => (
          <span key={i} className={m.esActual ? 'es-actual' : ''}>
            {MES_CORTO[m.mes - 1]}
            {m.esActual ? ' · hoy' : ''}
          </span>
        ))}
      </p>
    </>
  )
}

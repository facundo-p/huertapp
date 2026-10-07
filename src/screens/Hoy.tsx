import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Accesos } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { NoSePudoLeer } from '../components/AvisoDatos'
import { AltaPlanta } from '../components/AltaPlanta'
import { HojaDia } from '../components/HojaDia'
import { PaginaDia, TiraSemana, type AccionesTarea, type DiaSemana } from '../components/Semana'
import { useEspecies } from '../lib/useEspecies'
import { useZona } from '../lib/zona'
import { useHuerta, marcarGerminada, marcarGirada, sinRomper } from '../lib/huerta/store'
import { useCompostaje } from '../lib/compostaje'
import { useAvisosClima } from '../lib/pronostico/useAvisosClima'
import { proveedor } from '../lib/pronostico/proveedor'
import { actualizadoHace, postits, suprimirHeladaEstadistica } from '../lib/pronostico/derivar'
import type { DiaPronostico } from '../lib/pronostico/tipos'
import { useEstadoTareas, completar, posponer } from '../lib/tareas/estado'
import { derivarTareas, paraSembrarAhora, tareasVisibles, type Tarea } from '../lib/tareas/engine'
import { distinguir, dondeCreceDe, lineaDe } from '../lib/tareas/agrupar'
import { hoyISO } from '../lib/huerta/tipos'
import { sumarDias } from '../lib/huerta/estimar'
import { NOMBRES_MES, mayus, mesDe, nombreDia, numeroDia } from '../lib/fechas'
import { CIELOS, IconoDesplegar, IconoMas } from '../icons'
import { DibujoCantero } from '../dibujos'
import './Hoy.css'

const RENGLON = 28
/** lo que dura el tilde a la vista antes de que la tarea se vaya */
const TILDE_MS = 700

/** Lleva el foco a la fila de al lado: la que se tildó o se pospuso está por irse. */
function correrFoco(li: Element) {
  const de = (el: Element | null) => el?.querySelector<HTMLElement>('.casilla, .tarea__abrir')
  const destino =
    de(li.nextElementSibling) ?? de(li.previousElementSibling) ?? li.closest('section')?.querySelector<HTMLElement>('h2')
  destino?.focus()
}

/** Sin día ni mínima, el título alcanza para avisar: el resto, si se pide. */
function HeladaEstadistica({ tarea }: { tarea: Tarea }) {
  const [abierta, setAbierta] = useState(false)
  const panel = useId()
  return (
    <div className="postit postit--plegado">
      <button
        type="button"
        className="postit__abrir"
        aria-expanded={abierta}
        aria-controls={panel}
        onClick={() => setAbierta((v) => !v)}
      >
        <span className="postit__titulo mano">{tarea.titulo}</span>
        <IconoDesplegar size={18} className={`galon ${abierta ? 'es-abierto' : ''}`} />
      </button>
      <p id={panel} className="postit__texto" hidden={!abierta}>
        {tarea.detalle} Sale de la {tarea.fuente}.
      </p>
    </div>
  )
}

export function Hoy() {
  const { indice, cargando } = useEspecies()
  const zona = useZona()
  const { plantas, ubicaciones, composteras, cargado, errorCarga } = useHuerta()
  const guia = useCompostaje()
  const estadoTareas = useEstadoTareas()
  const hoy = new Date()
  const iso = hoyISO(hoy)

  const [abrirAlta, setAbrirAlta] = useState<string | undefined>()
  const [diaAbierto, setDiaAbierto] = useState<DiaPronostico | null>(null)
  const [marcadas, setMarcadas] = useState<ReadonlySet<string>>(new Set())
  const [leyendo, setLeyendo] = useState(iso)

  const tareas = useMemo(() => {
    if (!indice) return []
    const clima = indice.db.meta.enriquecido.clima[zona]
    return tareasVisibles(
      derivarTareas({
        plantas,
        porSlug: indice.porSlug,
        clima,
        composteras,
        guia,
        hoy: iso,
        hasta: sumarDias(iso, 6),
      }),
      estadoTareas,
      iso,
    )
  }, [indice, plantas, composteras, guia, zona, iso, estadoTareas])

  const sugerencias = useMemo(
    () => (indice ? paraSembrarAhora(indice.todas, zona, iso) : []),
    [indice, zona, iso],
  )

  const ahoraISO = hoy.toISOString()
  const { estado: estadoPron, pron, fresc, dias, avisos } = useAvisosClima(plantas, indice?.porSlug, iso, ahoraISO)

  // la helada de la estadística no es algo para tildar: va al post-it plegado
  const tareasMostradas = useMemo(() => tareas.filter((t) => t.tipo !== 'helada'), [tareas])

  const semana = useMemo<DiaSemana[]>(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const fecha = sumarDias(iso, i)
        return {
          fecha,
          pron: dias.find((d) => d.fecha === fecha) ?? null,
          avisos: avisos.filter((a) => a.fecha === fecha),
          tareas: tareasMostradas.filter((t) => t.fecha === fecha),
        }
      }),
    [iso, dias, avisos, tareasMostradas],
  )

  const dondeCrece = useMemo(
    () => dondeCreceDe(plantas, ubicaciones, (slug) => indice?.porSlug.get(slug)?.nombre_comun),
    [plantas, ubicaciones, indice],
  )
  const porTarea = useMemo(() => distinguir(tareasMostradas, dondeCrece, iso), [tareasMostradas, dondeCrece, iso])

  const plantaDe = (t: Tarea) =>
    t.tipo === 'revisar_germinacion' ? plantas.find((p) => p.id === t.plantaId) : undefined

  // «Asomó» y el giro no pasan por `completadas`: el dato vive en la planta o
  // en la compostera, y de ahí se deriva que la tarea ya no toca.
  function escribir(t: Tarea): Promise<unknown> {
    const p = plantaDe(t)
    if (p) return marcarGerminada(p)
    const c = t.tipo === 'girar_compost' ? composteras.find((x) => x.id === t.composteraId) : undefined
    return c ? marcarGirada(c) : completar(t.id)
  }

  // ref y no el estado: dos toques seguidos llegan antes del render
  const enCurso = useRef(new Set<string>())
  const acciones: AccionesTarea = {
    dondeDe: (t) => porTarea.get(t.id)?.texto ?? (t.plantaId ? dondeCrece.get(t.plantaId)?.lugar : undefined),
    lineaDe: (t) => lineaDe(t, porTarea.get(t.id)),
    conAsomo: (t) => !!plantaDe(t),
    marcadas,
    onMarcar: (t, casilla) => {
      if (enCurso.current.has(t.id)) return
      enCurso.current.add(t.id)
      setMarcadas((m) => new Set(m).add(t.id))
      const li = casilla.closest('li')
      setTimeout(() => {
        if (li?.contains(document.activeElement)) correrFoco(li)
        sinRomper(
          escribir(t).finally(() => {
            enCurso.current.delete(t.id)
            setMarcadas((m) => {
              const sin = new Set(m)
              sin.delete(t.id)
              return sin
            })
          }),
        )
      }, TILDE_MS)
    },
    onPosponer: (t, boton) => {
      const li = boton.closest('li')
      if (li) correrFoco(li)
      sinRomper(posponer(t.id))
    },
  }

  const listo = cargado && !cargando
  const hayHuerta = plantas.length > 0 || composteras.length > 0
  // sin huerta, el pronóstico igual sirve: la semana se muestra si hay cielo
  const conSemana = listo && (hayHuerta || dias.length > 0)
  // del pronóstico y no de la semana: sin poder leer la huerta, la helada se avisa igual.
  // Pero recién cuando se sabe: antes salía como nota muda y al rato pasaba a botón
  const notas = listo || errorCarga ? postits(avisos, iso) : []
  // espera a saber si el pronóstico avisa helada: si no, salía y al rato se iba
  const pronSabido = estadoPron.cargado && !(estadoPron.actualizando && !pron)
  const heladaEst =
    listo && pronSabido ? suprimirHeladaEstadistica(tareas, avisos).find((t) => t.tipo === 'helada') : undefined
  const hoyPron = dias[0]?.fecha === iso ? dias[0] : undefined
  const cieloHoy = hoyPron && CIELOS[hoyPron.cielo]

  /* ---- la tira sigue al día que se lee; un toque la adelanta ---- */
  const tiraRef = useRef<HTMLElement>(null)
  const diasRef = useRef<HTMLDivElement>(null)
  const notaRef = useRef<HTMLElement>(null)
  const restoRef = useRef<HTMLDivElement>(null)
  const siguiendo = useRef(true)
  const soltarId = useRef(0)

  const seguir = useCallback(() => {
    const tira = tiraRef.current
    if (!tira || !diasRef.current) return
    const linea = tira.getBoundingClientRect().bottom + 12
    let leido = iso
    for (const s of diasRef.current.querySelectorAll<HTMLElement>('[data-dia]')) {
      if (s.getBoundingClientRect().top <= linea) leido = s.dataset.dia!
    }
    setLeyendo(leido)
  }, [iso])

  const soltar = useCallback(() => {
    siguiendo.current = true
    seguir()
  }, [seguir])

  function irAlDia(fecha: string) {
    setLeyendo(fecha)
    // mientras dura el scroll suave, el seguimiento no le discute el día
    siguiendo.current = false
    clearTimeout(soltarId.current)
    soltarId.current = window.setTimeout(soltar, 900)
    const suave = !matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(`dia-${fecha}`)?.scrollIntoView({ behavior: suave ? 'smooth' : 'auto', block: 'start' })
    document.getElementById(`titulo-${fecha}`)?.focus({ preventScroll: true })
  }

  useEffect(() => {
    let cuadro = 0
    const alScroll = () => {
      if (!siguiendo.current || cuadro) return
      cuadro = requestAnimationFrame(() => {
        cuadro = 0
        seguir()
      })
    }
    const alTerminar = () => {
      if (siguiendo.current) return
      clearTimeout(soltarId.current)
      soltar()
    }
    addEventListener('scroll', alScroll, { passive: true })
    addEventListener('scrollend', alTerminar)
    return () => {
      removeEventListener('scroll', alScroll)
      removeEventListener('scrollend', alTerminar)
      cancelAnimationFrame(cuadro)
      clearTimeout(soltarId.current)
    }
  }, [seguir, soltar])

  // La tira pegada tapa el principio de cada día: el scroll para debajo de
  // ella, y la hoja sigue con renglones hasta que el último día también llegue arriba.
  useLayoutEffect(() => {
    const raiz = document.documentElement
    const tira = tiraRef.current
    const lista = diasRef.current
    const resto = restoRef.current
    if (!tira || !lista || !resto) return
    raiz.style.scrollPaddingBottom = 'var(--tab-ocupa)'
    const medir = () => {
      const alto = tira.offsetHeight
      raiz.style.scrollPaddingTop = `${alto + 4}px`
      // la nota corta la trama: su alto se lleva a un múltiplo del renglón
      const nota = notaRef.current
      if (nota) {
        nota.style.marginBottom = ''
        const m = getComputedStyle(nota)
        const abajo = parseFloat(m.marginBottom)
        const ocupa = nota.offsetHeight + parseFloat(m.marginTop) + abajo
        nota.style.marginBottom = `${abajo + ((RENGLON - (ocupa % RENGLON)) % RENGLON)}px`
      }
      // contra el fondo del contenido y no scrollHeight: con poco, manda el min-height de la pantalla
      const ultimo = [...lista.querySelectorAll('[data-dia]')].at(-1)
      const pantalla = resto.closest('.pantalla')
      if (ultimo && pantalla) {
        const debajo =
          resto.getBoundingClientRect().bottom -
          ultimo.getBoundingClientRect().top +
          parseFloat(getComputedStyle(pantalla).paddingBottom)
        const falta = innerHeight - alto - 4 - debajo
        resto.style.height = `${Math.max(0, resto.offsetHeight + falta)}px`
      }
      // la app no vuelve el scroll a cero entre pestañas: se llega ya scrolleado y sin evento de scroll
      if (siguiendo.current) seguir()
    }
    medir()
    const obs = new ResizeObserver(medir)
    obs.observe(tira)
    obs.observe(lista)
    addEventListener('resize', medir)
    return () => {
      obs.disconnect()
      removeEventListener('resize', medir)
      raiz.style.scrollPaddingTop = ''
      raiz.style.scrollPaddingBottom = ''
    }
  }, [conSemana, seguir])

  const leido = semana.some((d) => d.fecha === leyendo) ? leyendo : iso

  return (
    <div className="pantalla hoy">
      <header className="hoy-cab">
        <div>
          <h1 className="hoy-cab__fecha mano">
            <span className="hoy-cab__dia">
              {mayus(nombreDia(iso))} {numeroDia(iso)}
            </span>{' '}
            <span className="hoy-cab__mes">de {NOMBRES_MES[mesDe(hoy) - 1]}</span>
          </h1>
          {hoyPron && cieloHoy ? (
            <button type="button" className="clima" onClick={() => setDiaAbierto(hoyPron)}>
              <span style={{ color: cieloHoy.color }} aria-hidden>
                <cieloHoy.Icono size={20} />
              </span>
              {Math.round(hoyPron.max)}° · {Math.round(hoyPron.min)}° · {cieloHoy.nombre}
              <span className="sr-solo">. Ver el detalle de hoy</span>
            </button>
          ) : (
            estadoPron.ubicacion && (
              <p className="clima">
                {!estadoPron.cargado || estadoPron.actualizando
                  ? 'Buscando el pronóstico…'
                  : 'Sin internet no llega el pronóstico. Apenas te conectes, aparece solo.'}
              </p>
            )
          )}
        </div>
        <div className="hoy-cab__lado">
          <Accesos />
          {(notas.length > 0 || heladaEst) && (
            <div className="pila">
              {heladaEst && <HeladaEstadistica tarea={heladaEst} />}
              {/* lleva a su día y se queda: es el resumen, el aviso entero está abajo */}
              {notas.map((n) => {
                const nota = (
                  <>
                    <span className="postit__titulo mano">{n.titulo}</span>
                    <span className="postit__texto">{n.texto}</span>
                  </>
                )
                // sin la semana no hay día adonde llevar: queda la nota sola
                return conSemana ? (
                  <button key={n.tipo} type="button" className="postit" onClick={() => irAlDia(n.fecha)}>
                    {nota}
                    <span className="sr-solo">. {n.fecha === iso ? 'Ir a hoy' : `Ir al ${nombreDia(n.fecha)}`}</span>
                  </button>
                ) : (
                  <div key={n.tipo} className="postit">
                    {nota}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </header>

      {(errorCarga || (listo && !hayHuerta)) && (
        <div className="pantalla__cuerpo">
          {errorCarga && <NoSePudoLeer error={errorCarga} />}
          {listo && !hayHuerta && (
            <EmptyState
              Dibujo={DibujoCantero}
              titulo="Tu huerta está por empezar"
              texto="Cuando cargues lo que plantaste, acá te voy a decir qué toca cada día y por qué."
            />
          )}
        </div>
      )}

      {conSemana && <TiraSemana semana={semana} hoy={iso} leyendo={leido} onElegir={irAlDia} tiraRef={tiraRef} />}

      <div className="pagina pagina--hoy">
        <div ref={diasRef}>
          {conSemana && <PaginaDia dia={semana[0]} hoy={iso} acciones={acciones} onAbrirCielo={setDiaAbierto} />}

          {sugerencias.length > 0 && (
            <aside className="nota-margen" aria-labelledby="titulo-sembrar" ref={notaRef}>
              <h2 className="nota-margen__titulo mano" id="titulo-sembrar">
                Para sembrar ahora
              </h2>
              <ul className="sembrar">
                {sugerencias.slice(0, 4).map((s) => (
                  <li key={s.especie.slug}>
                    <Link to={`/explorar/${s.especie.slug}`} className="sembrar__link">
                      <span className="sembrar__nombre">{s.especie.nombre_comun}</span>
                      <span className="sembrar__meta">
                        {s.seCierra ? (
                          <b>{s.decadasRestantes === 1 ? 'última semana' : 'se cierra pronto'}</b>
                        ) : (
                          `quedan ${s.decadasRestantes * 10} días`
                        )}
                        {s.enAlmacigo && ' · en almácigo'}
                      </span>
                    </Link>
                    <button
                      type="button"
                      className="mas"
                      onClick={() => setAbrirAlta(s.especie.slug)}
                      aria-label={`Sumar ${s.especie.nombre_comun} a mi huerta`}
                    >
                      <IconoMas size={22} />
                    </button>
                  </li>
                ))}
              </ul>
              <Link to="/explorar" state={{ soloAhora: true }} className="ver-todas">
                Ver todas en Explorar
              </Link>
            </aside>
          )}

          {conSemana &&
            semana
              .slice(1)
              .map((d) => (
                <PaginaDia key={d.fecha} dia={d} hoy={iso} acciones={acciones} onAbrirCielo={setDiaAbierto} />
              ))}

          {conSemana && dias.length > 0 && pron && estadoPron.ubicacion && (
            <p className="hoy__pie">
              {fresc === 'viejo' && 'No pude actualizar: los días que quedan sirven igual de guía. '}
              {proveedor.nombre} · {actualizadoHace(pron.obtenido, ahoraISO)} · para {estadoPron.ubicacion.etiqueta}
            </p>
          )}
        </div>
        <div ref={restoRef} aria-hidden />
      </div>

      <HojaDia dia={diaAbierto} onCerrar={() => setDiaAbierto(null)} />

      <AltaPlanta abierto={!!abrirAlta} slug={abrirAlta} onCerrar={() => setAbrirAlta(undefined)} />
    </div>
  )
}

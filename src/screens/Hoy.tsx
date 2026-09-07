import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Header } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { BottomSheet } from '../components/BottomSheet'
import { NoSePudoLeer } from '../components/AvisoDatos'
import { AltaPlanta } from '../components/AltaPlanta'
import { CarrilSemana } from '../components/CarrilSemana'
import { HojaDia } from '../components/HojaDia'
import { useEspecies } from '../lib/useEspecies'
import { useZona } from '../lib/zona'
import { useHuerta, marcarGerminada } from '../lib/huerta/store'
import { usePronostico } from '../lib/pronostico/store'
import { proveedor } from '../lib/pronostico/proveedor'
import {
  actualizadoHace,
  derivarAvisos,
  frescura,
  recortarPasados,
  suprimirHeladaEstadistica,
} from '../lib/pronostico/derivar'
import type { DiaPronostico } from '../lib/pronostico/tipos'
import { useEstadoTareas, completar, posponer } from '../lib/tareas/estado'
import { derivarTareas, paraSembrarAhora, tareasVisibles, type Tarea, expuestasAHelada } from '../lib/tareas/engine'
import { hoyISO } from '../lib/huerta/tipos'
import { sumarDias } from '../lib/huerta/estimar'
import { nombreDecada, decadaDe, saludoEstacional } from '../lib/fechas'
import { IconoEscarcha, IconoGrupo, IconoHoy, IconoProtegido } from '../icons'
import './Hoy.css'

/** el carril: hoy y seis días más */
const DIAS_CARRIL = 6

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
  const [diaAbierto, setDiaAbierto] = useState<DiaPronostico | null>(null)
  const [menuDe, setMenuDe] = useState<Tarea | null>(null)

  const tareas = useMemo(() => {
    if (!indice) return []
    const clima = indice.db.meta.enriquecido.clima[zona]
    return tareasVisibles(
      derivarTareas({ plantas, porSlug: indice.porSlug, clima, hoy: iso, hasta: sumarDias(iso, DIAS_CARRIL) }),
      estadoTareas,
      iso,
    )
  }, [indice, plantas, zona, iso, estadoTareas])

  const sugerencias = useMemo(
    () => (indice ? paraSembrarAhora(indice.todas, zona, iso) : []),
    [indice, zona, iso],
  )

  const estadoPron = usePronostico()
  const ahoraISO = hoy.toISOString()
  const pron = estadoPron.pronostico
  const fresc = pron ? frescura(pron, ahoraISO) : null
  // sin ubicación o vencido, el carril sigue: solo pierde el cielo
  const dias = useMemo(
    () => (estadoPron.ubicacion && pron && fresc !== 'vencido' ? recortarPasados(pron, iso) : []),
    [estadoPron.ubicacion, pron, fresc, iso],
  )

  const avisos = useMemo(() => {
    if (!pron || dias.length === 0) return []
    const nombres = indice
      ? expuestasAHelada(plantas, indice.porSlug)
          .map((pl) => (pl.apodo || indice.porSlug.get(pl.slug)!.nombre_comun).toLowerCase())
          .slice(0, 3)
      : []
    return derivarAvisos(pron, iso, nombres)
  }, [pron, dias, indice, plantas, iso])

  // con alerta de helada del pronóstico, la tarea estadística se corre sola
  const tareasMostradas = useMemo(() => suprimirHeladaEstadistica(tareas, avisos), [tareas, avisos])
  const helada = avisos.find((a) => a.tipo === 'helada')

  const plantaDe = (t: Tarea) =>
    t.tipo === 'revisar_germinacion' ? plantas.find((p) => p.id === t.plantaId) : undefined

  async function alCompletar(t: Tarea) {
    setFestejando(t.id)
    setTimeout(() => setFestejando(null), 700)
    await completar(t.id)
  }

  // "Asomó" no toca `completadas`: setear `germino` ya apaga el aviso en la
  // derivación, y esa verdad tiene que vivir en un solo lugar.
  async function alAsomar(t: Tarea) {
    const p = plantaDe(t)
    if (!p) return
    setFestejando(t.id)
    setTimeout(() => setFestejando(null), 700)
    await marcarGerminada(p) // con la fecha de hoy; "ayer/otro día" queda en la ficha
  }

  const listo = cargado && !cargando

  return (
    <div className="pantalla">
      <Header titulo="La semana" sobretitulo={saludoEstacional(hoy)} />

      <div className="pantalla__cuerpo">
        {errorCarga && <NoSePudoLeer error={errorCarga} />}

        {listo && plantas.length === 0 && (
          <EmptyState
            Icono={IconoHoy}
            titulo="Tu huerta está por empezar"
            texto="Cuando cargues lo que plantaste, acá te voy a decir qué toca cada día y por qué."
          />
        )}

        {helada && (
          <div className="hoy__destacado" role="note">
            <span className="hoy__destacado-icono" aria-hidden>
              <IconoEscarcha size={22} />
            </span>
            <div>
              <p className="hoy__destacado-titulo">{helada.titulo}</p>
              <p className="hoy__destacado-detalle">{helada.detalle}</p>
              <p className="hoy__destacado-fuente">{helada.fuente}</p>
            </div>
          </div>
        )}

        {listo && plantas.length > 0 && (
          <section className="hoy__seccion">
            <CarrilSemana
              hoy={iso}
              pronostico={dias}
              tareas={tareasMostradas}
              avisos={avisos}
              festejando={festejando}
              conAsomo={(t) => !!plantaDe(t)}
              onCompletar={(t) => void alCompletar(t)}
              onAsomo={(t) => void alAsomar(t)}
              onMenu={setMenuDe}
              onAbrirDia={setDiaAbierto}
            />
            {estadoPron.ubicacion && (
              <p className="carril__pie">
                {dias.length === 0
                  ? !estadoPron.cargado || estadoPron.actualizando
                    ? 'Buscando el pronóstico…'
                    : 'Sin internet no llega el pronóstico. Apenas te conectes, aparece solo.'
                  : `${fresc === 'viejo' ? 'No pude actualizar: los días que quedan sirven igual de guía. ' : ''}${proveedor.nombre} · ${actualizadoHace(pron!.obtenido, ahoraISO)} · para ${estadoPron.ubicacion.etiqueta}`}
              </p>
            )}
          </section>
        )}

        {sugerencias.length > 0 && (
          <section className="hoy__seccion">
            <h2 className="seccion__titulo">Para sembrar ahora</h2>
            <p className="hoy__bajada">
              En {nombreDecada(decadaHoy)}, ordenado por lo que primero se te cierra.
            </p>
            <ul className="sembrar">
              {sugerencias.map((s) => (
                <li key={s.especie.slug} className="sembrar__fila">
                  <Link to={`/explorar/${s.especie.slug}`} className="sembrar__link">
                    <span className="sembrar__icono">
                      <IconoGrupo grupo={s.especie.grupo} size={20} decorativo />
                    </span>
                    <span className="sembrar__textos">
                      <span className="sembrar__nombre">{s.especie.nombre_comun}</span>
                      <span>
                        <span className={`sembrar__ventana ${s.seCierra ? 'es-cierra' : ''}`}>
                          {s.seCierra
                            ? s.decadasRestantes === 1
                              ? 'última semana'
                              : 'se cierra pronto'
                            : `quedan ${s.decadasRestantes * 10} días`}
                        </span>
                        {s.enAlmacigo && (
                          <span className="sembrar__metodo">
                            <IconoProtegido size={12} /> en almácigo
                          </span>
                        )}
                      </span>
                    </span>
                  </Link>
                  <button
                    type="button"
                    className="sembrar__sumar"
                    onClick={() => setAbrirAlta(s.especie.slug)}
                    aria-label={`Sumar ${s.especie.nombre_comun} a mi huerta`}
                  >
                    <span className="carril__pildora">Sumar</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <HojaDia dia={diaAbierto} onCerrar={() => setDiaAbierto(null)} />

      {/* «Más tarde» vive acá y no en la fila: dos botones no entran en 340
          px. Posponer no se elimina: es la válvula de escape de una app que
          manda. */}
      <BottomSheet abierto={!!menuDe} onCerrar={() => setMenuDe(null)} titulo={menuDe?.titulo ?? ''}>
        {menuDe && (
          <button
            type="button"
            className="hoja__opcion"
            onClick={() => {
              void posponer(menuDe.id)
              setMenuDe(null)
            }}
          >
            {plantaDe(menuDe) ? 'Todavía no asomó' : 'Más tarde'}
            <small>Se esconde tres días y después vuelve sola.</small>
          </button>
        )}
      </BottomSheet>

      <AltaPlanta
        abierto={!!abrirAlta}
        slug={abrirAlta}
        onCerrar={() => setAbrirAlta(undefined)}
      />
    </div>
  )
}

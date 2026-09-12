import { useMemo, useState } from 'react'
import { Header } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { EspecieCard } from '../components/EspecieCard'
import { ChipHoja } from '../components/ChipHoja'
import { FiltroTemperatura } from '../components/FiltroTemperatura'
import { useEspecies } from '../lib/useEspecies'
import { normalizar } from '../lib/data/slugs'
import { estadoSiembra } from '../lib/data/especies'
import {
  criteriosActivos,
  dominios,
  hayTemperatura,
  pasaTemperatura,
  resumenTemperatura,
  SIN_TEMPERATURA,
  sinDatoPara,
  textoSinDato,
  type SeleccionTemp,
} from '../lib/filtroTemperatura'
import { useZona, ZONAS_INFO } from '../lib/zona'
import { decadaDe, nombreDecada } from '../lib/fechas'
import { GRUPOS, LUCES, SUELOS, IconoExplorar } from '../icons'
import type { CategoriaLuz, CategoriaSuelo, Grupo } from '../lib/data/types'
import './Explorar.css'
import { DibujoZaranda } from '../dibujos'

type FiltroGrupo = Grupo | null
type FiltroSuelo = CategoriaSuelo | null
type FiltroLuz = CategoriaLuz | null

/** «Pleno sol: 6 o más horas…» en la línea del contador es solo «pleno sol». */
const corto = (etiqueta: string) => etiqueta.split(':')[0].toLowerCase()

export function Explorar() {
  const { indice, cargando } = useEspecies()
  const zona = useZona()
  const hoy = new Date()
  const decadaHoy = decadaDe(hoy)

  const [busqueda, setBusqueda] = useState('')
  const [soloAhora, setSoloAhora] = useState(false)
  const [grupo, setGrupo] = useState<FiltroGrupo>(null)
  const [suelo, setSuelo] = useState<FiltroSuelo>(null)
  const [luz, setLuz] = useState<FiltroLuz>(null)
  const [temp, setTemp] = useState<SeleccionTemp>(SIN_TEMPERATURA)

  function limpiar() {
    setBusqueda('')
    setSoloAhora(false)
    setGrupo(null)
    setSuelo(null)
    setLuz(null)
    setTemp(SIN_TEMPERATURA)
  }

  // Los rieles salen del catálogo: si mañana entra una especie más friolenta,
  // la escala la acompaña sola.
  const dominiosTemp = useMemo(() => (indice ? dominios(indice.padres) : null), [indice])

  const resultados = useMemo(() => {
    if (!indice) return []
    const texto = normalizar(busqueda.trim())
    // Sin búsqueda se ven las especies del catálogo; escribiendo aparecen
    // también las variedades, que es cuando el nombre puntual importa.
    return (texto ? indice.todas : indice.padres).filter((e) => {
      if (texto && !indice.textoBusqueda.get(e.slug)!.includes(texto)) return false
      if (soloAhora && !estadoSiembra(e, decadaHoy, zona)) return false
      if (grupo && e.grupo !== grupo) return false
      if (suelo && e.suelo.categoria_suelo !== suelo) return false
      if (luz && e.luz.categoria_luz !== luz) return false
      // sin las dos puntas la especie no se evalúa y queda afuera; se la nombra abajo
      if (!pasaTemperatura(e, temp)) return false
      return true
    })
  }, [indice, busqueda, soloAhora, grupo, suelo, luz, temp, decadaHoy, zona])

  const hayFiltros = soloAhora || grupo || luz || suelo || hayTemperatura(temp) || busqueda.trim()

  /** Lo elegido, para leerlo sin abrir cada hoja: los chips ya no lo dicen. */
  const elegido = [
    soloAhora ? 'se siembra ahora' : null,
    grupo ? corto(GRUPOS[grupo].etiqueta) : null,
    suelo ? corto(SUELOS[suelo].etiqueta) : null,
    luz ? corto(LUCES[luz].etiqueta) : null,
    ...resumenTemperatura(temp),
  ].filter(Boolean)

  // A quiénes deja afuera el filtro de temperatura por falta de dato: se dice
  // con nombre, que desaparecer en silencio parece no existir en el catálogo.
  const sinDatoTemp = useMemo(
    () =>
      indice ? textoSinDato(sinDatoPara(indice.padres, temp), criteriosActivos(temp).length) : null,
    [indice, temp],
  )

  return (
    <div className="pantalla">
      <Header titulo="Explorar" sobretitulo={`${nombreDecada(decadaHoy)} · ${ZONAS_INFO[zona].etiqueta}`} />

      <div className="explorar__controles">
        <div className="buscador">
          <IconoExplorar size={19} />
          <input
            type="search"
            className="buscador__input"
            placeholder="Buscar especie…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar especie por nombre"
          />
        </div>

        {/* Los cinco filtros en una fila: etiquetas cortas y fijas, para que
            elegir no corra el que está al lado. */}
        <div className="filtros-linea">
          <button
            type="button"
            className={`chip-hoja ${soloAhora ? 'es-activo' : ''}`}
            onClick={() => setSoloAhora((v) => !v)}
            aria-pressed={soloAhora}
            aria-label="Se siembra ahora"
          >
            <span className="chip-hoja__pildora">Ahora</span>
          </button>
          <ChipHoja
            etiqueta="Grupo"
            opciones={Object.entries(GRUPOS).map(([k, v]) => ({ valor: k, ...v }))}
            activo={grupo}
            onElegir={(v) => setGrupo(v as FiltroGrupo)}
          />
          <ChipHoja
            etiqueta="Suelo"
            opciones={Object.entries(SUELOS).map(([k, v]) => ({ valor: k, ...v }))}
            activo={suelo}
            onElegir={(v) => setSuelo(v as FiltroSuelo)}
          />
          <ChipHoja
            etiqueta="Luz"
            opciones={Object.entries(LUCES).map(([k, v]) => ({ valor: k, ...v }))}
            activo={luz}
            onElegir={(v) => setLuz(v as FiltroLuz)}
          />
          {dominiosTemp && (
            <FiltroTemperatura
              seleccion={temp}
              onCambiar={setTemp}
              dominios={dominiosTemp}
              cantidad={resultados.length}
            />
          )}
        </div>

        <div className="explorar__resumen">
          <p className="explorar__cuenta" aria-live="polite">
            {cargando ? (
              'Cargando el catálogo…'
            ) : (
              <>
                {resultados.length} de {indice!.padres.length} especies
                {elegido.length > 0 && <span className="explorar__elegido"> · {elegido.join(' · ')}</span>}
              </>
            )}
          </p>
          {hayFiltros && (
            <button type="button" className="explorar__limpiar" onClick={limpiar}>
              Limpiar
            </button>
          )}
        </div>

        {sinDatoTemp && <p className="explorar__sindato">{sinDatoTemp}</p>}
      </div>

      <div className="pantalla__cuerpo">
        {!cargando && resultados.length === 0 && (
          <EmptyState
            Dibujo={DibujoZaranda}
            titulo="No encontramos nada"
            texto={
              hayFiltros
                ? 'Probá aflojando algún filtro o buscando por otro nombre.'
                : 'Algo raro pasó con el catálogo.'
            }
          />
        )}
        <div className="explorar__grilla">
          {resultados.map((e, i) => (
            <div
              key={e.slug}
              className="aparecer"
              style={{ '--retraso': `${Math.min(i, 8) * 0.03}s` } as React.CSSProperties}
            >
              <EspecieCard especie={e} decadaActual={decadaHoy} zona={zona} hoy={hoy} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

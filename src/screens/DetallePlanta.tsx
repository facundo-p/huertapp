import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Header } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { BottomSheet } from '../components/BottomSheet'
import { CycleProgress } from '../components/CycleProgress'
import { FotoDeDiario } from '../components/FotoDeDiario'
import { BloqueGerminacion } from '../components/BloqueGerminacion'
import { useEspecies } from '../lib/useEspecies'
import { useZona } from '../lib/zona'
import { useHuerta, agregarEntrada, borrarPlanta, cambiarEtapa, sinRomper } from '../lib/huerta/store'
import * as db from '../lib/huerta/db'
import { prepararFoto, FotoInvalida } from '../lib/huerta/fotos'
import {
  ETAPA_INFO,
  TIPOS_ENTRADA,
  desdeISO,
  hoyISO,
  type EntradaDiario,
  type TipoEntrada,
} from '../lib/huerta/tipos'
import { estimar, siguienteEtapa, textoHito } from '../lib/huerta/estimar'
import { METODOS } from '../lib/calendario'
import { IconoFoto, IconoHuerta, IconoNota, IconoReloj, IconoSembrar } from '../icons'
import './DetallePlanta.css'

/** El ciclo arranca cuando la semilla asoma, no cuando la enterrás. */
function textoCorrimiento(dias: number): string {
  const n = Math.abs(dias)
  const cuantos = `${n} ${n === 1 ? 'día' : 'días'}`
  return dias > 0
    ? `Corrido ${cuantos}: asomó más tarde de lo que decía la ficha y el ciclo se cuenta desde que asoma.`
    : `Adelantado ${cuantos}: asomó antes de lo que decía la ficha.`
}

export function DetallePlanta() {
  const { id } = useParams()
  const navegar = useNavigate()
  const { indice } = useEspecies()
  const zona = useZona()
  const { plantas, ubicaciones, cargado } = useHuerta()

  const [entradas, setEntradas] = useState<EntradaDiario[] | null>(null)
  const [abrirDiario, setAbrirDiario] = useState(false)

  const planta = plantas.find((p) => p.id === id)

  const recargarDiario = useCallback(async () => {
    if (!id) return
    const lista = await db.listarDiario(id)
    setEntradas(lista.sort((a, b) => b.fecha.localeCompare(a.fecha) || b.creada.localeCompare(a.creada)))
  }, [id])

  useEffect(() => {
    void recargarDiario()
  }, [recargarDiario])

  if (!cargado) {
    return (
      <div className="pantalla pantalla--detalle">
        <Header titulo="Cargando…" volver />
      </div>
    )
  }

  if (!planta) {
    return (
      <div className="pantalla pantalla--detalle">
        <Header titulo="No encontramos esa planta" volver />
        <div className="pantalla__cuerpo">
          <EmptyState
            Icono={IconoHuerta}
            titulo="Acá no hay nada plantado"
            texto="Puede que la hayas borrado. Volvé a Mi huerta y fijate."
          />
        </div>
      </div>
    )
  }

  const especie = indice?.porSlug.get(planta.slug)
  const clima = indice?.db.meta.enriquecido.clima[zona]
  const ubicacion = ubicaciones.find((u) => u.id === planta.ubicacionId)
  const est = especie ? estimar(planta, especie) : null
  const sigue = siguienteEtapa(planta)
  const directa = planta.metodo === 'directa' || planta.metodo === 'plantacion'

  async function borrar() {
    if (!planta) return
    const nombre = planta.apodo || especie?.nombre_comun || 'esta planta'
    if (!confirm(`¿Borrar ${nombre} y todo su diario? No se puede deshacer.`)) return
    await borrarPlanta(planta.id)
    // solo se navega si de verdad se borró: si falló, el aviso queda a la vista
    navegar('/huerta', { replace: true })
  }

  return (
    <div className="pantalla pantalla--detalle">
      <Header
        titulo={planta.apodo || especie?.nombre_comun || 'Planta'}
        sobretitulo={planta.apodo ? especie?.nombre_comun : especie?.nombre_cientifico}
        volver
      />

      <div className="pantalla__cuerpo">
        <div className="planta__resumen etiqueta">
          <CycleProgress etapa={planta.etapa} directa={directa} />

          {especie && clima && (
            <BloqueGerminacion planta={planta} especie={especie} clima={clima} />
          )}

          {sigue && (
            <button className="planta__avanzar" onClick={() => sinRomper(cambiarEtapa(planta, sigue))}>
              Marcar como {ETAPA_INFO[sigue].etiqueta.toLowerCase()}
            </button>
          )}

          <dl className="planta__datos">
            <Dato titulo="Sembrada" valor={fechaCorta(planta.sembrada)} />
            {planta.metodo && <Dato titulo="Cómo" valor={METODOS[planta.metodo]} />}
            {ubicacion && <Dato titulo="Dónde" valor={ubicacion.nombre} />}
            {est && (
              <Dato
                titulo="Lleva"
                valor={est.diasDesdeSiembra === 1 ? '1 día' : `${est.diasDesdeSiembra} días`}
              />
            )}
          </dl>

          {est?.proximo && (
            <p className={`planta__hito ${est.proximo.enVentana ? 'es-lista' : ''}`}>
              <IconoReloj size={15} />
              <span>
                <strong>{est.proximo.titulo}</strong> estimado entre el {fechaCorta(est.proximo.desde)} y
                el {fechaCorta(est.proximo.hasta)} — {textoHito(est.proximo)}.
              </span>
            </p>
          )}

          {/* Por qué esa fecha no es la que sale de la ficha: se corrió con TU
              planta, y sin decirlo parece que el catálogo se contradice. */}
          {!!est?.corrimiento && (
            <p className="planta__corrimiento">
              <IconoSembrar size={15} />
              <span>{textoCorrimiento(est.corrimiento)}</span>
            </p>
          )}

          {especie && (
            <Link to={`/explorar/${especie.slug}`} className="planta__ficha-link">
              Ver la ficha de {especie.nombre_comun.toLowerCase()} →
            </Link>
          )}
        </div>

        <div className="diario__cabeza">
          <h2 className="seccion__titulo subrayado-onda">Diario</h2>
          <button className="diario__agregar" onClick={() => setAbrirDiario(true)}>
            ＋ Anotar
          </button>
        </div>

        {entradas?.length === 0 && (
          <p className="diario__vacio">
            Todavía no anotaste nada. Una foto por semana y en dos meses tenés la película.
          </p>
        )}

        <ul className="diario">
          {entradas?.map((e) => (
            <li key={e.id} className={`diario__item es-${e.tipo}`}>
              <div className="diario__meta">
                <span className="diario__tipo" style={{ '--tipo': TIPOS_ENTRADA[e.tipo].color } as React.CSSProperties}>
                  {TIPOS_ENTRADA[e.tipo].etiqueta}
                </span>
                <span className="diario__fecha">{fechaCorta(e.fecha)}</span>
              </div>
              {e.texto && <p className="diario__texto">{e.texto}</p>}
              {e.fotoIds.length > 0 && (
                <div className="diario__fotos">
                  {e.fotoIds.map((f) => (
                    <FotoDeDiario key={f} id={f} />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <button className="planta__borrar" onClick={borrar}>
          Borrar esta planta
        </button>
      </div>

      <NuevaEntrada
        abierto={abrirDiario}
        plantaId={planta.id}
        onCerrar={() => setAbrirDiario(false)}
        onGuardada={recargarDiario}
      />
    </div>
  )
}

/* ---------- hoja de nueva entrada ---------- */

const TIPOS: TipoEntrada[] = ['nota', 'riego', 'plaga', 'cosecha', 'trasplante', 'floracion']

function NuevaEntrada({
  abierto,
  plantaId,
  onCerrar,
  onGuardada,
}: {
  abierto: boolean
  plantaId: string
  onCerrar: () => void
  onGuardada: () => void
}) {
  const [tipo, setTipo] = useState<TipoEntrada>('nota')
  const [texto, setTexto] = useState('')
  const [fecha, setFecha] = useState(hoyISO())
  const [fotos, setFotos] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [ocupado, setOcupado] = useState(false)

  async function sumarFotos(lista: FileList | null) {
    if (!lista?.length) return
    setOcupado(true)
    setError(null)
    try {
      const ids: string[] = []
      for (const archivo of Array.from(lista)) {
        const f = await prepararFoto(archivo)
        await db.guardarFoto(f)
        ids.push(f.id)
      }
      setFotos((f) => [...f, ...ids])
    } catch (e) {
      setError(e instanceof FotoInvalida ? e.message : 'No se pudo procesar la foto.')
    } finally {
      setOcupado(false)
    }
  }

  async function guardar() {
    if (ocupado) return
    if (!texto.trim() && fotos.length === 0) {
      setError('Escribí algo o sumá una foto.')
      return
    }
    await agregarEntrada({ plantaId, fecha, tipo, texto: texto.trim() || undefined, fotoIds: fotos })
    setTipo('nota')
    setTexto('')
    setFecha(hoyISO())
    setFotos([])
    setError(null)
    onCerrar()
    onGuardada()
  }

  return (
    <BottomSheet
      abierto={abierto}
      onCerrar={onCerrar}
      titulo="Anotar en el diario"
      pie={
        <button className="alta__guardar" onClick={() => sinRomper(guardar())} disabled={ocupado}>
          {ocupado ? 'Procesando la foto…' : 'Guardar'}
        </button>
      }
    >
      <div className="alta__campo">
        <span className="alta__label">¿Qué pasó?</span>
        <div className="alta__metodos">
          {TIPOS.map((t) => (
            <button
              key={t}
              className={`alta__metodo ${tipo === t ? 'es-activo' : ''}`}
              onClick={() => setTipo(t)}
              aria-pressed={tipo === t}
            >
              {TIPOS_ENTRADA[t].etiqueta}
            </button>
          ))}
        </div>
      </div>

      <div className="alta__campo">
        <label className="alta__label" htmlFor="diario-texto">
          Contame
        </label>
        <textarea
          id="diario-texto"
          className="alta__input diario__textarea"
          rows={3}
          placeholder="Le salieron las primeras hojas verdaderas…"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
      </div>

      <div className="alta__campo">
        <label className="alta__label" htmlFor="diario-fecha">
          Cuándo
        </label>
        <input
          id="diario-fecha"
          type="date"
          className="alta__input"
          value={fecha}
          max={hoyISO()}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>

      <div className="alta__campo">
        <span className="alta__label">Fotos</span>
        <label className="diario__foto-boton">
          <IconoFoto size={19} />
          Sacar o elegir una foto
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-solo"
            onChange={(e) => {
              void sumarFotos(e.target.files)
              e.target.value = ''
            }}
          />
        </label>
        <p className="alta__ayuda">
          Se guardan achicadas a 1280px en tu aparato: entran muchas más y el backup no se vuelve
          impracticable.
        </p>
        {fotos.length > 0 && (
          <div className="diario__fotos">
            {fotos.map((f) => (
              <FotoDeDiario key={f} id={f} />
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="alta__aviso es-mala">
          <IconoNota size={17} />
          {error}
        </p>
      )}
    </BottomSheet>
  )
}

/* ---------- piezas ---------- */

function Dato({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="planta__dato">
      <dt>{titulo}</dt>
      <dd>{valor}</dd>
    </div>
  )
}

function fechaCorta(iso: string): string {
  return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short' }).format(desdeISO(iso))
}

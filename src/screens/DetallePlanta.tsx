import { useCallback, useEffect, useState, type ComponentType } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Header } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { BottomSheet } from '../components/BottomSheet'
import { FotoDeDiario } from '../components/FotoDeDiario'
import { BloqueGerminacion } from '../components/BloqueGerminacion'
import { Trasplantar } from '../components/Trasplantar'
import { CambiarCantidad } from '../components/CambiarCantidad'
import { useEspecies } from '../lib/useEspecies'
import { useZona } from '../lib/zona'
import {
  useHuerta,
  agregarEntrada,
  borrarPlanta,
  cambiarEtapa,
  elegirHuertaActiva,
  sinRomper,
} from '../lib/huerta/store'
import { huertaDe } from '../lib/huerta/huertas'
import { partesDe, textoCantidad } from '../lib/huerta/tanda'
import * as db from '../lib/huerta/db'
import { prepararFoto, FotoInvalida } from '../lib/huerta/fotos'
import {
  ETAPA_INFO,
  TIPOS_ENTRADA,
  desdeISO,
  diasEntre,
  hoyISO,
  type EntradaDiario,
  type TipoEntrada,
} from '../lib/huerta/tipos'
import { estimar, siguienteEtapa, textoHito } from '../lib/huerta/estimar'
import { germinacion, germinacionPendiente } from '../lib/huerta/germinacion'
import { casillerosDelCiclo, fechaDeMargen, llevaSello, type Casillero } from '../lib/huerta/ciclo'
import { METODOS } from '../lib/calendario'
import {
  IconoCheck,
  IconoFoto,
  IconoNota,
  IconoPlaga,
  IconoRegar,
  IconoReloj,
  IconoSembrar,
  type IconProps,
} from '../icons'
import './DetallePlanta.css'
import { DibujoEtiquetaVacia } from '../dibujos'

const dias = (n: number) => `${n} ${n === 1 ? 'día' : 'días'}`

/**
 * El ciclo arranca cuando la semilla asoma, no cuando la enterrás. Los tres
 * números —lo que decía la ficha, lo que tardó, lo que se corrió— para los
 * dos signos: `corrimiento()` es negativo cuando asomó antes.
 */
function textoCorrimiento(corrido: number, ficha: { min: number; max: number }, tardo: number): string {
  const rango = ficha.min === ficha.max ? dias(ficha.min) : `${ficha.min}–${ficha.max} días`
  return corrido > 0
    ? `La ficha decía ${rango} y asomó a los ${tardo}: el ciclo se corrió ${dias(corrido)}, porque se cuenta desde que asoma.`
    : `La ficha decía ${rango} y asomó a los ${tardo}: el ciclo se adelantó ${dias(-corrido)}.`
}

export function DetallePlanta() {
  const { id } = useParams()
  const navegar = useNavigate()
  const { indice } = useEspecies()
  const zona = useZona()
  const { plantas, ubicaciones, todas, cargado } = useHuerta()

  const [entradas, setEntradas] = useState<EntradaDiario[] | null>(null)
  const [abrirDiario, setAbrirDiario] = useState(false)
  const [abrirTrasplante, setAbrirTrasplante] = useState(false)
  const [abrirCantidad, setAbrirCantidad] = useState(false)

  const planta = plantas.find((p) => p.id === id)
  // de otra huerta (se llega por el historial): se pasa a esa, que si no la
  // zona, los lugares y el trasplante serían los de la que estaba abierta
  const ajena = planta ? undefined : todas.plantas.find((p) => p.id === id)
  useEffect(() => {
    if (ajena) sinRomper(elegirHuertaActiva(huertaDe(ajena)))
  }, [ajena])

  const recargarDiario = useCallback(async () => {
    if (!id) return
    const lista = await db.listarDiario(id)
    setEntradas(lista.sort((a, b) => b.fecha.localeCompare(a.fecha) || b.creada.localeCompare(a.creada)))
  }, [id])

  useEffect(() => {
    void recargarDiario()
  }, [recargarDiario])

  if (!cargado || ajena) {
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
            Dibujo={DibujoEtiquetaVacia}
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
  const germ = especie ? germinacion(planta, especie) : null
  const sigue = siguienteEtapa(planta)
  const nombre = planta.apodo || especie?.nombre_comun || 'Planta'
  const partes = partesDe(plantas, planta)
  const cantidad = textoCantidad(planta)

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
        titulo={nombre}
        // La variedad anotada a mano viaja en el sobretítulo, pegada a la
        // especie: es el dato que después hace útil el historial.
        sobretitulo={[
          planta.apodo ? especie?.nombre_comun : especie?.nombre_cientifico,
          planta.variedad,
        ]
          .filter(Boolean)
          .join(' · ')}
        volver
      />

      <div className="pantalla__cuerpo">
        <section className="pagina-planta-ciclo" aria-labelledby="ciclo-titulo">
          <h2 className="seccion__titulo mano" id="ciclo-titulo">
            El ciclo
          </h2>
          <Casilleros lista={casillerosDelCiclo(planta, especie, hoyISO())} />

          {!germinacionPendiente(germ) && est?.proximo && (
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
          {!!est?.corrimiento && planta.germino && especie?.dias_germinacion && (
            <p className="planta__corrimiento">
              <IconoSembrar size={15} />
              <span>
                {textoCorrimiento(
                  est.corrimiento,
                  especie.dias_germinacion,
                  diasEntre(planta.sembrada, planta.germino),
                )}
              </span>
            </p>
          )}
        </section>

        {especie && clima && <BloqueGerminacion planta={planta} especie={especie} clima={clima} />}

        <dl className="planta__datos">
          {planta.metodo && <Dato titulo="Cómo" valor={METODOS[planta.metodo]} />}
          {cantidad && <Dato titulo="Cuántas" valor={cantidad} />}
          {ubicacion && <Dato titulo="Dónde" valor={ubicacion.nombre} />}
          {est && (
            <Dato
              titulo="Lleva"
              valor={est.diasDesdeSiembra === 1 ? '1 día' : `${est.diasDesdeSiembra} días`}
            />
          )}
        </dl>

        {/* a lápiz: el ocre queda para el «hoy» */}
        <div className="pagina-planta-acciones">
          {planta.etapa === 'almacigo' ? (
            <button type="button" className="lapiz pagina-planta-principal" onClick={() => setAbrirTrasplante(true)}>
              La trasplanté…
            </button>
          ) : (
            sigue && (
              <button
                type="button"
                className="lapiz pagina-planta-principal"
                onClick={() => sinRomper(cambiarEtapa(planta, sigue))}
              >
                Marcar como {ETAPA_INFO[sigue].etiqueta.toLowerCase()}
              </button>
            )
          )}

          {planta.etapa !== 'terminada' && (
            <button type="button" className="lapiz" onClick={() => setAbrirCantidad(true)}>
              {cantidad ? 'Cambiar la cuenta' : 'Anotar cuántas hay'}
            </button>
          )}

          {planta.etapa !== 'almacigo' && planta.etapa !== 'terminada' && (
            <button type="button" className="lapiz" onClick={() => setAbrirTrasplante(true)}>
              Mover o separar una parte…
            </button>
          )}
        </div>

        {partes.length > 0 && (
          <div className="planta__partes">
            <p className="planta__partes-titulo">Esta siembra también está en:</p>
            <ul className="planta__partes-lista">
              {partes.map((p) => {
                const lugar = ubicaciones.find((u) => u.id === p.ubicacionId)?.nombre
                const cant = textoCantidad(p)
                const donde = lugar ? (cant ? `${cant} en ${lugar}` : `En ${lugar}`) : cant ? `${cant} sin lugar asignado` : 'Sin lugar asignado'
                return (
                  <li key={p.id}>
                    <Link to={`/huerta/${p.id}`}>
                      {donde} · {ETAPA_INFO[p.etapa].etiqueta}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {especie && (
          <Link to={`/explorar/${especie.slug}`} className="planta__ficha-link">
            Ver la ficha de {especie.nombre_comun.toLowerCase()} →
          </Link>
        )}

        <section className="pagina pagina-planta-diario" aria-labelledby="diario-titulo">
          <div className="pagina-planta-diario__cab">
            <h2 className="pagina__titulo mano" id="diario-titulo">
              Diario
            </h2>
            {/* arriba y no al pie: lo nuevo va primero, y lo que anotás aparece acá */}
            <button type="button" className="lapiz" onClick={() => setAbrirDiario(true)}>
              <IconoNota size={18} />
              Anotar algo
            </button>
          </div>

          {entradas?.length === 0 && (
            <p className="pagina-planta-diario__vacio">
              Todavía no anotaste nada. Una foto por semana y en dos meses tenés la película.
            </p>
          )}

          <ol className="pagina-planta-entradas">
            {entradas?.map((e) => (
              <li key={e.id} className="pagina-planta-entrada">
                <Fecha iso={e.fecha} className="pagina-planta-entrada__fecha" />
                <div>
                  {(e.texto || MARCA_ENTRADA[e.tipo] || llevaSello(e.tipo)) && (
                    <p className="pagina-planta-entrada__texto">
                      <MarcaDeEntrada tipo={e.tipo} />
                      {e.texto}
                    </p>
                  )}
                  {e.fotoIds.length > 0 && (
                    <div className="pagina-planta-fotos">
                      {e.fotoIds.map((f) => (
                        <span key={f} className="pagina-planta-foto">
                          <FotoDeDiario id={f} />
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

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

      <Trasplantar
        abierto={abrirTrasplante}
        planta={planta}
        nombre={nombre}
        onCerrar={() => setAbrirTrasplante(false)}
        onListo={() => void recargarDiario()}
      />

      <CambiarCantidad
        abierto={abrirCantidad}
        planta={planta}
        nombre={nombre}
        onCerrar={() => setAbrirCantidad(false)}
        onListo={() => void recargarDiario()}
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

function Casilleros({ lista }: { lista: Casillero[] }) {
  return (
    <ol className="pagina-planta-casilleros">
      {lista.map((c) => (
        <li
          key={c.clave}
          className={`pagina-planta-casillero ${c.hecho ? 'es-hecho' : 'es-futuro'} ${c.hoy ? 'es-hoy' : ''}`}
        >
          {c.hoy && (
            <span className="pagina-planta-casillero__hoy" aria-hidden>
              hoy
            </span>
          )}
          {c.hecho && <span className="sr-solo">Hecho: </span>}
          {c.hoy && <span className="sr-solo">Lo que sigue, hoy estás acá: </span>}
          <span className="pagina-planta-casillero__nombre">{c.nombre}</span>
          {c.fecha && <Fecha iso={c.fecha} className="pagina-planta-casillero__fecha" />}
          {c.nota && <span className="pagina-planta-casillero__nota">{c.nota}</span>}
          {c.hecho && <IconoCheck size={16} className="pagina-planta-casillero__tilde" />}
        </li>
      ))}
    </ol>
  )
}

/** «5/9» a la vista; el lector dice «5 de septiembre», no «5 barra 9». */
function Fecha({ iso, className }: { iso: string; className: string }) {
  return (
    <span className={className}>
      <span aria-hidden>{fechaDeMargen(iso)}</span>
      <span className="sr-solo">{fechaLarga(iso)}</span>
    </span>
  )
}

/** Lo de todos los días va con ícono; la nota, que es lo más común, sin nada. */
const MARCA_ENTRADA: Partial<Record<TipoEntrada, ComponentType<IconProps>>> = {
  riego: IconoRegar,
  plaga: IconoPlaga,
}

function MarcaDeEntrada({ tipo }: { tipo: TipoEntrada }) {
  const { etiqueta } = TIPOS_ENTRADA[tipo]
  if (llevaSello(tipo)) {
    return (
      <>
        <span className="pagina-planta-sello">
          <b>{etiqueta}</b>
        </span>
        <span className="sr-solo">: </span>
      </>
    )
  }
  const Icono = MARCA_ENTRADA[tipo]
  if (!Icono) return null
  return (
    <>
      <Icono size={18} className={`pagina-planta-entrada__tipo es-${tipo}`} />
      <span className="sr-solo">{etiqueta}: </span>
    </>
  )
}

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

function fechaLarga(iso: string): string {
  return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long' }).format(desdeISO(iso))
}

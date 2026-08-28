import { useEffect, useRef, useState } from 'react'
import { Header } from '../components/Header'
import { BottomSheet } from '../components/BottomSheet'
import { elegirZona, useZona, ZONAS_INFO } from '../lib/zona'
import { ZONAS, type Zona } from '../lib/data/types'
import { useHuerta, recargar } from '../lib/huerta/store'
import { espacioUsado, pedirPersistencia } from '../lib/huerta/db'
import { comoTexto, leer as leerBitacora, nombreError } from '../lib/huerta/bitacora'
import { pesoLegible } from '../lib/huerta/fotos'
import { borrarTodo, sembrarDemo } from '../lib/huerta/demo'
import {
  exportar,
  importar,
  leerUltimoBackup,
  leerArchivo,
  resumir,
  BackupInvalido,
  type Backup,
  type ResumenBackup,
} from '../lib/huerta/backup'
import { instalar, useComoInstalar } from '../lib/instalar'
import { elegirUbicacion, sacarUbicacion, usePronostico } from '../lib/pronostico/store'
import { proveedor } from '../lib/pronostico/proveedor'
import { ubicarPorGPS } from '../lib/pronostico/geo'
import { COORDS_ZONA, type Localidad, type UbicacionClima } from '../lib/pronostico/tipos'
import { VERSION } from '../lib/version'
import {
  activarAvisos,
  alCambiarPermiso,
  desactivarAvisos,
  esIOS,
  estadoAvisos,
  probarAviso,
  type EstadoAvisos,
} from '../lib/avisos'
import { resumenHuerta } from '../lib/huerta/tanda'
import { IconoAlerta, IconoBajar, IconoCampana, IconoInstalar, IconoSubir, IconoUbicacion } from '../icons'
import './Ajustes.css'

export function Ajustes() {
  const zona = useZona()
  const { plantas } = useHuerta()

  return (
    <div className="pantalla pantalla--detalle">
      <Header titulo="Ajustes" volver />
      <div className="pantalla__cuerpo">
        <SeccionZona zona={zona} />
        <SeccionPronostico zona={zona} />
        <SeccionInstalar />
        <SeccionBackup cuantasPlantas={plantas.length} resumen={resumenHuerta(plantas)} />
        <SeccionAvisos />
        <SeccionDemo cuantasPlantas={plantas.length} />
        <SeccionBitacora />
        <PieVersion />
      </div>
    </div>
  )
}

/**
 * Qué versión tenés. Va discreto al pie, pero va: cuando alguien escribe porque
 * algo no le anda, lo primero que hace falta saber es qué está corriendo —y una
 * PWA puede quedarse semanas en una versión vieja sin que se note.
 */
function PieVersion() {
  return (
    <p className="ajustes__version">
      Huerta GBA <strong>{VERSION}</strong>
    </p>
  )
}

/* ---------- zona ---------- */

function SeccionZona({ zona }: { zona: Zona }) {
  return (
    <section className="ajustes__seccion">
      <h2 className="ajustes__titulo subrayado-onda">¿Dónde está tu huerta?</h2>
      <p className="ajustes__bajada">
        Dentro del GBA la última helada cambia más de un mes según dónde estés, y de eso depende todo
        el calendario. En el centro porteño casi no hiela; en La Plata o Cañuelas, hasta bien entrada
        la primavera.
      </p>

      <div className="opciones" role="radiogroup" aria-label="Zona de la huerta">
        {ZONAS.map((z) => {
          const info = ZONAS_INFO[z]
          return (
            <button
              key={z}
              className={`opcion ${zona === z ? 'es-elegida' : ''}`}
              onClick={() => elegirZona(z)}
              role="radio"
              aria-checked={zona === z}
            >
              <span className="opcion__marca" aria-hidden />
              <span className="opcion__textos">
                <span className="opcion__nombre">{info.etiqueta}</span>
                <span className="opcion__detalle">{info.detalle}</span>
                <span className="opcion__helada">{info.helada}</span>
              </span>
            </button>
          )
        })}
      </div>

      <p className="ajustes__nota">
        <IconoAlerta size={15} />
        <span>
          Si dudás, dejá <strong>Conurbano</strong>: es la opción del medio y cubre la mayor parte del
          GBA. Ante la duda conviene la zona más fría, que atrasa la siembra y arriesga menos.
        </span>
      </p>
    </section>
  )
}


/* ---------- pronóstico ---------- */

/**
 * Activar el pronóstico es dar una ubicación, y es opt-in a propósito: sin
 * esto la app no toca la red. Tres caminos, del más reservado al más fino:
 * la estación de la zona, una localidad buscada, o el GPS.
 */
function SeccionPronostico({ zona }: { zona: Zona }) {
  const { ubicacion } = usePronostico()
  const [eligiendo, setEligiendo] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [resultados, setResultados] = useState<Localidad[] | null>(null)
  const [buscando, setBuscando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function elegir(u: UbicacionClima) {
    setError(null)
    await elegirUbicacion(u)
    setEligiendo(false)
    setBusqueda('')
    setResultados(null)
  }

  function porZona() {
    const ref = COORDS_ZONA[zona]
    void elegir({ modo: 'zona', lat: ref.lat, lon: ref.lon, etiqueta: `cerca de ${ref.nombre}, aproximado` })
  }

  async function porGPS() {
    setError(null)
    try {
      const { lat, lon } = await ubicarPorGPS()
      await elegir({ modo: 'gps', lat, lon, etiqueta: 'tu ubicación' })
    } catch (e) {
      setError(
        (e as Error).message === 'denegado'
          ? 'El navegador no dio permiso de ubicación. Buscá tu localidad, que funciona igual.'
          : 'El GPS no anduvo. Buscá tu localidad, que funciona igual.',
      )
    }
  }

  async function buscar() {
    const texto = busqueda.trim()
    if (!texto || buscando) return
    setBuscando(true)
    setError(null)
    setResultados(null)
    try {
      setResultados(await proveedor.buscarLocalidad(texto))
    } catch {
      setError('No pude buscar: fijate si hay internet.')
    } finally {
      setBuscando(false)
    }
  }

  if (ubicacion && !eligiendo) {
    return (
      <section className="ajustes__seccion">
        <h2 className="ajustes__titulo subrayado-onda">El pronóstico</h2>
        <p className="ajustes__bajada">
          Se pide para <strong>{ubicacion.etiqueta}</strong>, directo de tu teléfono a{' '}
          {proveedor.nombre}. Lo ves en Hoy, con la semana y sus avisos.
        </p>
        <div className="ajustes__botones">
          <button className="boton-secundario" onClick={() => setEligiendo(true)}>
            Cambiar la ubicación
          </button>
          <button className="boton-peligro-suave" onClick={() => void sacarUbicacion()}>
            Sacarla y apagar el pronóstico
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="ajustes__seccion">
      <h2 className="ajustes__titulo subrayado-onda">El pronóstico</h2>
      <p className="ajustes__bajada">
        Si querés, Hoy te muestra el pronóstico de la semana y te avisa cuando vienen heladas,
        lluvia o mucho calor. Para eso la app necesita saber más o menos dónde estás — y es lo
        único que sale de tu teléfono: va directo a {proveedor.nombre}, sin pasar por ningún otro
        lado. Si no lo prendés, todo sigue igual que siempre.
      </p>

      <div className="ajustes__botones">
        <button className="boton-secundario" onClick={porZona}>
          Usar mi zona, así nomás
        </button>
        <button className="boton-secundario" onClick={() => void porGPS()}>
          Usar el GPS
        </button>
        {eligiendo && (
          <button className="boton-secundario" onClick={() => setEligiendo(false)}>
            Dejar como está
          </button>
        )}
      </div>

      <form
        className="ajustes__buscador"
        onSubmit={(e) => {
          e.preventDefault()
          void buscar()
        }}
      >
        <input
          className="ajustes__input"
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="O buscá tu localidad…"
          aria-label="Buscar tu localidad"
        />
        <button className="boton-secundario" type="submit" disabled={buscando}>
          {buscando ? 'Buscando…' : 'Buscar'}
        </button>
      </form>

      {resultados && resultados.length > 0 && (
        <ul className="ajustes__resultados">
          {resultados.map((r) => (
            <li key={`${r.lat},${r.lon}`}>
              <button
                className="ajustes__resultado"
                onClick={() => void elegir({ modo: 'localidad', lat: r.lat, lon: r.lon, etiqueta: r.nombre })}
              >
                <span className="ajustes__resultado-nombre">{r.nombre}</span>
                {r.detalle && <span className="ajustes__resultado-detalle">{r.detalle}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
      {resultados?.length === 0 && (
        <p className="ajustes__error">No encontré esa localidad. Probá con el nombre del partido.</p>
      )}
      {error && <p className="ajustes__error">{error}</p>}

      <p className="ajustes__nota">
        <IconoUbicacion size={15} />
        <span>
          El GPS pide permiso del navegador. Vayas por donde vayas, la ubicación viaja redondeada
          a un kilómetro más o menos, y la sacás cuando quieras.
        </span>
      </p>
    </section>
  )
}

/* ---------- instalar ---------- */

/**
 * Instalarla en la pantalla de inicio. En Android hay un botón de verdad; en
 * iPhone no existe la API, así que lo único honesto es explicar los tres pasos
 * —y explicarlos bien, porque el botón de compartir de Safari no es obvio.
 */
function SeccionInstalar() {
  const como = useComoInstalar()
  const [instalando, setInstalando] = useState(false)

  if (como === 'ya-esta') {
    return (
      <section className="ajustes__seccion">
        <h2 className="ajustes__titulo subrayado-onda">La app</h2>
        <p className="ajustes__recordatorio es-ok">
          <IconoInstalar size={16} />
          <span>
            <strong>Ya está instalada.</strong> Anda sin internet y tus datos están más protegidos
            que en una pestaña común.
          </span>
        </p>
      </section>
    )
  }

  return (
    <section className="ajustes__seccion">
      <h2 className="ajustes__titulo subrayado-onda">Instalar en el celu</h2>
      <p className="ajustes__bajada">
        Queda como una app más: abre a pantalla completa, <strong>funciona sin internet</strong> y el
        navegador le borra los datos menos fácil. No ocupa casi nada y no hay que crear ninguna
        cuenta.
      </p>

      {como === 'boton' ? (
        <div className="ajustes__botones">
          <button
            className="boton-primario"
            onClick={() => {
              setInstalando(true)
              void instalar().finally(() => setInstalando(false))
            }}
            disabled={instalando}
          >
            <IconoInstalar size={18} /> Instalar la app
          </button>
        </div>
      ) : como === 'ios-manual' ? (
        <ol className="pasos">
          <li>
            Tocá el botón <strong>Compartir</strong> abajo en Safari — el cuadradito con la flecha
            para arriba.
          </li>
          <li>
            Bajá en la lista hasta <strong>"Agregar a inicio"</strong>.
          </li>
          <li>
            Tocá <strong>Agregar</strong>. Listo: te queda el ícono con el plantín.
          </li>
        </ol>
      ) : (
        <ol className="pasos">
          <li>
            Abrí el <strong>menú del navegador</strong> (los tres puntitos).
          </li>
          <li>
            Buscá <strong>"Instalar app"</strong> o <strong>"Agregar a la pantalla de inicio"</strong>.
          </li>
          <li>Confirmá y listo.</li>
        </ol>
      )}
    </section>
  )
}

/* ---------- backup ---------- */

function SeccionBackup({ cuantasPlantas, resumen }: { cuantasPlantas: number; resumen: string }) {
  const archivo = useRef<HTMLInputElement>(null)
  const [espacio, setEspacio] = useState<{ usado: number; total: number } | null>(null)
  const [ultimo, setUltimo] = useState<string | null | undefined>(undefined)
  const [persistente, setPersistente] = useState<boolean | null>(null)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pendiente, setPendiente] = useState<{ backup: Backup; resumen: ResumenBackup } | null>(null)
  const [importando, setImportando] = useState(false)

  useEffect(() => {
    void espacioUsado().then(setEspacio)
    void leerUltimoBackup().then((v) => setUltimo(v ?? null))
    if (navigator.storage?.persisted) void navigator.storage.persisted().then(setPersistente)
  }, [])

  async function alExportar() {
    setError(null)
    try {
      const como = await exportar()
      setMensaje(como === 'compartido' ? 'Backup compartido.' : 'Backup descargado.')
      setUltimo(await leerUltimoBackup().then((v) => v ?? null))
    } catch {
      setError('No se pudo generar el backup.')
    }
  }

  async function alElegirArchivo(f: File | undefined) {
    setError(null)
    setMensaje(null)
    if (!f) return
    try {
      const backup = await leerArchivo(f)
      setPendiente({ backup, resumen: resumir(backup) })
    } catch (e) {
      setError(e instanceof BackupInvalido ? e.message : 'No se pudo leer el archivo.')
    }
  }

  async function confirmarImportacion() {
    if (!pendiente) return
    setImportando(true)
    try {
      await importar(pendiente.backup)
      await recargar()
      setPendiente(null)
      setMensaje('Listo: tu huerta quedó como en el backup.')
    } catch (e) {
      setError(
        `No se pudo restaurar el backup, así que tu huerta quedó como estaba (${nombreError(e)}). Si el archivo está cortado, probá con otro.`,
      )
    } finally {
      setImportando(false)
    }
  }

  return (
    <section className="ajustes__seccion">
      <h2 className="ajustes__titulo subrayado-onda">Tus datos</h2>
      <p className="ajustes__bajada">
        Todo lo que cargás vive <strong>solo en este aparato</strong>: no hay cuenta ni servidor, y
        nadie más lo ve. La contra es que si borrás los datos del navegador, se va. Y en iPhone el
        sistema puede vaciarlos solo si pasás semanas sin abrir la app.
      </p>
      <p className="ajustes__bajada">
        <strong>Por eso el backup no es un extra.</strong> Guardate el archivo cada tanto donde
        quieras: mail, Drive, lo que uses.
      </p>

      {ultimo !== undefined && <AvisoUltimoBackup iso={ultimo} hayDatos={cuantasPlantas > 0} />}

      <div className="ajustes__botones">
        <button className="boton-primario" onClick={alExportar}>
          <IconoBajar size={18} /> Bajar backup
        </button>
        <button className="boton-secundario" onClick={() => archivo.current?.click()}>
          <IconoSubir size={18} /> Restaurar de un archivo
        </button>
        <input
          ref={archivo}
          type="file"
          accept="application/json,.json"
          className="sr-solo"
          onChange={(e) => {
            void alElegirArchivo(e.target.files?.[0])
            e.target.value = ''
          }}
        />
      </div>

      {mensaje && <p className="ajustes__ok">{mensaje}</p>}
      {error && <p className="ajustes__error">{error}</p>}

      <dl className="ajustes__estado">
        <div>
          <dt>En la app</dt>
          <dd>{resumen}</dd>
        </div>
        {espacio && (
          <div>
            <dt>Ocupado</dt>
            <dd>{pesoLegible(espacio.usado)}</dd>
          </div>
        )}
        <div>
          <dt>Almacenamiento</dt>
          <dd>{persistente ? 'protegido' : 'sin proteger'}</dd>
        </div>
      </dl>

      {persistente === false && (
        <button
          className="boton-secundario"
          onClick={() => void pedirPersistencia().then(setPersistente)}
        >
          Pedirle al navegador que no los borre
        </button>
      )}

      <BottomSheet
        abierto={!!pendiente}
        onCerrar={() => setPendiente(null)}
        titulo="¿Restaurar este backup?"
        sobretitulo="Reemplaza todo lo que tenés ahora"
        pie={
          <button className="boton-peligro" onClick={confirmarImportacion} disabled={importando}>
            {importando ? 'Restaurando…' : 'Sí, reemplazar mi huerta'}
          </button>
        }
      >
        {pendiente && (
          <>
            <p className="alta__aviso es-mala">
              <IconoAlerta size={17} />
              <span>
                Esto <strong>borra</strong> lo que tenés ahora ({resumen}) y lo reemplaza por lo del
                archivo. No se puede deshacer.
              </span>
            </p>
            <dl className="ajustes__estado">
              <div>
                <dt>Trae</dt>
                <dd>{pendiente.resumen.huerta}</dd>
              </div>
              <div>
                <dt>Diario</dt>
                <dd>{pendiente.resumen.entradas} entradas</dd>
              </div>
              <div>
                <dt>Fotos</dt>
                <dd>{pendiente.resumen.fotos}</dd>
              </div>
            </dl>
            <p className="ajustes__bajada">
              Exportado el{' '}
              {new Intl.DateTimeFormat('es-AR', { dateStyle: 'long', timeStyle: 'short' }).format(
                new Date(pendiente.resumen.exportado),
              )}
              , zona {ZONAS_INFO[pendiente.resumen.zona]?.etiqueta.toLowerCase() ?? '—'}.
            </p>
          </>
        )}
      </BottomSheet>
    </section>
  )
}

/** Recordatorio suave: cuánto hace del último backup. Sin culpa ni alarmas. */
function AvisoUltimoBackup({ iso, hayDatos }: { iso: string | null; hayDatos: boolean }) {
  if (!hayDatos) return null

  if (!iso) {
    return (
      <p className="ajustes__recordatorio es-nunca">
        <IconoAlerta size={16} />
        <span>Todavía no bajaste ningún backup. Si perdés estos datos, no hay de dónde sacarlos.</span>
      </p>
    )
  }

  const dias = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  const viejo = dias >= 30
  return (
    <p className={`ajustes__recordatorio ${viejo ? 'es-viejo' : 'es-ok'}`}>
      <IconoAlerta size={16} />
      <span>
        Último backup:{' '}
        <strong>
          {dias === 0 ? 'hoy' : dias === 1 ? 'ayer' : `hace ${dias} días`}
        </strong>
        {viejo && '. Ya va siendo hora de bajar uno nuevo.'}
      </span>
    </p>
  )
}

/* ---------- avisos ---------- */

/**
 * Notificaciones. La sección más difícil de escribir de la app, porque lo
 * honesto es admitir que en iPhone no funcionan y que en Android tampoco se
 * puede elegir la hora. Se dice antes de que la persona toque el botón, no
 * después de esperar tres días un aviso que no iba a llegar.
 */
function SeccionAvisos() {
  const [estado, setEstado] = useState<EstadoAvisos | null>(null)
  const [probado, setProbado] = useState(false)
  const [ocupado, setOcupado] = useState(false)

  useEffect(() => {
    const releer = () => void estadoAvisos().then(setEstado)
    releer()
    // si desbloquean los avisos desde el navegador, esta pantalla se entera
    return alCambiarPermiso(releer)
  }, [])

  if (!estado) return null

  const prendidos = estado.activo && estado.permiso === 'granted'

  async function alternar() {
    setOcupado(true)
    try {
      setEstado(prendidos ? await desactivarAvisos() : await activarAvisos())
    } finally {
      setOcupado(false)
    }
  }

  return (
    <section className="ajustes__seccion">
      <h2 className="ajustes__titulo subrayado-onda">Avisos</h2>
      <p className="ajustes__bajada">
        La app <strong>no depende de esto</strong>: al abrirla, Hoy siempre te muestra lo pendiente.
        Un aviso es para los días que ni la abrís.
      </p>

      {!estado.soportado ? (
        <p className="ajustes__recordatorio es-nunca">
          <IconoAlerta size={16} />
          <span>Este navegador no puede mostrar avisos. Todo lo demás anda igual.</span>
        </p>
      ) : estado.permiso === 'denied' ? (
        <p className="ajustes__recordatorio es-nunca">
          <IconoAlerta size={16} />
          <span>
            Los bloqueaste para este sitio. Se vuelven a habilitar desde los ajustes del navegador,
            en los permisos de esta página.
          </span>
        </p>
      ) : (
        <>
          <div className="ajustes__botones">
            <button
              className={prendidos ? 'boton-secundario' : 'boton-primario'}
              onClick={() => void alternar()}
              disabled={ocupado}
            >
              <IconoCampana size={18} />
              {prendidos ? 'Apagar los avisos' : 'Prender los avisos'}
            </button>
            {prendidos && (
              <button
                className="boton-secundario"
                onClick={() => {
                  setProbado(true)
                  void probarAviso()
                }}
              >
                Mandarme uno de prueba
              </button>
            )}
          </div>
          {probado && (
            <p className="ajustes__ok">
              Mandado. Si no lo viste, fijate los permisos de notificaciones del sistema.
            </p>
          )}
          <LimitesDeAvisos estado={estado} prendidos={prendidos} />
        </>
      )}
    </section>
  )
}

/** La letra chica, que acá es la parte importante. */
function LimitesDeAvisos({ estado, prendidos }: { estado: EstadoAvisos; prendidos: boolean }) {
  if (esIOS()) {
    return (
      <p className="ajustes__nota">
        <IconoAlerta size={15} />
        <span>
          <strong>En iPhone y iPad no van a llegar con la app cerrada.</strong> iOS no deja que una
          app instalada se despierte sola, y no hay forma de darle la vuelta sin un servidor. Por eso
          la app está pensada para funcionar sin avisos.
        </span>
      </p>
    )
  }

  if (!estado.instalada) {
    return (
      <p className="ajustes__nota">
        <IconoAlerta size={15} />
        <span>
          Para que lleguen con la app cerrada hay que <strong>instalarla</strong> (en el menú del
          navegador, "Instalar app" o "Agregar a la pantalla de inicio"). En una pestaña común el
          navegador no la despierta.
        </span>
      </p>
    )
  }

  if (!estado.puedeDespertar) {
    return (
      <p className="ajustes__nota">
        <IconoAlerta size={15} />
        <span>
          Este navegador no puede despertar la app en segundo plano, así que los avisos van a llegar
          solo si la tenés abierta. Hoy eso lo hace Chrome en Android y en escritorio.
        </span>
      </p>
    )
  }

  return (
    <p className="ajustes__nota">
      <IconoAlerta size={15} />
      <span>
        {prendidos ? 'Te va a avisar' : 'Te avisaría'} <strong>una vez por día como mucho</strong>, y
        solo los días en que aparece algo nuevo. La hora la decide el navegador: sin un servidor
        atrás no se puede pedir una exacta.
      </span>
    </p>
  )
}

/* ---------- demo ---------- */

/* ---------- bitácora ---------- */

/**
 * El registro de arranques.
 *
 * Existe por un bug que no se puede reproducir: hay quien abre la app y se
 * encuentra la huerta vacía, sin patrón conocido. Sin esto el diagnóstico es a
 * ciegas —así fue el de la 1.1.0, preguntando datos de a uno—, porque la app no
 * dejaba rastro de nada.
 *
 * Vive en localStorage, que es lo único que sobrevive a que IndexedDB se vacíe.
 */
function SeccionBitacora() {
  const [apuntes, setApuntes] = useState(() => leerBitacora())
  const [abierta, setAbierta] = useState(false)
  const [copiado, setCopiado] = useState(false)

  const texto = comoTexto(apuntes)

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      // sin permiso de portapapeles queda el texto a la vista para seleccionar
    }
  }

  return (
    <section className="ajustes__seccion">
      <h2 className="ajustes__titulo subrayado-onda">Si algo se rompe</h2>
      <p className="ajustes__bajada">
        Cada vez que abrís la app, se anota acá cómo le fue al leer tu huerta.{' '}
        <strong>Si alguna vez aparece vacía, copiá esto y mandalo</strong>: dice qué pasó y cuándo.
        No sale de tu aparato.
      </p>

      <details
        className="bitacora"
        onToggle={(e) => {
          setAbierta(e.currentTarget.open)
          setApuntes(leerBitacora())
        }}
      >
        <summary className="bitacora__ver">
          Ver el registro ({apuntes.length === 1 ? '1 apunte' : `${apuntes.length} apuntes`})
        </summary>
        {/* el registro se dibuja recién al abrirlo: son decenas de líneas que
            nadie mira, y adentro de un details cerrado igual pesan */}
        {abierta && (
          <>
            <pre className="bitacora__texto">{texto}</pre>
            <div className="ajustes__botones">
              <button className="boton-secundario" onClick={() => void copiar()}>
                {copiado ? 'Copiado' : 'Copiar el registro'}
              </button>
            </div>
          </>
        )}
      </details>
    </section>
  )
}

function SeccionDemo({ cuantasPlantas }: { cuantasPlantas: number }) {
  const [ocupado, setOcupado] = useState(false)

  async function demo() {
    if (cuantasPlantas > 0 && !confirm('Vas a sumar plantas de ejemplo a las que ya tenés. ¿Seguimos?')) return
    setOcupado(true)
    try {
      await sembrarDemo()
    } finally {
      setOcupado(false)
    }
  }

  async function limpiar() {
    if (!confirm('Esto borra TODAS tus plantas, su diario y sus fotos. ¿Seguro?')) return
    setOcupado(true)
    try {
      await borrarTodo()
    } finally {
      setOcupado(false)
    }
  }

  return (
    <section className="ajustes__seccion">
      <h2 className="ajustes__titulo subrayado-onda">Para probar</h2>
      <p className="ajustes__bajada">
        Una huerta de ejemplo con cuatro plantas en distintas etapas y algo de diario, para ver cómo
        se comporta la app sin esperar tres meses.
      </p>
      <div className="ajustes__botones">
        <button className="boton-secundario" onClick={demo} disabled={ocupado}>
          Cargar huerta de ejemplo
        </button>
        {cuantasPlantas > 0 && (
          <button className="boton-peligro-suave" onClick={limpiar} disabled={ocupado}>
            Borrar todas mis plantas
          </button>
        )}
      </div>
    </section>
  )
}

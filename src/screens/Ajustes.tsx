import { useEffect, useRef, useState } from 'react'
import { Header } from '../components/Header'
import { BottomSheet } from '../components/BottomSheet'
import { elegirZona, useZona, ZONAS_INFO } from '../lib/zona'
import { ZONAS, type Zona } from '../lib/data/types'
import { useHuerta, recargar } from '../lib/huerta/store'
import { espacioUsado, pedirPersistencia } from '../lib/huerta/db'
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
import { IconoAlerta, IconoBajar, IconoCampana, IconoInstalar, IconoSubir } from '../icons'
import './Ajustes.css'

export function Ajustes() {
  const zona = useZona()
  const { plantas } = useHuerta()

  return (
    <div className="pantalla pantalla--detalle">
      <Header titulo="Ajustes" volver />
      <div className="pantalla__cuerpo">
        <SeccionZona zona={zona} />
        <SeccionInstalar />
        <SeccionBackup cuantasPlantas={plantas.length} />
        <SeccionAvisos />
        <SeccionDemo cuantasPlantas={plantas.length} />
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

function SeccionBackup({ cuantasPlantas }: { cuantasPlantas: number }) {
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
    } catch {
      setError('Falló la importación. Tus datos anteriores pueden haberse perdido: si tenés otro backup, probá con ese.')
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
          <dd>{cuantasPlantas === 1 ? '1 planta' : `${cuantasPlantas} plantas`}</dd>
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
                Esto <strong>borra</strong> tus {cuantasPlantas === 1 ? '1 planta' : `${cuantasPlantas} plantas`}{' '}
                actuales y las reemplaza por las del archivo. No se puede deshacer.
              </span>
            </p>
            <dl className="ajustes__estado">
              <div>
                <dt>Trae</dt>
                <dd>{pendiente.resumen.plantas} plantas</dd>
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

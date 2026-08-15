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
  leerArchivo,
  resumir,
  BackupInvalido,
  type Backup,
  type ResumenBackup,
} from '../lib/huerta/backup'
import { IconoAlerta, IconoFuente, IconoNota } from '../icons'
import './Ajustes.css'

export function Ajustes() {
  const zona = useZona()
  const { plantas } = useHuerta()

  return (
    <div className="pantalla pantalla--detalle">
      <Header titulo="Ajustes" volver />
      <div className="pantalla__cuerpo">
        <SeccionZona zona={zona} />
        <SeccionBackup cuantasPlantas={plantas.length} />
        <SeccionDemo cuantasPlantas={plantas.length} />
      </div>
    </div>
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

/* ---------- backup ---------- */

function SeccionBackup({ cuantasPlantas }: { cuantasPlantas: number }) {
  const archivo = useRef<HTMLInputElement>(null)
  const [espacio, setEspacio] = useState<{ usado: number; total: number } | null>(null)
  const [persistente, setPersistente] = useState<boolean | null>(null)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pendiente, setPendiente] = useState<{ backup: Backup; resumen: ResumenBackup } | null>(null)
  const [importando, setImportando] = useState(false)

  useEffect(() => {
    void espacioUsado().then(setEspacio)
    if (navigator.storage?.persisted) void navigator.storage.persisted().then(setPersistente)
  }, [])

  async function alExportar() {
    setError(null)
    try {
      const como = await exportar()
      setMensaje(como === 'compartido' ? 'Backup compartido.' : 'Backup descargado.')
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

      <div className="ajustes__botones">
        <button className="boton-primario" onClick={alExportar}>
          <IconoFuente size={18} /> Bajar backup
        </button>
        <button className="boton-secundario" onClick={() => archivo.current?.click()}>
          <IconoNota size={18} /> Restaurar de un archivo
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

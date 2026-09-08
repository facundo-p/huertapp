import { useEffect, useState } from 'react'
import { BottomSheet } from './BottomSheet'
import {
  actualizarCompostera,
  agregarCompostera,
  borrarCompostera,
  sinRomper,
} from '../lib/huerta/store'
import {
  MATERIAL_COMPOST_INFO,
  RITMOS_ELEGIBLES,
  SISTEMA_COMPOST_INFO,
  ritmoSugerido,
} from '../lib/huerta/compostera'
import { useCompostaje } from '../lib/compostaje'
import {
  ESTADOS_COMPOST,
  ESTADO_COMPOST_INFO,
  hoyISO,
  type Compostera,
  type EstadoCompost,
  type MaterialCompost,
  type SistemaCompost,
} from '../lib/huerta/tipos'
import './AltaPlanta.css'
import './FichaUbicacion.css'

/**
 * Alta y edición de una compostera con los mismos campos. El ritmo es tuyo:
 * la guía dice cada cuánto y por qué en cada caso, pero el aviso sale con lo
 * que elegís acá, y se cuenta desde el último giro que anotás.
 */

interface Props {
  abierto: boolean
  onCerrar: () => void
  /** con compostera es edición; sin ella, alta */
  compostera?: Compostera
  onListo?: (c: Compostera) => void
}

export function FichaCompostera({ abierto, onCerrar, compostera, onListo }: Props) {
  const guia = useCompostaje()
  const [nombre, setNombre] = useState('')
  const [sistema, setSistema] = useState<SistemaCompost>('tachos')
  const [material, setMaterial] = useState<MaterialCompost>('cocina')
  const [conLombrices, setConLombrices] = useState(false)
  const [estado, setEstado] = useState<EstadoCompost>('llenando')
  const [desde, setDesde] = useState(hoyISO())
  const [girada, setGirada] = useState(hoyISO())
  const [ritmo, setRitmo] = useState<number | null>(7)
  const [ritmoTocado, setRitmoTocado] = useState(false)
  const [notas, setNotas] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (!abierto) return
    setNombre(compostera?.nombre ?? '')
    setSistema(compostera?.sistema ?? 'tachos')
    setMaterial(compostera?.material ?? 'cocina')
    setConLombrices(compostera?.conLombrices ?? false)
    setEstado(compostera?.estado ?? 'llenando')
    setDesde(compostera?.estadoDesde ?? hoyISO())
    setGirada(compostera?.girada ?? (compostera ? '' : hoyISO()))
    setRitmo(compostera ? compostera.ritmoDias : 7)
    setRitmoTocado(!!compostera)
    setNotas(compostera?.notas ?? '')
  }, [abierto, compostera])

  // con lombrices se gira menos: la sugerencia cambia sola hasta que la tocás
  function elegirLombrices(valor: boolean) {
    setConLombrices(valor)
    if (!ritmoTocado) setRitmo(ritmoSugerido(valor))
  }

  async function guardar() {
    if (!nombre.trim() || guardando) return
    setGuardando(true)
    try {
      const cambioEstado = compostera && compostera.estado !== estado
      const datos = {
        nombre,
        sistema,
        material,
        conLombrices: conLombrices || undefined,
        estado,
        estadoDesde: desde || hoyISO(),
        // dejó de recibir restos: se conserva lo que había; si vuelve a llenar, se borra
        cerrada:
          estado === 'llenando' ? undefined : (compostera?.cerrada ?? (cambioEstado || !compostera ? desde : undefined)),
        ritmoDias: ritmo,
        girada: girada || undefined,
        notas: notas.trim() || undefined,
      }
      const guardada: Compostera = compostera
        ? { ...compostera, ...datos, nombre: nombre.trim() }
        : await agregarCompostera(datos)
      if (compostera) await actualizarCompostera(guardada)
      onCerrar()
      onListo?.(guardada)
    } finally {
      setGuardando(false)
    }
  }

  async function borrar() {
    if (!compostera) return
    if (!confirm(`¿Borrar «${compostera.nombre}»? Se van sus avisos; no se puede deshacer.`)) return
    await borrarCompostera(compostera.id)
    onCerrar()
  }

  const ritmosGuia = guia?.comun.ritmos.filter((r) => r.dias != null) ?? []

  return (
    <BottomSheet
      abierto={abierto}
      onCerrar={onCerrar}
      titulo={compostera ? 'Editar la compostera' : 'Una compostera nueva'}
      sobretitulo={compostera?.nombre}
      pie={
        <button className="alta__guardar" onClick={() => sinRomper(guardar())} disabled={guardando || !nombre.trim()}>
          {guardando ? 'Guardando…' : compostera ? 'Guardar los cambios' : 'Sumar esta compostera'}
        </button>
      }
    >
      <div className="alta__campo">
        <label className="alta__label" htmlFor="compost-nombre">
          ¿Cómo le decís?
        </label>
        <input
          id="compost-nombre"
          className="alta__input"
          placeholder="Tacho del balcón, corralito del fondo…"
          value={nombre}
          onChange={(ev) => setNombre(ev.target.value)}
        />
      </div>

      <div className="alta__campo">
        <span className="alta__label">¿Qué es?</span>
        <div className="alta__metodos">
          {(Object.keys(SISTEMA_COMPOST_INFO) as SistemaCompost[]).map((s) => (
            <button key={s} className={`alta__metodo ${sistema === s ? 'es-activo' : ''}`} onClick={() => setSistema(s)} aria-pressed={sistema === s}>
              {SISTEMA_COMPOST_INFO[s].etiqueta}
            </button>
          ))}
        </div>
      </div>

      <div className="alta__campo">
        <span className="alta__label">¿Qué compostás?</span>
        <div className="alta__metodos">
          {(Object.keys(MATERIAL_COMPOST_INFO) as MaterialCompost[]).map((m) => (
            <button key={m} className={`alta__metodo ${material === m ? 'es-activo' : ''}`} onClick={() => setMaterial(m)} aria-pressed={material === m}>
              {MATERIAL_COMPOST_INFO[m].etiqueta}
            </button>
          ))}
        </div>
      </div>

      <div className="alta__campo">
        <span className="alta__label">
          Lombrices <span className="alta__opcional">(opcional)</span>
        </span>
        <div className="alta__metodos">
          <button className={`alta__metodo ${conLombrices ? 'es-activo' : ''}`} onClick={() => elegirLombrices(!conLombrices)} aria-pressed={conLombrices}>
            Tiene lombrices
          </button>
        </div>
        {conLombrices && <p className="alta__ayuda">Con lombrices se gira menos: airean ellas. Mezclá solo si huele o se apelmaza.</p>}
      </div>

      <div className="alta__campo">
        <span className="alta__label">¿En qué está?</span>
        <div className="alta__metodos">
          {ESTADOS_COMPOST.map((e) => (
            <button key={e} className={`alta__metodo ${estado === e ? 'es-activo' : ''}`} onClick={() => setEstado(e)} aria-pressed={estado === e}>
              {ESTADO_COMPOST_INFO[e].etiqueta}
            </button>
          ))}
        </div>
        <label className="ficha-ubi__rotulo" htmlFor="compost-desde">
          Desde cuándo
        </label>
        <input id="compost-desde" type="date" className="alta__input" value={desde} max={hoyISO()} onChange={(ev) => setDesde(ev.target.value)} />
      </div>

      <div className="alta__campo">
        <label className="alta__label" htmlFor="compost-girada">
          Último giro <span className="alta__opcional">(opcional)</span>
        </label>
        <input id="compost-girada" type="date" className="alta__input" value={girada} max={hoyISO()} onChange={(ev) => setGirada(ev.target.value)} />
        <p className="alta__ayuda">El próximo aviso se cuenta desde acá. Sin fecha, desde que está en este estado.</p>
      </div>

      <div className="alta__campo">
        <span className="alta__label">¿Cada cuánto te aviso que toca girar?</span>
        <div className="alta__metodos">
          {RITMOS_ELEGIBLES.map((r) => (
            <button
              key={String(r.dias)}
              className={`alta__metodo ${ritmo === r.dias ? 'es-activo' : ''}`}
              onClick={() => {
                setRitmo(r.dias)
                setRitmoTocado(true)
              }}
              aria-pressed={ritmo === r.dias}
            >
              {r.etiqueta}
            </button>
          ))}
        </div>
        <p className="alta__ayuda">
          Es tu manejo; la guía dice cada cuánto según el caso
          {ritmosGuia.length > 0 && `: ${ritmosGuia.map((r) => `${r.cuando.toLowerCase()}, cada ${r.dias} días`).join('; ')}`}
          . Con lombrices, menos.
        </p>
      </div>

      <div className="alta__campo">
        <label className="alta__label" htmlFor="compost-notas">
          Notas <span className="alta__opcional">(opcional)</span>
        </label>
        <textarea
          id="compost-notas"
          className="alta__input ficha-ubi__notas"
          rows={2}
          placeholder="De qué es, dónde está, lo que valga recordar…"
          value={notas}
          onChange={(ev) => setNotas(ev.target.value)}
        />
      </div>

      {compostera && (
        <button className="ficha-ubi__borrar" onClick={() => sinRomper(borrar())}>
          Borrar esta compostera
        </button>
      )}
    </BottomSheet>
  )
}

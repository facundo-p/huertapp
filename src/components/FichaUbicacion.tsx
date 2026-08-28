import { useEffect, useState } from 'react'
import { BottomSheet } from './BottomSheet'
import { actualizarUbicacion, agregarUbicacion, borrarUbicacion, sinRomper, useHuerta } from '../lib/huerta/store'
import {
  aMedida,
  CAMPO_MEDIDA_INFO,
  LUZ_INFO,
  medidasQueAplican,
  PROTECCION_INFO,
  TIPO_UBICACION_INFO,
  TIPOS_ELEGIBLES,
  volumenCalculado,
  type CampoMedida,
} from '../lib/huerta/ubicacion'
import { IconoLuzMedia, IconoLuzPleno, IconoLuzSombra } from '../icons'
import type {
  LuzUbicacion,
  MedidasUbicacion,
  ProteccionUbicacion,
  TipoUbicacion,
  Ubicacion,
} from '../lib/huerta/tipos'
import './AltaPlanta.css'
import './FichaUbicacion.css'

// La ficha del lugar: crea y edita con los mismos campos. Todo salvo el nombre
// es opcional — un lugar sin datos sigue siendo un lugar.

const ICONO_LUZ: Record<LuzUbicacion, typeof IconoLuzPleno> = {
  pleno_sol: IconoLuzPleno,
  media_sombra: IconoLuzMedia,
  sombra: IconoLuzSombra,
}

interface Props {
  abierto: boolean
  onCerrar: () => void
  /** con ubicación es edición; sin ella, alta */
  ubicacion?: Ubicacion
  onListo?: (u: Ubicacion) => void
}

type TextosMedidas = Record<CampoMedida, string>

const SIN_MEDIDAS: TextosMedidas = { ancho: '', largo: '', profundidad: '', volumen: '' }

export function FichaUbicacion({ abierto, onCerrar, ubicacion, onListo }: Props) {
  const { plantas } = useHuerta()
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState<TipoUbicacion>('otro')
  const [luz, setLuz] = useState<LuzUbicacion | null>(null)
  const [proteccion, setProteccion] = useState<ProteccionUbicacion | null>(null)
  const [medidas, setMedidas] = useState<TextosMedidas>(SIN_MEDIDAS)
  const [notas, setNotas] = useState('')
  const [guardando, setGuardando] = useState(false)

  // al abrir se carga lo que haya; el estado no puede quedar del lugar anterior
  useEffect(() => {
    if (!abierto) return
    setNombre(ubicacion?.nombre ?? '')
    setTipo(ubicacion?.tipo ?? 'otro')
    setLuz(ubicacion?.luz ?? null)
    setProteccion(ubicacion?.proteccion ?? null)
    setMedidas({
      ancho: aTexto(ubicacion?.medidas?.ancho),
      largo: aTexto(ubicacion?.medidas?.largo),
      profundidad: aTexto(ubicacion?.medidas?.profundidad),
      volumen: aTexto(ubicacion?.medidas?.volumen),
    })
    setNotas(ubicacion?.notas ?? '')
  }, [abierto, ubicacion])

  const campos = medidasQueAplican(tipo)
  const volumen = volumenCalculado(tipo, leerMedidas(campos, medidas))
  const eraBancalASecas = ubicacion?.tipo === 'bancal' && tipo === 'bancal'

  async function guardar() {
    if (!nombre.trim() || guardando) return
    setGuardando(true)
    try {
      const datos = {
        nombre,
        tipo,
        luz: luz ?? undefined,
        proteccion: proteccion ?? undefined,
        medidas: leerMedidas(campos, medidas),
        notas: notas.trim() || undefined,
      }
      const guardada = ubicacion
        ? { ...ubicacion, ...datos, nombre: nombre.trim() }
        : await agregarUbicacion(datos)
      if (ubicacion) await actualizarUbicacion(guardada)
      onCerrar()
      onListo?.(guardada)
    } finally {
      setGuardando(false)
    }
  }

  async function borrar() {
    if (!ubicacion) return
    const cuantas = plantas.filter((p) => p.ubicacionId === ubicacion.id).length
    const aviso =
      cuantas === 0
        ? `¿Borrar «${ubicacion.nombre}»? No tiene plantas.`
        : `¿Borrar «${ubicacion.nombre}»? ${cuantas === 1 ? 'La planta que está ahí queda' : `Las ${cuantas} plantas que están ahí quedan`} sin lugar asignado; no se borran.`
    if (!confirm(aviso)) return
    await borrarUbicacion(ubicacion.id)
    onCerrar()
  }

  return (
    <BottomSheet
      abierto={abierto}
      onCerrar={onCerrar}
      titulo={ubicacion ? 'Editar el lugar' : 'Un lugar nuevo'}
      sobretitulo={ubicacion?.nombre}
      pie={
        <button
          className="alta__guardar"
          onClick={() => sinRomper(guardar())}
          disabled={guardando || !nombre.trim()}
        >
          {guardando ? 'Guardando…' : ubicacion ? 'Guardar los cambios' : 'Sumar este lugar'}
        </button>
      }
    >
      <div className="alta__campo">
        <label className="alta__label" htmlFor="ubi-nombre">
          ¿Cómo le decís?
        </label>
        <input
          id="ubi-nombre"
          className="alta__input"
          placeholder="Maceta del balcón, bancal del fondo…"
          value={nombre}
          onChange={(ev) => setNombre(ev.target.value)}
        />
      </div>

      <div className="alta__campo">
        <span className="alta__label">¿Qué es?</span>
        <div className="alta__metodos">
          {TIPOS_ELEGIBLES.map((t) => (
            <button
              key={t}
              className={`alta__metodo ${tipo === t ? 'es-activo' : ''}`}
              onClick={() => setTipo(t)}
              aria-pressed={tipo === t}
            >
              {TIPO_UBICACION_INFO[t].etiqueta}
            </button>
          ))}
        </div>
        {eraBancalASecas && (
          <p className="alta__ayuda">
            Hasta ahora era «Bancal» a secas. Si elegís elevado o a tierra, aparecen sus medidas.
          </p>
        )}
      </div>

      {campos.length > 0 && (
        <div className="alta__campo">
          <span className="alta__label">
            Medidas <span className="alta__opcional">(opcional)</span>
          </span>
          <div className="ficha-ubi__medidas">
            {campos.map((c) => (
              <label key={c} className="ficha-ubi__medida">
                <span className="ficha-ubi__rotulo">
                  {CAMPO_MEDIDA_INFO[c].etiqueta} <em>{CAMPO_MEDIDA_INFO[c].unidad}</em>
                </span>
                <input
                  className="alta__input"
                  inputMode="decimal"
                  value={medidas[c]}
                  onChange={(ev) => setMedidas({ ...medidas, [c]: ev.target.value })}
                />
              </label>
            ))}
          </div>
          {volumen != null && <p className="alta__ayuda">Da unos {volumen} litros de sustrato.</p>}
        </div>
      )}

      <div className="alta__campo">
        <span className="alta__label">
          ¿Cuánto sol recibe? <span className="alta__opcional">(opcional)</span>
        </span>
        <div className="alta__metodos">
          {(Object.keys(LUZ_INFO) as LuzUbicacion[]).map((l) => {
            const Icono = ICONO_LUZ[l]
            return (
              <button
                key={l}
                className={`alta__metodo ${luz === l ? 'es-activo' : ''}`}
                onClick={() => setLuz(luz === l ? null : l)}
                aria-pressed={luz === l}
              >
                <Icono size={16} />
                {LUZ_INFO[l].etiqueta}
              </button>
            )
          })}
        </div>
      </div>

      <div className="alta__campo">
        <span className="alta__label">
          Frente a una helada… <span className="alta__opcional">(opcional)</span>
        </span>
        <div className="alta__metodos">
          {(Object.keys(PROTECCION_INFO) as ProteccionUbicacion[]).map((pr) => (
            <button
              key={pr}
              className={`alta__metodo ${proteccion === pr ? 'es-activo' : ''}`}
              onClick={() => setProteccion(proteccion === pr ? null : pr)}
              aria-pressed={proteccion === pr}
            >
              {PROTECCION_INFO[pr].etiqueta}
            </button>
          ))}
        </div>
      </div>

      <div className="alta__campo">
        <label className="alta__label" htmlFor="ubi-notas">
          Notas <span className="alta__opcional">(opcional)</span>
        </label>
        <textarea
          id="ubi-notas"
          className="alta__input ficha-ubi__notas"
          rows={2}
          placeholder="Orientación, acceso al agua, lo que valga recordar…"
          value={notas}
          onChange={(ev) => setNotas(ev.target.value)}
        />
      </div>

      {ubicacion && (
        <button className="ficha-ubi__borrar" onClick={() => sinRomper(borrar())}>
          Borrar este lugar
        </button>
      )}
    </BottomSheet>
  )
}

const aTexto = (n?: number) => (n == null ? '' : String(n))

/** Del formulario al dato: solo las medidas del tipo elegido, y solo las que digan algo. */
function leerMedidas(campos: CampoMedida[], textos: TextosMedidas): MedidasUbicacion | undefined {
  const m: MedidasUbicacion = {}
  for (const c of campos) {
    const v = aMedida(textos[c])
    if (v != null) m[c] = v
  }
  return Object.keys(m).length ? m : undefined
}

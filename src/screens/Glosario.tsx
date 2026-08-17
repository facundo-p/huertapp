import type { ComponentType, ReactNode } from 'react'
import { Header } from '../components/Header'
import {
  GRUPOS,
  LUCES,
  SUELOS,
  IconoAlerta,
  IconoAlmacigo,
  IconoBajar,
  IconoCampana,
  IconoInstalar,
  IconoConfianza,
  IconoCosechar,
  IconoCuidado,
  IconoDesplegar,
  IconoFoto,
  IconoFuente,
  IconoNota,
  IconoPlaga,
  IconoRegar,
  IconoReloj,
  IconoSembrar,
  IconoTrasplantar,
  type IconProps,
} from '../icons'
import './Glosario.css'

interface Item {
  Icono: ComponentType<IconProps>
  nombre: string
  desc: string
  color?: string
}

const ACCIONES: Item[] = [
  { Icono: IconoSembrar, nombre: 'Sembrar', desc: 'Poner la semilla en tierra, directa o en almácigo.' },
  { Icono: IconoAlmacigo, nombre: 'Almácigo', desc: 'Cría protegida del plantín antes del lugar definitivo.' },
  { Icono: IconoTrasplantar, nombre: 'Trasplantar', desc: 'Mudar el plantín al bancal, maceta o cantero.' },
  { Icono: IconoCosechar, nombre: 'Cosechar', desc: 'La mejor parte. El canasto se llena solo (casi).' },
  { Icono: IconoRegar, nombre: 'Regar', desc: 'Agua: ni sed ni charco.' },
  { Icono: IconoPlaga, nombre: 'Plaga', desc: 'Bichos o enfermedades a vigilar.' },
  { Icono: IconoNota, nombre: 'Nota', desc: 'Apunte del diario de una planta.' },
  { Icono: IconoFoto, nombre: 'Foto', desc: 'Registro visual: el antes y después.' },
  { Icono: IconoAlerta, nombre: 'Alerta', desc: 'Advertencia: algo pide atención.' },
  { Icono: IconoFuente, nombre: 'Fuente', desc: 'De dónde sale el dato (INTA, UNLP…).' },
  { Icono: IconoConfianza, nombre: 'Confianza', desc: 'Qué tan respaldado está el dato (1 a 10).' },
  { Icono: IconoReloj, nombre: 'Ventana', desc: 'El tiempo ideal para algo se está por cerrar.' },
  { Icono: IconoCuidado, nombre: 'Cuidados', desc: 'Lo que hay que hacer mientras la planta crece.' },
  { Icono: IconoCampana, nombre: 'Aviso', desc: 'Notificación que te llega con la app cerrada.' },
  { Icono: IconoDesplegar, nombre: 'Desplegar', desc: 'Abre lo que está plegado. Girado, ya está abierto.' },
  { Icono: IconoBajar, nombre: 'Backup', desc: 'Bajar tus datos a un archivo, o traerlos de vuelta.' },
  { Icono: IconoInstalar, nombre: 'Instalar', desc: 'Dejar la app en la pantalla de inicio del celu.' },
]

const CONFIANZAS = [
  { clase: 'alta', rango: '8–10', desc: 'Fuentes oficiales o técnicas que concuerdan.' },
  { clase: 'media', rango: '5–7', desc: 'Fuente confiable única o leve discrepancia.' },
  { clase: 'baja', rango: '1–4', desc: 'Dato divulgativo o inferido: tomalo con pinzas.' },
  { clase: 'sin', rango: 's/d', desc: 'Sin dato confiable. Preferimos decirlo a inventar.' },
]

function Seccion({ titulo, retraso, children }: { titulo: string; retraso: number; children: ReactNode }) {
  return (
    <section className="glosario__seccion aparecer" style={{ '--retraso': `${retraso}s` } as React.CSSProperties}>
      <h2 className="seccion__titulo subrayado-onda">{titulo}</h2>
      {children}
    </section>
  )
}

function Fila({ Icono, nombre, desc, color }: Item) {
  return (
    <li className="glosario__fila">
      <span className="glosario__tile" style={color ? { color } : undefined} aria-hidden>
        <Icono size={26} />
      </span>
      <div>
        <p className="glosario__nombre">{nombre}</p>
        <p className="glosario__desc">{desc}</p>
      </div>
    </li>
  )
}

export function Glosario() {
  return (
    <div className="pantalla pantalla--detalle">
      <Header titulo="Glosario" sobretitulo="Íconos, colores y escala" volver />
      <div className="pantalla__cuerpo">
        <p className="glosario__intro">
          Toda la app habla con estos íconos. Acá está el diccionario completo, para cuando un dibujito no
          alcance.
        </p>

        <Seccion titulo="Grupos de especies" retraso={0.05}>
          <ul className="glosario__lista etiqueta">
            {Object.entries(GRUPOS).map(([g, info]) => (
              <Fila key={g} Icono={info.Icono} nombre={g} desc={descGrupo(g)} color={info.color} />
            ))}
          </ul>
        </Seccion>

        <Seccion titulo="Qué suelo pide" retraso={0.1}>
          <ul className="glosario__lista etiqueta">
            {Object.entries(SUELOS).map(([c, info]) => (
              <Fila key={c} Icono={info.Icono} nombre={nombreSuelo(c)} desc={descSuelo(c)} color={info.color} />
            ))}
          </ul>
        </Seccion>

        <Seccion titulo="Cuánto sol necesita" retraso={0.15}>
          <ul className="glosario__lista etiqueta">
            {Object.entries(LUCES).map(([c, info]) => (
              <Fila key={c} Icono={info.Icono} nombre={nombreLuz(c)} desc={descLuz(c)} color={info.color} />
            ))}
          </ul>
        </Seccion>

        <Seccion titulo="El calendario" retraso={0.2}>
          <div className="etiqueta glosario__calendario">
            <div className="glosario__celda-demo">
              <span className="celda celda--ideal" aria-hidden />
              <div>
                <p className="glosario__nombre">Mes ideal</p>
                <p className="glosario__desc">Verde y relleno: el mejor momento para sembrar.</p>
              </div>
            </div>
            <div className="glosario__celda-demo">
              <span className="celda celda--posible" aria-hidden />
              <div>
                <p className="glosario__nombre">Mes posible</p>
                <p className="glosario__desc">Amarillo y con anillo: se puede, pero no es lo óptimo.</p>
              </div>
            </div>
            <div className="glosario__celda-demo">
              <span className="celda celda--trasplante" aria-hidden />
              <div>
                <p className="glosario__nombre">Trasplante</p>
                <p className="glosario__desc">
                  La cinta baja terracota marca cuándo pasar el plantín al bancal.
                </p>
              </div>
            </div>
            <p className="glosario__desc glosario__nota-a11y">
              El color nunca viene solo: la forma (relleno, filete, altura de la barra) siempre acompaña.
            </p>
          </div>
        </Seccion>

        <Seccion titulo="Por qué cada mes va partido en tres" retraso={0.22}>
          <div className="etiqueta glosario__calendario">
            <p className="glosario__desc">
              No es lo mismo sembrar a principios de septiembre que a fines: el suelo está varios grados
              más frío y el riesgo de helada es mucho mayor. Por eso cada mes se muestra en tres
              <strong> décadas</strong> —principios, mediados y fines—, que es la unidad de los boletines
              agrometeorológicos del INTA.
            </p>

            <p className="glosario__nombre">De dónde sale esa precisión</p>
            <p className="glosario__desc">
              Las fuentes agronómicas hablan por mes, no por semana: pedirles más sería inventar. Los
              tercios salen de cruzar lo que dicen con dos series públicas: las normales climatológicas
              del <strong>SMN 1991-2020</strong> y la estadística de heladas de la <strong>FAUBA</strong>{' '}
              (umbral agrometeorológico de 3 °C, series de 50 a 63 años).
            </p>

            <p className="glosario__nombre">La regla que impide inventar</p>
            <p className="glosario__desc">
              El modelo <strong>solo puede recortar</strong> lo que dijeron las fuentes: nunca agrega una
              década fuera de los meses que ya habían habilitado. En el peor caso poda de más; jamás
              propone una ventana que nadie dijo.
            </p>

            <p className="glosario__nombre">Cuándo preferimos no afinar</p>
            <p className="glosario__desc">
              Ocho especies quedan a resolución mensual a propósito: las perennes leñosas (romero,
              lavanda, tomillo, salvia, orégano, laurel), donde en el GBA el límite no es el frío sino la
              humedad del verano, y las que gobierna el fotoperíodo más que la temperatura (eneldo, ajo,
              cebolla). Cada ficha lo dice. Un "sin afinar" honesto es mejor que una precisión falsa.
            </p>

            <p className="glosario__desc glosario__nota-a11y">
              Precisión honesta: <strong>±10 días</strong>. Y como la última helada cambia más de un mes
              entre el centro porteño y el periurbano, el calendario se corre según la zona que elijas en
              Ajustes.
            </p>
          </div>
        </Seccion>

        <Seccion titulo="Ciclo y acciones" retraso={0.25}>
          <ul className="glosario__lista etiqueta">
            {ACCIONES.map((item) => (
              <Fila key={item.nombre} {...item} />
            ))}
          </ul>
        </Seccion>

        <Seccion titulo="La escala de confianza" retraso={0.3}>
          <div className="etiqueta glosario__confianza">
            <p className="glosario__desc">
              Cada dato de una ficha lleva su índice: cuánto lo respaldan las fuentes consultadas.
            </p>
            <ul className="glosario__lista-conf">
              {CONFIANZAS.map(({ clase, rango, desc }) => (
                <li key={clase} className="glosario__fila-conf">
                  <span className={`badge-conf badge-conf--${clase}`}>{rango}</span>
                  <p className="glosario__desc">{desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </Seccion>
      </div>
    </div>
  )
}

function descGrupo(g: string): string {
  const d: Record<string, string> = {
    'Hortaliza de hoja': 'Lechuga, acelga, espinaca… se comen sus hojas.',
    'Hortaliza de raíz/bulbo': 'Zanahoria, cebolla, papa… el tesoro está abajo.',
    'Hortaliza de fruto': 'Tomate, zapallo, frutilla… frutos de la planta.',
    Legumbre: 'Chaucha, arveja, haba: vainas que fijan nitrógeno.',
    Aromática: 'Albahaca, romero, menta… perfume y sabor.',
    'Flor polinizadora': 'Caléndula, copete… traen abejas y espantan plagas.',
  }
  return d[g] ?? ''
}

function nombreSuelo(c: string): string {
  const d: Record<string, string> = {
    ARENOSO_DRENANTE: 'Arenoso / drenante',
    FRANCO_FERTIL: 'Franco fértil',
    HUMEDO_RICO: 'Húmedo y rico',
    PROFUNDO_SUELTO: 'Profundo y suelto',
    RUSTICO_TOLERANTE: 'Rústico / tolerante',
  }
  return d[c] ?? c
}

function descSuelo(c: string): string {
  const d: Record<string, string> = {
    ARENOSO_DRENANTE: 'Suelto y con drenaje libre: nada de charcos.',
    FRANCO_FERTIL: 'Equilibrado y con materia orgánica. El comodín.',
    HUMEDO_RICO: 'Muy rico y siempre húmedo, no se seca.',
    PROFUNDO_SUELTO: 'Mullido y sin piedras: clave para raíces.',
    RUSTICO_TOLERANTE: 'Se banca suelos pobres sin quejarse.',
  }
  return d[c] ?? ''
}

function nombreLuz(c: string): string {
  const d: Record<string, string> = {
    PLENO_SOL: 'Pleno sol',
    SOL_PARCIAL: 'Sol parcial',
    MEDIA_SOMBRA: 'Media sombra',
    TOLERA_SOMBRA: 'Tolera sombra',
  }
  return d[c] ?? c
}

function descLuz(c: string): string {
  const d: Record<string, string> = {
    PLENO_SOL: 'Seis horas o más de sol directo.',
    SOL_PARCIAL: 'Entre 4 y 6 horas de sol directo.',
    MEDIA_SOMBRA: 'Con 2 a 4 horas de sol ya está contenta.',
    TOLERA_SOMBRA: 'Crece con luz indirecta, sin sol directo.',
  }
  return d[c] ?? ''
}

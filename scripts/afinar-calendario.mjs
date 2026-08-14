/**
 * Afinado del calendario: de meses a décadas (tercios de mes).
 *
 * ── LA REGLA DE ORO ────────────────────────────────────────────────────────
 * El modelo SOLO PUEDE RECORTAR lo que dijeron las fuentes. Nunca agrega una
 * década fuera de los meses que la fuente ya había habilitado. Es lo que hace
 * imposible inventar una ventana de siembra: en el peor caso el modelo se
 * equivoca podando de más, nunca proponiendo algo que nadie dijo.
 *
 * ── Los tres criterios, por orden de solidez ───────────────────────────────
 *
 * A · HELADA — bien fundado. Puede DESCARTAR una década.
 *     Probabilidad de helada por década desde las fechas medias y desvíos de
 *     FAUBA (umbral agrometeorológico de 3 °C, series de 50-63 años).
 *
 * B · CRECIMIENTO — bien fundado. Puede DESCARTAR (fuera de tolerancia) o
 *     DEGRADAR de ideal a posible (fuera del rango ideal).
 *     `temperaturas.crecimiento` ya está expresado en temperatura DE AIRE, así
 *     que se compara directamente contra las normales del SMN. Sin supuestos.
 *
 * C · GERMINACIÓN — supuesto propio. Solo puede DEGRADAR, nunca descartar.
 *     `temperaturas.germinacion` es temperatura DE SUELO y no existen normales
 *     de suelo para el AMBA (ver clima-gba.mjs). Se usa la media del aire como
 *     aproximación grosera, y por eso su poder está limitado a degradar.
 *
 * ── Exenciones ─────────────────────────────────────────────────────────────
 * El almácigo protegido existe justamente para esquivar el frío: sería un error
 * grosero borrar las ventanas de almácigo invernal por riesgo de helada.
 *   · `almacigo` / `almacigo_protegido` → exentos de todo
 *   · `directa|almacigo` → exentos de descarte (queda la opción de almácigo),
 *                          pero pueden degradarse
 *   · `directa` / `plantacion` → se evalúan completos
 *   · trasplante → siempre a la intemperie, siempre se evalúa
 */

import {
  CLIMA,
  ZONAS,
  mesDeDecada,
  nivelRiesgo,
  riesgoHelada,
  tempAire,
  tempMaxima,
  tempMinima,
} from './clima-gba.mjs'

const NOMBRE_MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const TERCIO = ['principios', 'mediados', 'fines']

export function nombreDecada(d) {
  return `${TERCIO[(d - 1) % 3]} de ${NOMBRE_MES[mesDeDecada(d) - 1]}`
}

/**
 * Especies que el modelo no puede afinar bien y quedan a resolución mensual.
 * Un "sin afinar" honesto es mejor que una precisión falsa.
 */
export const SIN_AFINAR = {
  // Perennes leñosas: en GBA el invierno no las limita (toleran de -8 a -15 °C).
  // El límite real es la humedad estival, que este modelo no representa.
  romero: 'Perenne leñosa: en el GBA no la limita el frío sino la humedad del verano, que este modelo no mide.',
  lavanda: 'Perenne leñosa: la limita la humedad estival del GBA (72-76 % contra el 40-50 % que prefiere), no la temperatura.',
  tomillo: 'Perenne leñosa: tolera de sobra el invierno del GBA; lo que la complica es la humedad del verano.',
  salvia: 'Perenne leñosa: el invierno no la limita; en La Plata está documentada la antracnosis por humedad estival.',
  oregano: 'Perenne leñosa: tolera el invierno del GBA sin problema; el límite es la humedad, no el frío.',
  laurel: 'Perenne leñoso de crecimiento muy lento: la fecha exacta de plantación casi no incide.',
  // Fotoperiódicas: las gobierna la duración del día, no la temperatura.
  eneldo: 'Se va a flor por fotoperíodo (día largo, umbral crítico de 11-14 h), no por calor. La temperatura sola no explica su ventana.',
  ajo: 'La bulbificación la dispara el fotoperíodo, no la temperatura del suelo.',
  cebolla: 'Cultivo fotoperiódico clásico: el bulbo se forma por duración del día, según el tipo de variedad.',
}

/**
 * Ventanas con precisión sub-mensual dicha explícitamente por una fuente.
 * Mandan sobre el modelo: si alguien lo publicó, no hace falta estimarlo.
 * Las décadas van 1-36 (1 = principios de enero, 36 = fines de diciembre).
 */
export const FUENTE_EXPLICITA = {
  ajo: {
    nota: 'La Nación, sobre criterio INTA: "a partir de mediados de abril es el período ideal". Marzo y principios de abril quedan como posibles.',
    siembra_ideal: [11, 12],
    siembra_posible: [7, 8, 9, 10],
  },
  berenjena: {
    nota: 'Manual UNLu: "mediados de julio-agosto" para el almácigo protegido.',
    siembra_ideal: [20, 21, 22, 23, 24],
  },
  papa: {
    nota: 'UNLP: "más del 96 % de la superficie de Buenos Aires se planta entre octubre y noviembre" (papa semitardía). El modelo, por su lado, degrada agosto y septiembre porque la emergencia cae en riesgo de helada — que es exactamente lo que la papa semitardía viene a esquivar.',
    siembra_ideal: [28, 29, 30, 31, 32, 33],
  },
}

// Nota sobre albahaca: El Brote Urbano dice "trasplantar a mediados de
// septiembre-octubre" mientras que INTA dice "oct-nov". La discrepancia se
// resolvió en la capa de meses (septiembre entra como trasplante ideal, que es
// la unión de las dos fuentes) y se deja que el modelo la resuelva por zona:
// en CABA mediados de septiembre es viable, en Ezeiza la helada lo descarta.

const mesesADecadas = (meses) => meses.flatMap((m) => [m * 3 - 2, m * 3 - 1, m * 3])

/**
 * Margen de tolerancia al comparar temperaturas, en °C.
 * Una normal de 17,9 °C contra un óptimo de 18 °C no distingue nada: la
 * variabilidad interanual es mucho mayor que esa diferencia. Sin este margen
 * el modelo recorta por ruido y aparecen huecos absurdos en medio de una
 * ventana.
 */
const MARGEN = 1.5

/**
 * El rango ideal de crecimiento se compara con un margen mucho más ancho, de
 * 4 °C (~2 desvíos de la variabilidad interanual de las medias mensuales en
 * Buenos Aires). El motivo: la fuente ya eligió sus meses conociendo el clima
 * del GBA, así que corregirla por una diferencia de un grado es second-guessing
 * con una heurística grosera. Con el margen chico este criterio disparaba 103
 * veces y dejaba sin ninguna ventana a cultivos que justamente se hacen en
 * invierno, como la arveja y la frutilla. Solo salta ante desajustes groseros.
 */
const MARGEN_CRECIMIENTO = 4

/**
 * Cada criterio se evalúa en el momento del ciclo en que efectivamente actúa.
 * Anclarlos todos a la fecha de siembra hacía que el modelo contradijera a las
 * fuentes en los cultivos largos o de germinación lenta:
 *
 *   · GERMINACIÓN → la década de siembra. La semilla está en la tierra ahora.
 *   · HELADA      → la década de emergencia (+ dias_germinacion). Una semilla
 *                   enterrada no se hiela; la plántula que asoma, sí. Para el
 *                   trasplante no corre: el plantín sale a la intemperie ese
 *                   mismo día.
 *   · CRECIMIENTO → la mitad del ciclo (+ dias_germinacion + dias_a_cosecha/2).
 *                   El rango ideal describe la vida de la planta, no su primera
 *                   semana. Sin esto la sandía se quedaba sin ninguna ventana:
 *                   pide medias sobre 21 °C, que en el GBA recién llegan en
 *                   noviembre, aunque se siembre en octubre.
 */
function corrida(decada, dias) {
  const saltos = Math.round((dias ?? 0) / 10)
  return ((decada - 1 + saltos) % 36) + 1
}

function exencion(metodo) {
  if (metodo === 'almacigo' || metodo === 'almacigo_protegido') return 'total'
  if (metodo === 'directa|almacigo') return 'sin_descarte'
  return 'ninguna'
}

/**
 * Afina una especie para una zona.
 * Devuelve las cuatro listas de décadas y el registro de cada ajuste.
 */
function afinarZona(cal, temps, zona, diasGerminacion, diasACosecha) {
  const ajustes = []
  const registrar = (decada, regla, nota) => ajustes.push({ decada, regla, nota })

  const ideal = new Set(mesesADecadas(cal.fuente_meses.siembra_ideal))
  const posible = new Set(mesesADecadas(cal.fuente_meses.siembra_posible))
  const tIdeal = new Set(mesesADecadas(cal.fuente_meses.trasplante_ideal))
  const tPosible = new Set(mesesADecadas(cal.fuente_meses.trasplante_posible))

  const degradar = (d) => {
    ideal.delete(d)
    posible.add(d)
  }
  const descartar = (d) => {
    ideal.delete(d)
    posible.delete(d)
  }

  const { germinacion: g, crecimiento: c, helada } = temps
  // ciclos muy largos atraviesan todo el año: el rango ideal de crecimiento no
  // se puede juzgar desde un solo punto y el criterio no se aplica
  const cicloLargo = diasACosecha > 150

  // ── Siembra ───────────────────────────────────────────────────────────────
  for (const d of [...ideal, ...posible].sort((a, b) => a - b)) {
    const metodo = cal.metodo_por_mes[String(mesDeDecada(d))] ?? 'directa'
    const ex = exencion(metodo)
    if (ex === 'total') continue

    const eraIdeal = ideal.has(d)
    const e = corrida(d, diasGerminacion) // emergencia
    // Mitad del ciclo, pero con tope: pasados ~2 meses el cultivo atraviesa
    // estaciones enteras y un solo punto ya no lo representa (la frutilla, de
    // 150-240 días, inverna a propósito).
    const m = corrida(d, Math.min(diasGerminacion + diasACosecha / 2, 60))
    const media = tempAire(m, zona)

    // B · crecimiento fuera de tolerancia → la planta directamente no vive
    if (c.tolera_max != null && tempMaxima(m, zona) > c.tolera_max + MARGEN && ex === 'ninguna') {
      descartar(d)
      registrar(d, 'calor_extremo', `Sembrando a ${nombreDecada(d)} la planta crece con máximas de ${tempMaxima(m, zona)} °C, por encima de lo que tolera (${c.tolera_max} °C).`)
      continue
    }
    if (c.tolera_min != null && tempMinima(m, zona) < c.tolera_min - MARGEN && ex === 'ninguna') {
      descartar(d)
      registrar(d, 'frio_extremo', `Sembrando a ${nombreDecada(d)} la planta crece con mínimas de ${tempMinima(m, zona)} °C, bajo lo que tolera (${c.tolera_min} °C).`)
      continue
    }

    // A · helada, evaluada en la emergencia.
    // Guarda: una planta que tolera aire bajo cero no muere de helada, diga lo
    // que diga la etiqueta. En la frutilla `helada: 'sensible'` habla del daño
    // a la flor y al fruto, no de la planta, que aguanta -10 °C.
    const laMataElFrio = c.tolera_min == null || c.tolera_min > 0
    if (laMataElFrio && (helada === 'muere' || helada === 'sensible')) {
      const r = riesgoHelada(e, zona)
      const nivel = nivelRiesgo(r)
      if (helada === 'muere' && nivel === 'alto' && ex === 'ninguna') {
        descartar(d)
        registrar(d, 'helada', `Sembrando a ${nombreDecada(d)} emerge a ${nombreDecada(e)}, cuando todavía hay ${Math.round(r * 100)} % de probabilidad de helada — y la helada la mata.`)
        continue
      }
      // 'sensible' aguanta un raspón: solo degrada con riesgo alto
      const degradaPorHelada = helada === 'muere' ? nivel === 'alto' || nivel === 'medio' : nivel === 'alto'
      if (eraIdeal && degradaPorHelada) {
        degradar(d)
        registrar(d, 'helada_riesgo', `Emerge a ${nombreDecada(e)}, con ${Math.round(r * 100)} % de probabilidad de helada.`)
        continue
      }
    }

    // B · fuera del rango ideal de crecimiento → degrada
    if (!cicloLargo && eraIdeal && ideal.has(d) && c.ideal_min != null && media < c.ideal_min - MARGEN_CRECIMIENTO) {
      degradar(d)
      registrar(d, 'aire_fresco', `El grueso del ciclo transcurre a ${media} °C de media, por debajo de los ${c.ideal_min} °C que quiere para crecer.`)
      continue
    }
    if (!cicloLargo && eraIdeal && ideal.has(d) && c.ideal_max != null && media > c.ideal_max + MARGEN_CRECIMIENTO) {
      degradar(d)
      registrar(d, 'aire_caluroso', `El grueso del ciclo transcurre a ${media} °C de media, por encima de los ${c.ideal_max} °C que quiere para crecer.`)
      continue
    }

    // C · germinación (supuesto) → solo degrada
    if (eraIdeal && ideal.has(d) && g.min != null && tempAire(d, zona) < g.min - MARGEN) {
      degradar(d)
      registrar(d, 'suelo_frio', `Con ${tempAire(d, zona)} °C de media, el suelo de ${nombreDecada(d)} probablemente no llegue a los ${g.min} °C que necesita para germinar.`)
    }
  }

  // ── Trasplante: siempre a la intemperie ───────────────────────────────────
  for (const d of [...tIdeal, ...tPosible].sort((a, b) => a - b)) {
    if (helada !== 'muere' && helada !== 'sensible') continue
    if (c.tolera_min != null && c.tolera_min <= 0) continue // aguanta bajo cero
    const r = riesgoHelada(d, zona)
    const nivel = nivelRiesgo(r)
    if (helada === 'muere' && nivel === 'alto') {
      tIdeal.delete(d)
      tPosible.delete(d)
      registrar(d, 'helada_trasplante', `Trasplantar a ${nombreDecada(d)} expone el plantín a un ${Math.round(r * 100)} % de probabilidad de helada.`)
    } else if (tIdeal.has(d) && (nivel === 'alto' || (helada === 'muere' && nivel === 'medio'))) {
      tIdeal.delete(d)
      tPosible.add(d)
      registrar(d, 'helada_trasplante_riesgo', `${Math.round(r * 100)} % de probabilidad de helada a ${nombreDecada(d)}.`)
    }
  }

  // ── Suavizado: rellenar huecos de una sola década ────────────────────────
  // El clima es continuo: un hueco aislado en medio de una ventana es ruido de
  // umbral, no una señal. Se restauran solo los degradados por temperatura; los
  // recortes por helada se respetan siempre (y además son contiguos por
  // naturaleza, así que nunca dejan huecos de uno).
  const porHelada = new Set(ajustes.filter((a) => a.regla.startsWith('helada')).map((a) => a.decada))
  for (const d of [...posible]) {
    const antes = ((d - 2 + 36) % 36) + 1
    const despues = (d % 36) + 1
    if (ideal.has(antes) && ideal.has(despues) && !porHelada.has(d)) {
      posible.delete(d)
      ideal.add(d)
      const i = ajustes.findIndex((a) => a.decada === d)
      if (i >= 0) ajustes.splice(i, 1)
    }
  }

  return {
    decadas: {
      siembra_ideal: orden(ideal),
      siembra_posible: orden(posible),
      trasplante_ideal: orden(tIdeal),
      trasplante_posible: orden(tPosible),
    },
    ajustes,
  }
}

const orden = (set) => [...set].sort((a, b) => a - b)

/** Sin afinar: los meses de fuente se expanden a sus décadas y no se toca nada. */
function sinAfinar(cal) {
  return {
    siembra_ideal: mesesADecadas(cal.fuente_meses.siembra_ideal),
    siembra_posible: mesesADecadas(cal.fuente_meses.siembra_posible),
    trasplante_ideal: mesesADecadas(cal.fuente_meses.trasplante_ideal),
    trasplante_posible: mesesADecadas(cal.fuente_meses.trasplante_posible),
  }
}

function aplicarExplicita(decadas, manual) {
  const salida = { ...decadas }
  for (const campo of ['siembra_ideal', 'siembra_posible', 'trasplante_ideal', 'trasplante_posible']) {
    if (manual[campo]) salida[campo] = [...manual[campo]].sort((a, b) => a - b)
  }
  // ideal y posible no pueden solaparse
  const quitar = (a, b) => salida[a].filter((d) => !salida[b].includes(d))
  salida.siembra_posible = quitar('siembra_posible', 'siembra_ideal')
  salida.trasplante_posible = quitar('trasplante_posible', 'trasplante_ideal')
  return salida
}

/**
 * Confianza del afinado (1-10) según qué criterio decidió los recortes:
 * alto si mandó la helada (fuente sólida), medio si mandó la temperatura del
 * aire, bajo si mandó el supuesto de suelo.
 */
function confianzaAfinado(ajustes, estado) {
  if (estado === 'fuente_explicita') return 9
  if (estado === 'sin_afinar') return 5
  if (ajustes.length === 0) return 7
  const reglas = new Set(ajustes.map((a) => a.regla))
  if (reglas.has('suelo_frio')) return 6
  if (reglas.has('aire_fresco') || reglas.has('aire_caluroso')) return 7
  return 8
}

/**
 * Afina una especie en las tres zonas.
 * @param {string} slug
 * @param {object} cal  calendario del overlay (con fuente_meses)
 * @param {object} temps  temperaturas de la especie
 */
export function afinarEspecie(slug, cal, temps, diasGerminacion = null, diasACosecha = null) {
  // Para la helada se usa la emergencia MÁS TEMPRANA: es la que deja a la
  // plántula expuesta durante más tiempo, y ante la duda va el criterio
  // conservador. Para el ciclo se usa el punto medio del rango: el extremo
  // lento suele ser otra variedad, no la misma planta tardando más.
  const dias = diasGerminacion?.min ?? 7
  const cosecha = diasACosecha ? (diasACosecha.min + diasACosecha.max) / 2 : 60
  const manual = FUENTE_EXPLICITA[slug]
  const noAfinable = SIN_AFINAR[slug]

  const decadas = {}
  let ajustes = []
  let estado

  if (noAfinable && !manual) {
    estado = 'sin_afinar'
    for (const z of ZONAS) decadas[z] = sinAfinar(cal)
  } else if (noAfinable && manual) {
    estado = 'fuente_explicita'
    for (const z of ZONAS) decadas[z] = aplicarExplicita(sinAfinar(cal), manual)
  } else {
    estado = manual ? 'fuente_explicita' : 'afinado'
    for (const z of ZONAS) {
      const r = afinarZona(cal, temps, z, dias, cosecha)
      decadas[z] = manual ? aplicarExplicita(r.decadas, manual) : r.decadas
      if (z === 'conurbano') ajustes = r.ajustes
    }
  }

  // ── Regla de oro: verificar que no se agregó nada fuera de los meses fuente
  const mesesPermitidos = {
    siembra_ideal: new Set([...cal.fuente_meses.siembra_ideal, ...cal.fuente_meses.siembra_posible]),
    siembra_posible: new Set([...cal.fuente_meses.siembra_ideal, ...cal.fuente_meses.siembra_posible]),
    trasplante_ideal: new Set([...cal.fuente_meses.trasplante_ideal, ...cal.fuente_meses.trasplante_posible]),
    trasplante_posible: new Set([...cal.fuente_meses.trasplante_ideal, ...cal.fuente_meses.trasplante_posible]),
  }
  for (const z of ZONAS) {
    for (const [campo, permitidos] of Object.entries(mesesPermitidos)) {
      for (const d of decadas[z][campo]) {
        if (!permitidos.has(mesDeDecada(d))) {
          throw new Error(
            `REGLA DE ORO violada en ${slug}/${z}/${campo}: la década ${d} (${nombreDecada(d)}) cae en un mes que ninguna fuente habilitó.`,
          )
        }
      }
    }
  }

  return {
    decadas,
    afinado: {
      estado,
      motivo: noAfinable ?? null,
      nota_fuente: manual?.nota ?? null,
      ajustes,
      confianza: confianzaAfinado(ajustes, estado),
      zona_referencia: Object.fromEntries(ZONAS.map((z) => [z, CLIMA[z].estacion])),
    },
  }
}

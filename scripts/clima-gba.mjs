/**
 * Modelo climático del Gran Buenos Aires, por décadas (tercios de mes).
 *
 * TODAS las constantes de este archivo salen de fuentes publicadas y están
 * citadas acá abajo. Lo que es supuesto propio está marcado como SUPUESTO.
 *
 * ── Fuentes ────────────────────────────────────────────────────────────────
 * [SMN] Estadísticas Climatológicas Normales 1991-2020, Servicio Meteorológico
 *       Nacional. https://repositorio.smn.gob.ar/handle/20.500.12160/2506
 *       Temperatura media / máxima media / mínima media y días con helada
 *       (mínima ≤ 0 °C en abrigo a 1,5 m). Series de 30 años completos.
 *
 * [FAUBA] Portal "Heladas en la Argentina", CIAg — Facultad de Agronomía UBA.
 *       https://heladas.agro.uba.ar/  ·  Series de 50 a 63 años.
 *       Metodología: Fernández-Long, Barnatán, Dominici y Murphy (2016),
 *       "Información agroclimática de las heladas en la Argentina",
 *       Meteorologica 41(2): 7-31.
 *       Se usa el umbral de 3 °C ("helada agrometeorológica"): con 3 °C en
 *       abrigo la superficie del suelo llega a 0 °C. Es el umbral relevante
 *       para huerta, no el de 0 °C en abrigo.
 *
 * ── Lo que NO existe, y por eso no se modela ───────────────────────────────
 * No hay normales publicadas de temperatura de suelo a 5-10 cm para el AMBA:
 * el SMN no la mide en sus normales y no hay ningún trabajo argentino con el
 * rezago (días) ni el offset (°C) entre aire y suelo para la región pampeana.
 * Por eso este módulo NO estima temperatura de suelo. Ver `cotaSueloPrimavera`.
 */

// ── Geometría de la década ──────────────────────────────────────────────────
// 36 décadas al año: la 1 son los días 1-10 de enero, la 2 los 11-20, la 3 del
// 21 a fin de mes. Es la unidad de los boletines agrometeorológicos del INTA.

export const DIAS_MES = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export function decadaDe(mes, dia) {
  return (mes - 1) * 3 + (dia <= 10 ? 1 : dia <= 20 ? 2 : 3)
}

export function mesDeDecada(decada) {
  return Math.floor((decada - 1) / 3) + 1
}

/** 1 = principios, 2 = mediados, 3 = fines. */
export function tercioDeDecada(decada) {
  return ((decada - 1) % 3) + 1
}

/** Día del año (1-365) del centro de la década — el punto donde se evalúa. */
export function diaCentralDeDecada(decada) {
  const mes = mesDeDecada(decada)
  const tercio = tercioDeDecada(decada)
  const diaEnMes = tercio === 1 ? 5 : tercio === 2 ? 15 : Math.round((21 + DIAS_MES[mes - 1]) / 2)
  let dia = diaEnMes
  for (let m = 1; m < mes; m++) dia += DIAS_MES[m - 1]
  return dia
}

/** Día del año de una fecha "D-mmm" (ej. "5-oct"), para las fechas de helada. */
const MESES_ABR = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
function diaDelAnio(texto) {
  const [d, abr] = texto.split('-')
  const mes = MESES_ABR.indexOf(abr) + 1
  let dia = Number(d)
  for (let m = 1; m < mes; m++) dia += DIAS_MES[m - 1]
  return dia
}

// ── Zonas y sus estaciones de referencia ────────────────────────────────────
// El gradiente dentro del AMBA es enorme: 71 días entre la última helada
// agrometeorológica de Aeroparque y la de La Plata, y 12 veces más días de
// helada al año en Ezeiza que en el Observatorio. Un solo calendario para
// todo el GBA le erraría a media ciudad.

export const ZONAS = ['urbano', 'conurbano', 'periurbano']
export const ZONA_DEFAULT = 'conurbano'

export const CLIMA = {
  // CABA. Estación: BUENOS AIRES OBSERVATORIO (Villa Ortúzar), 34,590°S, 25 m.
  // Isla de calor: 1,0 día con helada al año contra 12,4 de Ezeiza.
  urbano: {
    etiqueta: 'Núcleo urbano',
    detalle: 'CABA y alrededores inmediatos, con isla de calor',
    estacion: 'Buenos Aires Observatorio (SMN) · Observatorio 3 °C (FAUBA)',
    // [SMN] ene → dic
    media: [24.9, 23.8, 22.0, 18.2, 14.8, 12.0, 11.0, 13.0, 14.9, 17.9, 20.9, 23.6],
    maxima: [30.1, 28.9, 27.0, 23.2, 19.4, 16.4, 15.5, 17.9, 19.7, 22.6, 26.0, 29.0],
    minima: [20.2, 19.4, 17.7, 14.1, 11.1, 8.4, 7.5, 8.9, 10.6, 13.4, 16.1, 18.5],
    diasHelada: [0, 0, 0, 0, 0.05, 0.4, 0.4, 0.2, 0, 0, 0, 0],
    diasHeladaAnual: 1.0, // [SMN] valor anual publicado, no la suma de los mensuales
    // [FAUBA] umbral 3 °C, Buenos Aires Observatorio, 1950-2012
    primeraHelada: '29-may',
    ultimaHelada: '6-sep',
    desvioPrimera: 21,
    desvioUltima: 23,
  },

  // Conurbano. Estación: EZEIZA AERO, 34,819°S, 20 m. Es el default: cubre el
  // grueso del GBA (San Martín, Quilmes, Morón, Ezeiza, Castelar).
  conurbano: {
    etiqueta: 'Conurbano',
    detalle: 'La mayor parte del GBA: Ezeiza, San Martín, Quilmes, Morón',
    estacion: 'Ezeiza Aero (SMN) · Ezeiza Aero 3 °C (FAUBA)',
    media: [24.1, 23.0, 21.0, 17.1, 13.6, 10.8, 9.8, 11.8, 13.8, 16.8, 20.0, 22.7],
    maxima: [30.3, 28.8, 26.8, 22.9, 19.0, 15.9, 15.0, 17.5, 19.3, 22.2, 25.8, 29.0],
    minima: [17.9, 17.1, 15.4, 11.8, 8.9, 6.1, 5.2, 6.6, 8.3, 11.2, 13.8, 16.2],
    diasHelada: [0, 0, 0, 0, 0.7, 3.0, 4.9, 3.0, 0.6, 0.1, 0.05, 0],
    diasHeladaAnual: 12.4,
    // [FAUBA] umbral 3 °C, Ezeiza Aero, 1956-2012
    primeraHelada: '29-abr',
    ultimaHelada: '5-oct',
    desvioPrimera: 16,
    desvioUltima: 23,
  },

  // Periurbano y rural. Estación: LA PLATA AERO, 34,966°S, 19 m.
  periurbano: {
    etiqueta: 'Periurbano o rural',
    detalle: 'La Plata, Cañuelas, Luján: campo abierto, hiela más y más tarde',
    estacion: 'La Plata Aero (SMN) · La Plata Aero 3 °C (FAUBA)',
    media: [23.1, 22.2, 20.2, 16.4, 13.0, 10.1, 9.2, 11.0, 12.8, 15.9, 18.8, 21.6],
    maxima: [28.9, 27.8, 25.8, 22.1, 18.2, 15.1, 14.2, 16.4, 18.1, 21.0, 24.4, 27.5],
    minima: [17.4, 16.9, 15.2, 11.7, 8.7, 6.0, 5.2, 6.3, 7.9, 10.7, 13.4, 15.8],
    diasHelada: [0, 0, 0, 0.05, 0.4, 3.0, 4.2, 2.5, 0.6, 0.1, 0, 0],
    diasHeladaAnual: 10.7,
    // [FAUBA] umbral 3 °C, La Plata Aero, 1961-2011
    primeraHelada: '4-may',
    ultimaHelada: '11-oct',
    desvioPrimera: 19,
    desvioUltima: 20,
  },
}

// ── Temperatura del aire por década ─────────────────────────────────────────
// Las normales del SMN son mensuales. Se interpolan linealmente entre los
// centros de mes (día 15) hasta el centro de cada década. Es interpolación,
// no invención: no agrega información, solo la reparte.

const DIA_CENTRO_MES = DIAS_MES.map((_, i) => {
  let d = 15
  for (let m = 0; m < i; m++) d += DIAS_MES[m]
  return d
})

function interpolarMensual(valores, diaObjetivo) {
  // encontrar los dos centros de mes que rodean al día, con vuelta de año
  for (let i = 0; i < 12; i++) {
    const a = DIA_CENTRO_MES[i]
    const b = i === 11 ? DIA_CENTRO_MES[0] + 365 : DIA_CENTRO_MES[i + 1]
    const d = diaObjetivo < a && i === 11 ? diaObjetivo + 365 : diaObjetivo
    if (d >= a && d <= b) {
      const t = (d - a) / (b - a)
      return valores[i] + t * (valores[(i + 1) % 12] - valores[i])
    }
  }
  // el tramo de enero anterior al día 15 cae entre diciembre y enero
  const a = DIA_CENTRO_MES[11] - 365
  const b = DIA_CENTRO_MES[0]
  const t = (diaObjetivo - a) / (b - a)
  return valores[11] + t * (valores[0] - valores[11])
}

export function tempAire(decada, zona = ZONA_DEFAULT) {
  return redondear(interpolarMensual(CLIMA[zona].media, diaCentralDeDecada(decada)))
}

export function tempMaxima(decada, zona = ZONA_DEFAULT) {
  return redondear(interpolarMensual(CLIMA[zona].maxima, diaCentralDeDecada(decada)))
}

export function tempMinima(decada, zona = ZONA_DEFAULT) {
  return redondear(interpolarMensual(CLIMA[zona].minima, diaCentralDeDecada(decada)))
}

/**
 * SUPUESTO PROPIO, sin fuente argentina que lo respalde.
 *
 * No existen normales de temperatura de suelo para el AMBA. Como cota
 * conservadora para decidir si una siembra directa germina, se usa la
 * temperatura media del aire de la década: en primavera el suelo a 5 cm,
 * a sol pleno, no está más frío que la media del aire (recibe radiación
 * directa y tiene inercia térmica que lo sostiene de noche). Es decir:
 * si ni siquiera la media del aire llega al mínimo de germinación, el suelo
 * tampoco. Al revés no vale, y por eso este criterio solo puede DESCARTAR
 * décadas, nunca habilitarlas.
 *
 * Referencia del orden de magnitud del efecto de la cobertura: Lardone,
 * Barraco y Díaz Zorita (INTA Gral. Villegas), suelo a 5 cm — hasta 3,4 °C
 * de diferencia entre suelo desnudo y cobertura completa.
 */
export function cotaSueloPrimavera(decada, zona = ZONA_DEFAULT) {
  return tempAire(decada, zona)
}

// ── Riesgo de helada por década ─────────────────────────────────────────────
// FAUBA publica la fecha media de primera y última helada con su desvío. Con
// eso, la probabilidad de que una fecha caiga dentro de la temporada de
// heladas es el producto de dos condiciones independientes:
//   P(la temporada ya empezó) × P(la temporada todavía no terminó)
// modeladas como normales, que es el supuesto de la propia metodología FAUBA.
// Verificación: Ezeiza, media 5-oct y σ 23 → percentil 20 % en 24-oct;
// FAUBA publica 26-oct. El supuesto de normalidad se sostiene.

/** Función de distribución acumulada normal estándar (Abramowitz-Stegun 7.1.26). */
function phi(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x))
  const d = 0.3989422804014327 * Math.exp((-x * x) / 2)
  const p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))))
  return x >= 0 ? 1 - p : p
}

/** Eje centrado en pleno invierno (1 de julio = 0) para evitar la vuelta de año. */
function diasDesdeJulio(diaAnio) {
  const JULIO_1 = 182
  let d = diaAnio - JULIO_1
  if (d > 182) d -= 365
  if (d < -183) d += 365
  return d
}

/**
 * Probabilidad (0-1) de que la fecha central de la década caiga dentro de la
 * temporada de heladas. Es la probabilidad de que a una plantita puesta en esa
 * década todavía le pueda tocar una helada.
 */
export function riesgoHelada(decada, zona = ZONA_DEFAULT) {
  const c = CLIMA[zona]
  const d = diasDesdeJulio(diaCentralDeDecada(decada))
  const primera = diasDesdeJulio(diaDelAnio(c.primeraHelada)) // otoño, negativo
  const ultima = diasDesdeJulio(diaDelAnio(c.ultimaHelada)) // primavera, positivo
  const empezo = phi((d - primera) / c.desvioPrimera)
  const noTermino = 1 - phi((d - ultima) / c.desvioUltima)
  return Math.round(empezo * noTermino * 1000) / 1000
}

/** Umbrales de decisión del afinado. */
export const RIESGO = { ALTO: 0.5, MEDIO: 0.2, BAJO: 0.05 }

export function nivelRiesgo(p) {
  if (p >= RIESGO.ALTO) return 'alto'
  if (p >= RIESGO.MEDIO) return 'medio'
  if (p >= RIESGO.BAJO) return 'bajo'
  return 'nulo'
}

// ── Fotoperíodo ─────────────────────────────────────────────────────────────
// Se calcula, no se cita: es astronomía. Latitud -34,6° (AMBA).
// Fórmulas estándar de declinación solar y ángulo horario del amanecer.

export const LATITUD = -34.6

export function horasLuz(decada) {
  const n = diaCentralDeDecada(decada)
  const rad = Math.PI / 180
  const declinacion = 23.45 * Math.sin(rad * ((360 * (284 + n)) / 365))
  const cosOmega = -Math.tan(rad * LATITUD) * Math.tan(rad * declinacion)
  const omega = Math.acos(Math.max(-1, Math.min(1, cosOmega))) / rad
  return Math.round(((2 * omega) / 15) * 100) / 100
}

function redondear(x) {
  return Math.round(x * 10) / 10
}

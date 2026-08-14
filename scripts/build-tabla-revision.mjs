// Genera data/REVISION_CALENDARIO.md: el calendario afinado en formato legible,
// para revisión humana antes de darlo por bueno.
// Uso: npm run data:revision
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { CLIMA, ZONAS, mesDeDecada, riesgoHelada, tempAire } from './clima-gba.mjs'
import { nombreDecada } from './afinar-calendario.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const db = JSON.parse(readFileSync(join(root, 'data/huerta_gba_enriquecido.json'), 'utf8'))

const INICIAL_MES = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
const GRUPOS = [
  'Hortaliza de hoja',
  'Hortaliza de raíz/bulbo',
  'Hortaliza de fruto',
  'Legumbre',
  'Aromática',
  'Flor polinizadora',
]
const ZONA_TABLA = 'conurbano'

const out = []
const w = (s = '') => out.push(s)

/** Celda de un mes: tres marcas, una por década. */
function celda(z, mes, campoIdeal, campoPosible) {
  const ideal = new Set(z[campoIdeal])
  const posible = new Set(z[campoPosible])
  let s = ''
  for (let t = 1; t <= 3; t++) {
    const d = (mes - 1) * 3 + t
    s += ideal.has(d) ? '●' : posible.has(d) ? '○' : '·'
  }
  return s
}

const tramoTexto = (ds) => (ds.length ? `${nombreDecada(ds[0])} → ${nombreDecada(ds[ds.length - 1])}` : '—')

// ── Encabezado ───────────────────────────────────────────────────────────────
w('# Revisión del calendario afinado por décadas')
w()
w('> **Cómo leer.** Cada mes se parte en tres décadas (principios · mediados · fines).')
w('> Dentro de la celda: **●** ideal · **○** se puede · **·** no.')
w(`> Las tablas muestran la zona **${CLIMA[ZONA_TABLA].etiqueta}** (${CLIMA[ZONA_TABLA].estacion}), que es la de referencia.`)
w('> Al final están los recortes que hizo el modelo, las especies que quedaron sin afinar y la comparación entre zonas.')
w('> Corregí lo que quieras acá mismo o decímelo por chat; después lo aplico sobre `data/enriquecimiento.json` o sobre las reglas del afinado y regenero todo.')
w()
w('## De dónde sale esto')
w()
w('**Regla de oro:** el modelo solo puede *recortar* lo que dijeron las fuentes. Nunca agrega una década fuera de los meses que la fuente ya había habilitado. En el peor caso poda de más; nunca inventa una ventana.')
w()
w('| Criterio | Qué puede hacer | Fuente |')
w('|---|---|---|')
w('| Riesgo de helada por década | descartar y degradar | FAUBA, umbral agrometeorológico de 3 °C, series de 50-63 años |')
w('| Rango de crecimiento (aire) | descartar si excede lo tolerado, degradar si sale del ideal por más de 4 °C | Normales SMN 1991-2020 |')
w('| Piso de germinación (suelo) | solo degradar | **supuesto propio**: no existen normales de suelo para el AMBA |')
w()
w('Cada criterio se evalúa en el momento del ciclo en que actúa: la germinación en la siembra, la helada en la emergencia (una semilla enterrada no se hiela), el crecimiento a mitad de ciclo. El almácigo protegido está exento del recorte por helada, que es justamente para lo que existe.')
w()
w('**Precisión honesta: ±10 días.** No existe ningún calendario de siembra argentino publicado con resolución sub-mensual (revisados ProHuerta, Cambio Rural y los calendarios provinciales del INTA, todos mensuales), así que esto no tiene antecedente citable: la trazabilidad del método es todo lo que hay.')
w()

// ── Tablas por grupo ─────────────────────────────────────────────────────────
for (const grupo of GRUPOS) {
  const especies = db.especies
    .filter((e) => e.grupo === grupo)
    .sort((a, b) => a.nombre_comun.localeCompare(b.nombre_comun, 'es'))
  if (!especies.length) continue

  w(`## ${grupo} (${especies.length})`)
  w()
  w(`| Especie | ${INICIAL_MES.join(' | ')} | Estado | Conf |`)
  w(`|---|${'---|'.repeat(12)}---|:-:|`)
  for (const e of especies) {
    const z = e.calendario.decadas[ZONA_TABLA]
    const celdas = Array.from({ length: 12 }, (_, i) => celda(z, i + 1, 'siembra_ideal', 'siembra_posible'))
    const a = e.calendario.afinado
    const estado = a.estado === 'afinado' ? `afinado (${a.ajustes.length})` : a.estado.replace('_', ' ')
    w(`| **${e.nombre_comun}** | ${celdas.join(' | ')} | ${estado} | ${a.confianza} |`)
  }
  w()

  const conTrasplante = especies.filter((e) => {
    const z = e.calendario.decadas[ZONA_TABLA]
    return z.trasplante_ideal.length + z.trasplante_posible.length > 0
  })
  if (conTrasplante.length) {
    w('<details><summary>Trasplante de este grupo</summary>')
    w()
    w(`| Especie | ${INICIAL_MES.join(' | ')} |`)
    w(`|---|${'---|'.repeat(12)}`)
    for (const e of conTrasplante) {
      const z = e.calendario.decadas[ZONA_TABLA]
      const celdas = Array.from({ length: 12 }, (_, i) => celda(z, i + 1, 'trasplante_ideal', 'trasplante_posible'))
      w(`| **${e.nombre_comun}** | ${celdas.join(' | ')} |`)
    }
    w()
    w('</details>')
    w()
  }
}

// ── Qué recortó el modelo ────────────────────────────────────────────────────
w('---')
w()
w('## Qué recortó el modelo')
w()
w('Cada línea es una década que el afinado sacó o degradó respecto de lo que decía la fuente. Es la lista para vetar caso por caso.')
w()
const conAjustes = db.especies.filter((e) => e.calendario.afinado.ajustes.length > 0)
w(`Son ${conAjustes.length} especies con recortes; las otras ${db.especies.length - conAjustes.length} quedaron tal cual las dejó la fuente.`)
w()
for (const e of conAjustes) {
  w(`### ${e.nombre_comun}`)
  w()
  const f = e.calendario.fuente_meses
  w(`Fuente: siembra ideal en los meses ${f.siembra_ideal.join(', ') || '—'} · confianza del calendario ${e.calendario.confianza}/10`)
  w()
  w('| Década | Regla | Por qué |')
  w('|---|---|---|')
  for (const a of e.calendario.afinado.ajustes) {
    w(`| ${nombreDecada(a.decada)} | \`${a.regla}\` | ${a.nota} |`)
  }
  w()
}

// ── Sin afinar ───────────────────────────────────────────────────────────────
w('---')
w()
w('## Especies sin afinar')
w()
w('El modelo no las representa bien, así que quedan a resolución mensual. Un "sin afinar" honesto es mejor que una precisión falsa.')
w()
w('| Especie | Por qué |')
w('|---|---|')
for (const e of db.especies) {
  if (e.calendario.afinado.estado !== 'sin_afinar') continue
  w(`| **${e.nombre_comun}** | ${e.calendario.afinado.motivo} |`)
}
w()

// ── Fuente explícita ─────────────────────────────────────────────────────────
const explicitas = db.especies.filter((e) => e.calendario.afinado.nota_fuente)
if (explicitas.length) {
  w('## Especies con precisión sub-mensual dicha por la fuente')
  w()
  w('Acá no hubo que estimar: alguien lo publicó. La cita manda sobre el modelo.')
  w()
  for (const e of explicitas) {
    w(`- **${e.nombre_comun}** — ${e.calendario.afinado.nota_fuente}`)
  }
  w()
}

// ── Comparación entre zonas ──────────────────────────────────────────────────
w('---')
w()
w('## Cuánto cambia según la zona')
w()
w('| Zona | Estación de referencia | Última helada (3 °C) | Días de helada/año |')
w('|---|---|---|---|')
for (const z of ZONAS) {
  w(`| **${CLIMA[z].etiqueta}** | ${CLIMA[z].estacion} | ${CLIMA[z].ultimaHelada} | ${CLIMA[z].diasHeladaAnual} |`)
}
w()
w('Entre el Observatorio y La Plata hay 35 días de diferencia en la última helada agrometeorológica, y doce veces más días de helada al año. (En el extremo, tomando Aeroparque en vez del Observatorio, la brecha dentro del AMBA llega a 71 días.) Estas son las especies donde más se nota:')
w()
w('| Especie | Núcleo urbano | Conurbano | Periurbano |')
w('|---|---|---|---|')
const sensibles = db.especies
  .filter((e) => e.temperaturas.helada === 'muere')
  .map((e) => {
    const rangos = ZONAS.map((z) => tramoTexto(e.calendario.decadas[z].siembra_ideal))
    return { e, rangos, difiere: new Set(rangos).size > 1 }
  })
  .filter((x) => x.difiere)
for (const { e, rangos } of sensibles) {
  w(`| **${e.nombre_comun}** | ${rangos[0]} | ${rangos[1]} | ${rangos[2]} |`)
}
w()

// ── El modelo en crudo ───────────────────────────────────────────────────────
w('---')
w()
w('<details><summary>El modelo climático, década por década</summary>')
w()
w('| Década | Media urbano | Media conurbano | Media periurbano | Helada urbano | Helada conurbano | Helada periurbano |')
w('|---|--:|--:|--:|--:|--:|--:|')
for (let d = 1; d <= 36; d++) {
  const t = ZONAS.map((z) => tempAire(d, z).toFixed(1))
  const r = ZONAS.map((z) => `${Math.round(riesgoHelada(d, z) * 100)} %`)
  w(`| ${nombreDecada(d)} | ${t.join(' | ')} | ${r.join(' | ')} |`)
}
w()
w('</details>')
w()

writeFileSync(join(root, 'data/REVISION_CALENDARIO.md'), out.join('\n'))
console.log(`OK: data/REVISION_CALENDARIO.md (${out.length} líneas, ${conAjustes.length} especies con recortes)`)

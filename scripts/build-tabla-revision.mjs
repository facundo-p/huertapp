// Genera data/REVISION_CALENDARIO.md desde data/huerta_gba_enriquecido.json:
// la tabla especie × 12 meses para revisión manual del calendario derivado.
// Uso: npm run data:tabla  (correr después de data:build)
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const db = JSON.parse(readFileSync(join(root, 'data/huerta_gba_enriquecido.json'), 'utf8'))
const overlay = JSON.parse(readFileSync(join(root, 'data/enriquecimiento.json'), 'utf8'))

const MESES = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
const GRUPOS = [
  'Hortaliza de hoja',
  'Hortaliza de raíz/bulbo',
  'Hortaliza de fruto',
  'Legumbre',
  'Aromática',
  'Flor polinizadora',
]
const METODO_ABREV = {
  directa: 'directa',
  almacigo: 'almácigo',
  'directa|almacigo': 'directa o almácigo',
  almacigo_protegido: 'almácigo protegido',
  plantacion: 'plantación',
}

const rango = (r) => (r ? (r.min === r.max ? `~${r.min}` : `${r.min}-${r.max}`) : '—')

function celda(cal, mes) {
  let s = ''
  if (cal.siembra_ideal.includes(mes)) s += '●'
  else if (cal.siembra_posible.includes(mes)) s += '○'
  if (cal.trasplante_ideal.includes(mes)) s += '▲'
  else if (cal.trasplante_posible.includes(mes)) s += '△'
  return s || ' '
}

function metodoResumen(cal) {
  const usados = [...new Set(Object.values(cal.metodo_por_mes))]
  return usados.map((m) => METODO_ABREV[m]).join(' · ')
}

let md = `# Revisión del calendario derivado — Fase 0

> **Cómo leer:** por celda-mes: **●** siembra ideal · **○** siembra posible · **▲** trasplante ideal · **△** trasplante posible.
> Meses E(ne)…D(ic). **Días** = a trasplante / a cosecha / de germinación (desde siembra; — = sin dato confiable).
> Corregí lo que quieras acá mismo o decímelo por chat; después aplico los cambios a \`data/enriquecimiento.json\` y regenero todo.

Convenciones usadas: estaciones hemisferio sur (primavera = sep-nov); heladas GBA ~jun-sep, última ~sep; donde la fuente no separa ideal/posible quedó todo en **ideal** y está anotado.

`

for (const grupo of GRUPOS) {
  const especies = db.especies.filter((e) => e.grupo === grupo)
  md += `\n## ${grupo} (${especies.length})\n\n`
  md += `| Especie | ${MESES.join(' | ')} | Método | Días T / C / G | Conf |\n`
  md += `|---|${MESES.map(() => ':-:').join('|')}|---|---|:-:|\n`
  for (const e of especies) {
    const cal = e.calendario
    const celdas = Array.from({ length: 12 }, (_, i) => celda(cal, i + 1))
    const dias = `${rango(e.dias_a_trasplante)} / ${rango(e.dias_a_cosecha)} / ${rango(e.dias_germinacion)}`
    md += `| **${e.nombre_comun}** | ${celdas.join(' | ')} | ${metodoResumen(cal)} | ${dias} | ${cal.confianza} |\n`
  }
  md += `\n<details><summary>Derivaciones de ${grupo.toLowerCase()}</summary>\n\n`
  for (const e of especies) {
    md += `- **${e.nombre_comun}** (\`${e.slug}\`): ${e.calendario.derivacion}\n`
  }
  md += `\n</details>\n`
}

// Temperaturas
const HELADA_TXT = {
  muere: '☠️ la mata',
  sensible: '⚠️ la daña',
  tolera: '✔️ la aguanta',
  mejora: '⭐ la mejora',
}
const tramo = (a, b) => (a == null && b == null ? '—' : a == null ? `≤${b}` : b == null ? `≥${a}` : a === b ? `${a}` : `${a}–${b}`)

md += `\n## 🌡️ Temperaturas (°C)\n\n`
md += `> **Germinación** = temperatura del suelo (mínima · ideal · máxima). **Crecimiento** = temperatura del aire (tolera · ideal · tolera).\n> **Helada**: cómo responde al frío del GBA. Conf = confianza del dato.\n\n`
for (const grupo of GRUPOS) {
  const especies = db.especies.filter((e) => e.grupo === grupo)
  md += `\n### ${grupo}\n\n`
  md += `| Especie | Germina (suelo) | Ideal germ. | Crece ideal (aire) | Tolera | Helada | Conf |\n|---|:-:|:-:|:-:|:-:|---|:-:|\n`
  for (const e of especies) {
    const t = e.temperaturas
    if (!t) continue
    const g = t.germinacion
    const c = t.crecimiento
    md += `| **${e.nombre_comun}** | ${tramo(g.min, g.max)} | ${tramo(g.ideal_min, g.ideal_max)} | ${tramo(c.ideal_min, c.ideal_max)} | ${tramo(c.tolera_min, c.tolera_max)} | ${t.helada ? HELADA_TXT[t.helada] : '—'} | ${t.confianza} |\n`
  }
  md += `\n<details><summary>Notas de ${grupo.toLowerCase()}</summary>\n\n`
  for (const e of especies) {
    if (e.temperaturas?.nota) md += `- **${e.nombre_comun}**: ${e.temperaturas.nota}\n`
  }
  md += `\n</details>\n`
}

// Flags de revisión manual
const flags = Object.entries(overlay).filter(([, v]) => v.revisar?.length)
if (flags.length) {
  md += `\n## ⚠️ Puntos que piden tu criterio\n\n`
  for (const [slug, v] of flags) {
    const e = db.especies.find((x) => x.slug === slug)
    for (const nota of v.revisar) md += `- **${e.nombre_comun}**: ${nota}\n`
  }
}

// Asociaciones externas (sin slug en la base)
const externas = new Map()
for (const e of db.especies) {
  for (const tipo of ['buenas', 'malas']) {
    for (const a of e.asociaciones[tipo]) {
      if (a.externa) {
        if (!externas.has(a.etiqueta)) externas.set(a.etiqueta, [])
        externas.get(a.etiqueta).push(`${e.nombre_comun} (${tipo === 'buenas' ? '+' : '−'})`)
      }
    }
  }
}
md += `\n## Asociaciones "externas" (no resuelven a una especie de la base)\n\nSe muestran como chips no navegables. Avisame si alguna debería mapearse a especies concretas.\n\n`
for (const [etiqueta, quienes] of [...externas.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  md += `- **${etiqueta}** ← ${quienes.join(', ')}\n`
}

// Especies sin separación ideal/posible
const sinSeparar = db.especies.filter((e) => e.calendario.siembra_posible.length === 0)
md += `\n## Especies con todo en "ideal" (la fuente no permitió separar)\n\n${sinSeparar.map((e) => e.nombre_comun).join(' · ')}\n`

writeFileSync(join(root, 'data/REVISION_CALENDARIO.md'), md)
console.log(`OK: tabla de revisión → data/REVISION_CALENDARIO.md (${db.especies.length} especies, ${flags.length} con flags)`)

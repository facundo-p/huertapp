// Mergea los JSON de investigación de temperaturas (uno por familia) dentro de
// data/enriquecimiento.json, validando el schema antes de escribir.
// Uso: node scripts/merge-temperaturas.mjs <archivo.json> [...]
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const overlayPath = join(root, 'data/enriquecimiento.json')
const overlay = JSON.parse(readFileSync(overlayPath, 'utf8'))

const CLAVES_G = ['min', 'ideal_min', 'ideal_max', 'max']
const CLAVES_C = ['ideal_min', 'ideal_max', 'tolera_min', 'tolera_max']
const HELADAS = ['muere', 'sensible', 'tolera', 'mejora']

const errores = []
let aplicadas = 0

for (const archivo of process.argv.slice(2)) {
  const datos = JSON.parse(readFileSync(archivo, 'utf8'))
  for (const [slug, t] of Object.entries(datos)) {
    if (!overlay[slug]) {
      errores.push(`${archivo}: slug desconocido "${slug}"`)
      continue
    }
    // normaliza: todas las claves presentes, faltantes en null
    const germinacion = Object.fromEntries(CLAVES_G.map((k) => [k, t.germinacion?.[k] ?? null]))
    const crecimiento = Object.fromEntries(CLAVES_C.map((k) => [k, t.crecimiento?.[k] ?? null]))

    const ordenado = (xs) => xs.every((x, i) => i === 0 || xs[i - 1] <= x)
    const escalaG = [germinacion.min, germinacion.ideal_min, germinacion.ideal_max, germinacion.max].filter((v) => v !== null)
    const escalaC = [crecimiento.tolera_min, crecimiento.ideal_min, crecimiento.ideal_max, crecimiento.tolera_max].filter((v) => v !== null)
    if (!ordenado(escalaG)) errores.push(`${slug}: germinación desordenada [${escalaG}]`)
    if (!ordenado(escalaC)) errores.push(`${slug}: crecimiento desordenado [${escalaC}]`)
    if (t.helada != null && !HELADAS.includes(t.helada)) errores.push(`${slug}: helada inválida "${t.helada}"`)
    if (!t.nota || t.nota.length < 10) errores.push(`${slug}: nota vacía o muy corta`)
    if (!t.fuentes?.length) errores.push(`${slug}: sin fuentes`)
    for (const f of t.fuentes ?? []) {
      if (!/^https?:\/\//.test(f.url ?? '')) errores.push(`${slug}: fuente sin URL válida (${f.titulo})`)
    }
    if (!(t.confianza >= 1 && t.confianza <= 10)) errores.push(`${slug}: confianza fuera de 1-10`)

    overlay[slug].temperaturas = {
      germinacion,
      crecimiento,
      helada: t.helada ?? null,
      nota: t.nota,
      fuentes: t.fuentes,
      confianza: t.confianza,
    }
    aplicadas++
  }
}

const faltantes = Object.keys(overlay).filter((s) => !overlay[s].temperaturas)
if (faltantes.length) errores.push(`Especies sin temperaturas: ${faltantes.join(', ')}`)

if (errores.length) {
  console.error('❌ No se escribió nada:\n' + errores.join('\n'))
  process.exit(1)
}

writeFileSync(overlayPath, JSON.stringify(overlay, null, 2))
console.log(`OK: temperaturas de ${aplicadas} especies → data/enriquecimiento.json`)

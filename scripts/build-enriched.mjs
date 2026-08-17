// Mergea data/huerta_gba.json (fuente) + data/enriquecimiento.json (overlay derivado,
// corregible a mano) → data/huerta_gba_enriquecido.json (lo que consume la app).
// Uso: npm run data:build
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { slugify } from './slugs.mjs'
import { afinarEspecie } from './afinar-calendario.mjs'
import { CLIMA, ZONAS, ZONA_DEFAULT, riesgoHelada, tempAire, tempMaxima, tempMinima } from './clima-gba.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const fuente = JSON.parse(readFileSync(join(root, 'data/huerta_gba.json'), 'utf8'))
const overlay = JSON.parse(readFileSync(join(root, 'data/enriquecimiento.json'), 'utf8'))

const errores = []
const slugsFuente = new Map(fuente.especies.map((e) => [slugify(e.nombre_comun), e]))

/**
 * Las prácticas de manejo que la app sabe nombrar. Es vocabulario cerrado a
 * propósito: cada tipo tiene su explicación en el glosario, así que uno nuevo
 * acá sin su entrada allá dejaría una etiqueta que no se puede consultar.
 */
const TIPOS_CUIDADO = [
  'raleo',
  'aporque',
  'tutorado',
  'poda',
  'mulch',
  'blanqueo',
  'riego',
  'abonado',
  'desmalezar',
  'rotacion',
  'polinizacion',
  'proteger',
  'contener',
  'dividir',
]

/**
 * Un cuidado no trae fuentes propias: **hereda** las del campo de la fuente
 * del que sale (`de`). Es la regla 1 del proyecto hecha mecánica — si el
 * cuidado no se puede apoyar en algo que ya dijo una fuente investigada, el
 * build no compila y no hay forma de colar una recomendación inventada.
 */
function resolverCuidados(slug, cuidados, base) {
  return (cuidados ?? []).map((c, i) => {
    const donde = `${slug} · cuidado ${i + 1} (${c.tipo})`
    if (!TIPOS_CUIDADO.includes(c.tipo)) {
      errores.push(`${donde}: tipo desconocido. Los válidos: ${TIPOS_CUIDADO.join(', ')}`)
    }
    const campo = base[c.de]
    if (!campo?.fuentes || typeof campo.confianza !== 'number') {
      errores.push(`${donde}: \`de: "${c.de}"\` no es un campo con fuentes de la especie`)
      return c
    }
    // No alcanza con que el campo exista: hay campos de la fuente que quedaron
    // sin URL (repollo/riesgos, por ejemplo). Apoyar un consejo ahí sería
    // inventar con un paso intermedio.
    if (!campo.fuentes.length) {
      errores.push(`${donde}: \`${c.de}\` de esta especie no tiene ni una fuente con URL`)
    }
    if (!c.cuando || !c.que_hacer) errores.push(`${donde}: le falta \`cuando\` o \`que_hacer\``)
    return {
      tipo: c.tipo,
      cuando: c.cuando,
      que_hacer: c.que_hacer,
      por_que: c.por_que ?? null,
      de: c.de,
      fuentes: campo.fuentes,
      confianza: campo.confianza,
    }
  })
}

for (const slug of Object.keys(overlay)) {
  if (!slugsFuente.has(slug)) errores.push(`Slug del overlay sin especie en la fuente: ${slug}`)
}
for (const slug of slugsFuente.keys()) {
  if (!overlay[slug]) errores.push(`Especie de la fuente sin entrada en el overlay: ${slug}`)
}
if (errores.length) {
  console.error(errores.join('\n'))
  process.exit(1)
}

const especies = fuente.especies.map((e) => {
  const slug = slugify(e.nombre_comun)
  const { revisar, transplante_signos, cuidados, ...derivado } = overlay[slug]
  const base = transplante_signos
    ? { ...e, transplante: { ...e.transplante, signos_listo: transplante_signos } }
    : e

  // El afinado a décadas se genera acá: no vive en el overlay hecho a mano
  // porque es derivado, y así siempre se puede regenerar desde cero.
  const { decadas, afinado } = afinarEspecie(
    slug,
    derivado.calendario,
    derivado.temperaturas,
    derivado.dias_germinacion,
    derivado.dias_a_cosecha,
  )

  return {
    slug,
    ...base,
    ...derivado,
    calendario: { ...derivado.calendario, decadas, afinado },
    cuidados: resolverCuidados(slug, cuidados, base),
  }
})

// segunda pasada: los cuidados se validan recién acá, cuando ya se resolvió
// contra qué campo de la fuente se apoya cada uno
if (errores.length) {
  console.error(errores.join('\n'))
  process.exit(1)
}

const salida = {
  meta: {
    ...fuente.meta,
    enriquecido: {
      descripcion:
        'calendario en dos capas (fuente_meses = lo que dicen las fuentes, por mes; decadas = afinado a tercios de mes por zona, generado), temperaturas (germinación de suelo y crecimiento de aire, con fuentes propias), dias_a_trasplante, dias_a_cosecha, dias_germinacion y asociaciones resueltas a slugs. Derivado de los textos de la fuente; correcciones en data/enriquecimiento.json.',
      convenciones:
        'Meses 1-12. Décadas 1-36 (tercios de mes: 1 = días 1-10 de enero). Estaciones hemisferio sur: verano dic-feb, otoño mar-may, invierno jun-ago, primavera sep-nov. Rango {min,max} en días; null = sin dato confiable.',
      afinado_por_decadas:
        'El afinado solo puede recortar lo que dijeron las fuentes, nunca agregar décadas fuera de sus meses. Criterio principal: probabilidad de helada por década (FAUBA, umbral agrometeorológico de 3 °C, series de 50-63 años), evaluada en la fecha de emergencia y no en la de siembra. Criterios secundarios: rango de crecimiento contra las normales del SMN 1991-2020 y, como supuesto propio declarado, la media del aire como cota del suelo para germinar. Precisión honesta: ±10 días.',
      zonas: Object.fromEntries(
        Object.entries(CLIMA).map(([z, c]) => [
          z,
          { etiqueta: c.etiqueta, detalle: c.detalle, estacion: c.estacion, ultima_helada: c.ultimaHelada },
        ]),
      ),
      zona_default: ZONA_DEFAULT,
      // Tabla climática por década y zona, para que la app pueda diagnosticar
      // en el aparato (por qué tarda una germinación, si hay riesgo de helada
      // esta semana) sin recalcular el modelo ni pedir nada por red.
      // 36 décadas x 3 zonas x 4 valores: pesa nada y evita duplicar lógica.
      clima: Object.fromEntries(
        ZONAS.map((z) => [
          z,
          Array.from({ length: 36 }, (_, i) => ({
            media: tempAire(i + 1, z),
            max: tempMaxima(i + 1, z),
            min: tempMinima(i + 1, z),
            helada: riesgoHelada(i + 1, z),
          })),
        ]),
      ),
    },
  },
  campos_schema: fuente.campos_schema,
  categorias_suelo: fuente.categorias_suelo,
  categorias_luz: fuente.categorias_luz,
  especies,
}

const destino = join(root, 'data/huerta_gba_enriquecido.json')
const texto = JSON.stringify(salida, null, 2)

// `--check` no escribe: compara. Lo corre `npm test` antes de los tests para
// atajar el error silencioso más caro de este repo: tocar el overlay a mano,
// olvidarse de regenerar, y quedarse mirando una app y unos tests que siguen
// leyendo el JSON viejo sin que nada avise.
if (process.argv.includes('--check')) {
  const actual = readFileSync(destino, 'utf8')
  if (actual !== texto) {
    console.error(
      'data/huerta_gba_enriquecido.json quedó desactualizado respecto de sus fuentes.\n' +
        'Regeneralo con:  npm run data:build',
    )
    process.exit(1)
  }
  console.log('OK: el JSON generado está al día')
} else {
  writeFileSync(destino, texto)
  console.log(`OK: ${especies.length} especies → data/huerta_gba_enriquecido.json`)
}

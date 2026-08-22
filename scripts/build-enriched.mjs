// Mergea data/huerta_gba.json (fuente) + data/enriquecimiento.json (overlay derivado,
// corregible a mano) → data/huerta_gba_enriquecido.json (lo que consume la app).
// Uso: npm run data:build
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { slugify } from './slugs.mjs'
import { afinarEspecie } from './afinar-calendario.mjs'
import { validarRecorte } from './validar-variedades.mjs'
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
 * Por qué esta semilla puede no estar germinando, cuando la respuesta depende
 * de la especie: que el berro necesita luz, que la zanahoria tarda veinte
 * días, que la melisa germina al 30 % de fábrica.
 */
const TIPOS_PISTA = [
  'profundidad',
  'luz',
  'humedad',
  'pretratamiento',
  'paciencia',
  'varias',
  'poder',
  'latencia',
  'vegetativo',
]

/**
 * Ni un cuidado ni una pista traen fuentes propias: **heredan** las del campo
 * de la fuente del que salen (`de`). Es la regla 1 del proyecto hecha mecánica
 * — si no se puede apoyar en algo que ya dijo una fuente investigada, el build
 * no compila, y no hay forma de colar una recomendación inventada.
 */
function conRespaldo(donde, item, base, obligatorios) {
  const campo = base[item.de]
  if (!campo?.fuentes || typeof campo.confianza !== 'number') {
    errores.push(`${donde}: \`de: "${item.de}"\` no es un campo con fuentes de la especie`)
    return null
  }
  // No alcanza con que el campo exista: hay campos de la fuente que quedaron
  // sin URL (repollo/riesgos, por ejemplo). Apoyar un consejo ahí sería
  // inventar con un paso intermedio.
  if (!campo.fuentes.length) {
    errores.push(`${donde}: \`${item.de}\` de esta especie no tiene ni una fuente con URL`)
  }
  for (const c of obligatorios) {
    if (!item[c]) errores.push(`${donde}: le falta \`${c}\``)
  }
  return { fuentes: campo.fuentes, confianza: campo.confianza }
}

function resolverCuidados(slug, cuidados, base) {
  return (cuidados ?? []).map((c, i) => {
    const donde = `${slug} · cuidado ${i + 1} (${c.tipo})`
    if (!TIPOS_CUIDADO.includes(c.tipo)) {
      errores.push(`${donde}: tipo desconocido. Los válidos: ${TIPOS_CUIDADO.join(', ')}`)
    }
    const respaldo = conRespaldo(donde, c, base, ['cuando', 'que_hacer'])
    if (!respaldo) return c
    return {
      tipo: c.tipo,
      cuando: c.cuando,
      que_hacer: c.que_hacer,
      por_que: c.por_que ?? null,
      de: c.de,
      ...respaldo,
    }
  })
}

function resolverPistas(slug, pistas, base) {
  return (pistas ?? []).map((p, i) => {
    const donde = `${slug} · pista ${i + 1} (${p.tipo})`
    if (!TIPOS_PISTA.includes(p.tipo)) {
      errores.push(`${donde}: tipo desconocido. Los válidos: ${TIPOS_PISTA.join(', ')}`)
    }
    const respaldo = conRespaldo(donde, p, base, ['texto'])
    if (!respaldo) return p
    return { tipo: p.tipo, texto: p.texto, de: p.de, ...respaldo }
  })
}

const REGIMENES_RIEGO = ['escaso', 'espaciado', 'parejo', 'constante']

/** Un campo con fuente pero sin URL sería una cita falsa que pasa cualquier test. */
function citable(donde, dato) {
  if (!Array.isArray(dato.fuentes) || !dato.fuentes.length) {
    errores.push(`${donde}: sin ninguna fuente con URL`)
  } else if (dato.fuentes.some((f) => !/^https?:\/\//.test(f.url ?? ''))) {
    errores.push(`${donde}: alguna fuente sin URL válida`)
  }
  if (typeof dato.confianza !== 'number' || dato.confianza < 1 || dato.confianza > 10) {
    errores.push(`${donde}: confianza fuera de 1-10`)
  }
}

function resolverRiego(slug, dato, regimen) {
  if (!dato) {
    if (regimen) errores.push(`${slug}: riego_regimen sin campo \`riego\` en la base`)
    return null
  }
  citable(`${slug} · riego`, dato)
  if (regimen && !REGIMENES_RIEGO.includes(regimen)) {
    errores.push(`${slug}: régimen "${regimen}" no es uno de ${REGIMENES_RIEGO.join(', ')}`)
  }
  return { ...dato, regimen: regimen ?? null }
}

function resolverMaceta(slug, dato, medidas) {
  if (!dato) {
    if (medidas) errores.push(`${slug}: maceta_medidas sin campo \`maceta\` en la base`)
    return null
  }
  citable(`${slug} · maceta`, dato)
  const m = { profundidad_min_cm: null, litros_min: null, plantas_por_contenedor: null, ...medidas }
  for (const [k, v] of Object.entries(m)) {
    if (v !== null && !(typeof v === 'number' && v > 0)) {
      errores.push(`${slug} · maceta: ${k} tiene que ser un número mayor a 0, o null`)
    }
  }
  if (Object.values(m).every((v) => v === null)) {
    errores.push(`${slug} · maceta: las tres medidas en null. Si no hay ninguna, sacá el campo`)
  }
  return { ...dato, medidas: m }
}

/**
 * Una variedad se escribe como el conjunto de campos en los que difiere, y acá
 * se expande a una especie completa que hereda el resto del padre. No es una
 * copia: si mañana se corrige el padre, las derivadas se corrigen solas.
 */
function expandirVariedades(padre, citables, derivado) {
  const refs = []
  const hijas = []

  for (const v of citables ?? []) {
    const clave = slugify(v.nombre)
    const donde = `${padre.slug} · variedad "${v.nombre}"`
    const over = (derivado ?? {})[clave]
    if (!over) {
      errores.push(`${donde}: sin entrada "${clave}" en variedades_derivado del overlay`)
      continue
    }

    const difiere = v.difiere_en ?? {}
    const quita = over.cuidados_quita ?? []
    // El diff es la decisión. Y a veces el diff es lo que la variedad NO lleva:
    // al tomate determinado lo define que no se tutora, no un dato nuevo.
    if (!Object.keys(difiere).length && !quita.length) {
      errores.push(`${donde}: sin \`difiere_en\` ni \`cuidados_quita\`. Si no difiere en nada, no es una variedad aparte`)
    }
    for (const [campo, dato] of Object.entries(difiere)) {
      if (!(campo in padre)) errores.push(`${donde}: \`${campo}\` no es un campo de la especie`)
      else citable(`${donde} · ${campo}`, dato)
    }
    // Sacarle un cuidado a una variedad es un paso de razonamiento sobre el
    // texto del padre, no una cita. Va declarado como tal o no va.
    if (!over.derivacion) errores.push(`${donde}: le falta \`derivacion\``)

    for (const t of quita) {
      if (!padre.cuidados.some((c) => c.tipo === t)) {
        errores.push(`${donde}: quita el cuidado "${t}", que el padre no tiene`)
      }
    }

    // Un cuidado o una pista heredan las fuentes del campo del que salen (`de`).
    // Si la variedad override ese campo, las de la variedad son otras: heredar
    // las del padre dejaría un consejo citando una fuente que ya no es la suya.
    const reanclar = (item) =>
      difiere[item.de]
        ? { ...item, fuentes: difiere[item.de].fuentes, confianza: difiere[item.de].confianza }
        : item

    const cuidados = padre.cuidados.filter((c) => !quita.includes(c.tipo)).map(reanclar)
    if (!cuidados.length) errores.push(`${donde}: se queda sin ningún cuidado`)

    const slug = `${padre.slug}-${clave}`
    const nombreBase = padre.nombre_comun.split(/[/(]/)[0].trim()
    const nombre_comun = over.nombre_comun ?? `${nombreBase} ${v.nombre.toLowerCase()}`

    const hija = {
      ...padre,
      ...difiere,
      slug,
      nombre_comun,
      variedad_de: padre.slug,
      variedad: v.nombre,
      variedad_derivacion: over.derivacion ?? null,
      variedades: [],
      cuidados,
      germinacion_pistas: padre.germinacion_pistas.map(reanclar),
      calendario: over.calendario ? { ...padre.calendario, ...over.calendario } : padre.calendario,
      dias_a_cosecha: over.dias_a_cosecha ?? padre.dias_a_cosecha,
      dias_a_trasplante: over.dias_a_trasplante ?? padre.dias_a_trasplante,
      dias_germinacion: over.dias_germinacion ?? padre.dias_germinacion,
    }
    errores.push(...validarRecorte(padre, hija))

    // El afinado corre igual que para cualquier especie: la derivada tiene su
    // propio calendario y merece su propia lectura del clima.
    const { decadas, afinado } = afinarEspecie(
      slug,
      hija.calendario,
      hija.temperaturas,
      hija.dias_germinacion,
      hija.dias_a_cosecha,
    )
    hija.calendario = { ...hija.calendario, decadas, afinado }

    hijas.push(hija)
    refs.push({
      slug,
      nombre: v.nombre,
      nombre_comun,
      cambia: Object.entries(difiere).map(([campo, d]) => ({
        campo,
        valor: d.valor,
        confianza: d.confianza,
      })),
      quita,
      derivacion: over.derivacion ?? '',
    })
  }

  for (const clave of Object.keys(derivado ?? {})) {
    if (!(citables ?? []).some((v) => slugify(v.nombre) === clave)) {
      errores.push(`${padre.slug}: variedades_derivado tiene "${clave}" sin variedad citable que lo respalde`)
    }
  }

  return { refs, hijas }
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

const especies = []
for (const e of fuente.especies) {
  const slug = slugify(e.nombre_comun)
  // riego_regimen, maceta_medidas y variedades_derivado se llaman distinto que
  // sus campos de la base a propósito: el merge de abajo es shallow y una clave
  // `riego` o `variedades` en el overlay pisaría el dato citable entero,
  // fuentes incluidas, sin que nada avise.
  const {
    revisar,
    transplante_signos,
    cuidados,
    germinacion_pistas,
    riego_regimen,
    maceta_medidas,
    variedades_derivado,
    ...derivado
  } = overlay[slug]
  // `variedades` sale acá porque lo consume expandirVariedades; en la especie
  // queda la versión resuelta (refs), que es la que la ficha sabe dibujar.
  const { variedades: variedadesCitables, ...campos } = e
  const base = transplante_signos
    ? { ...campos, transplante: { ...campos.transplante, signos_listo: transplante_signos } }
    : campos

  // El afinado a décadas se genera acá: no vive en el overlay hecho a mano
  // porque es derivado, y así siempre se puede regenerar desde cero.
  const { decadas, afinado } = afinarEspecie(
    slug,
    derivado.calendario,
    derivado.temperaturas,
    derivado.dias_germinacion,
    derivado.dias_a_cosecha,
  )

  const padre = {
    slug,
    ...base,
    ...derivado,
    calendario: { ...derivado.calendario, decadas, afinado },
    cuidados: resolverCuidados(slug, cuidados, base),
    germinacion_pistas: resolverPistas(slug, germinacion_pistas, base),
    riego: resolverRiego(slug, e.riego, riego_regimen),
    maceta: resolverMaceta(slug, e.maceta, maceta_medidas),
    variedad_de: null,
    variedad: null,
    variedad_derivacion: null,
    variedades: [],
  }

  const { refs, hijas } = expandirVariedades(padre, variedadesCitables, variedades_derivado)
  padre.variedades = refs
  especies.push(padre, ...hijas)
}

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

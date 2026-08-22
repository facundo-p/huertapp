# Variedades por especie — plan de implementación

> **Para quien lo ejecute:** SUB-SKILL REQUERIDA: usar `superpowers:subagent-driven-development` (recomendado) o `superpowers:executing-plans` para implementar tarea por tarea. Los pasos usan checkbox (`- [ ]`) para seguimiento.

**Objetivo:** que una variedad se escriba como el conjunto de campos en los que difiere de su especie, y que el build la expanda a entrada propia — de modo que los avisos de Mi huerta salgan según la variedad que la persona cargó.

**Arquitectura:** la variedad tiene las mismas dos capas que la especie (citable en `huerta_gba.json`, interpretación en `enriquecimiento.json`) y solo escribe el diff. `scripts/build-enriched.mjs` la expande a una `EspecieEnriquecida` completa que hereda todo del padre. Río abajo nada cambia: el motor de tareas, el estimador y la ficha resuelven por `porSlug` y reciben un registro completo.

**Stack:** TypeScript + React + Vite, vitest para unitarios, Playwright para e2e. Sin librerías de UI. Los datos son JSON generados por scripts en Node.

**Spec:** `docs/superpowers/specs/2026-08-21-variedades-por-especie-design.md`

## Restricciones globales

- **No se inventan datos agronómicos.** Todo `valor` sale textual de la prosa ya investigada del padre. Ningún número se calcula: se parte de un rango que el padre ya publica.
- **El afinado solo recorta.** Una variedad no puede tener un mes de siembra o trasplante fuera de los del padre, ni días fuera del rango del padre.
- **Todo texto de UI en español rioplatense, con vos.** "Fijate", "sembrá", "tenés".
- **Identificadores y comentarios en español.** Los comentarios explican por qué, no qué, en las menos palabras posibles.
- **Accesibilidad:** contraste AA, targets de 44 px, el color nunca como único canal.
- **Sin colores sueltos:** todo color de texto sale de un token de `src/theme.css`.
- **Después de tocar cualquier fuente de datos: `npm run data:build`.** `npm test` corre `--check` antes y falla si te olvidaste.
- **`data/huerta_gba_enriquecido.json` nunca se edita a mano.** Hay un hook que lo bloquea.
- **Nunca se corrige un dato para que el modelo climático quede contento.** Si el afinado contradice a la fuente, gana la fuente y se arregla el modelo por `/modelo-clima`.
- Rama: `data/variedades-por-especie`. PR contra `staging` con `Closes #8`.

## Estructura de archivos

| Archivo | Responsabilidad | Tareas |
|---|---|---|
| `src/lib/data/types.ts` | tipos `VariedadRef` y campos nuevos de `EspecieEnriquecida` | 1 |
| `scripts/build-enriched.mjs` | expansión de variedades + las seis validaciones | 1, 2, 3 |
| `data/huerta_gba.json` | `variedades[]` citable por especie | 1, 3, 4 |
| `data/enriquecimiento.json` | `variedades_derivado` por especie | 1, 3, 4 |
| `src/lib/data/especies.ts` | `IndiceEspecies.padres`, búsqueda por nombre de variedad | 1, 6 |
| `tests/variedades.test.ts` | las seis validaciones sobre datos reales | 1, 2, 3, 4 |
| `src/screens/Explorar.tsx` | grilla de padres, marca de variedades, buscador | 1, 6 |
| `src/components/EspecieCard.tsx` | la marca "2 variedades" | 6 |
| `src/screens/FichaEspecie.tsx` | sección Variedades + línea de procedencia | 7, 8 |
| `src/components/Variedades.tsx` (nuevo) | la sección de variedades del padre | 7 |
| `src/components/AltaPlanta.tsx` | elegir variedad al dar de alta | 9 |
| `src/lib/huerta/tipos.ts` | `Planta.variedad?: string` | 9 |
| `src/screens/Calendario.tsx` | plegado de derivadas bajo el padre | 10 |

---

## Task 1: Tipos, expansión del build, y la coliflor como primer caso

Es la tarea más grande a propósito: la expansión no se puede testear sin un dato que expandir, y la coliflor es el caso más duro (override de calendario **y** de días). Si esto funciona, el resto son datos.

**Files:**
- Modify: `src/lib/data/types.ts`
- Modify: `scripts/build-enriched.mjs`
- Modify: `data/huerta_gba.json` (entrada `Coliflor`)
- Modify: `data/enriquecimiento.json` (entrada `coliflor`)
- Modify: `src/lib/data/especies.ts:29-52` (`IndiceEspecies` e `indexar`)
- Modify: `src/screens/Explorar.tsx:43,121`
- Modify: `tests/data/enriquecido.test.ts:41-46`
- Test: `tests/variedades.test.ts` (nuevo)

**Interfaces:**
- Produces:
  - `VariedadRef { slug, nombre, nombre_comun, cambia: {campo,valor,confianza}[], quita: TipoCuidado[], derivacion }`
  - `EspecieEnriquecida.variedad_de: string | null`
  - `EspecieEnriquecida.variedad: string | null`
  - `EspecieEnriquecida.variedad_derivacion: string | null`
  - `EspecieEnriquecida.variedades: VariedadRef[]`
  - `IndiceEspecies.padres: EspecieEnriquecida[]`

- [ ] **Paso 1: Escribir el test que falla**

Crear `tests/variedades.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import enriquecido from '../data/huerta_gba_enriquecido.json'
import type { EspecieEnriquecida } from '../src/lib/data/types'

const ESPECIES = (enriquecido as unknown as { especies: EspecieEnriquecida[] }).especies
const porSlug = new Map(ESPECIES.map((e) => [e.slug, e]))
const derivadas = ESPECIES.filter((e) => e.variedad_de)
const padres = ESPECIES.filter((e) => !e.variedad_de)

describe('variedades derivadas', () => {
  it('la coliflor se parte en temprana y tardía', () => {
    const t = porSlug.get('coliflor-temprana')
    const d = porSlug.get('coliflor-tardia')
    expect(t?.nombre_comun).toBe('Coliflor temprana')
    expect(d?.nombre_comun).toBe('Coliflor tardía')
    expect(t?.variedad_de).toBe('coliflor')
    expect(t?.variedad).toBe('Temprana')
  })

  it('cada derivada parte el rango de días del padre, nunca lo calcula', () => {
    // Es la regla 2 en esta capa: sin esto, convertir unidades entre dos
    // fuentes y publicar el resultado como dato pasa sin que nadie lo vea.
    for (const v of derivadas) {
      const padre = porSlug.get(v.variedad_de!)!
      for (const campo of ['dias_a_cosecha', 'dias_a_trasplante', 'dias_germinacion'] as const) {
        const hijo = v[campo]
        const base = padre[campo]
        if (!hijo) continue
        expect(base, `${v.slug} · ${campo}: el padre no publica rango`).not.toBeNull()
        expect(hijo.min, `${v.slug} · ${campo}`).toBeGreaterThanOrEqual(base!.min)
        expect(hijo.max, `${v.slug} · ${campo}`).toBeLessThanOrEqual(base!.max)
      }
    }
  })

  it('cada derivada recorta los meses del padre, nunca le agrega', () => {
    for (const v of derivadas) {
      const padre = porSlug.get(v.variedad_de!)!
      for (const capa of ['siembra', 'trasplante'] as const) {
        const union = (e: EspecieEnriquecida) =>
          new Set([...e.calendario.fuente_meses[`${capa}_ideal`], ...e.calendario.fuente_meses[`${capa}_posible`]])
        const suyos = union(v)
        const delPadre = union(padre)
        for (const m of suyos) {
          expect([...delPadre], `${v.slug} · ${capa}: mes ${m} no está en el padre`).toContain(m)
        }
      }
    }
  })

  it('el padre conoce a sus derivadas y ninguna queda huérfana', () => {
    for (const v of derivadas) {
      const padre = porSlug.get(v.variedad_de!)
      expect(padre, `${v.slug}: padre inexistente`).toBeDefined()
      expect(padre!.variedades.map((r) => r.slug), v.slug).toContain(v.slug)
    }
    for (const p of padres) {
      for (const ref of p.variedades) expect(porSlug.has(ref.slug), ref.slug).toBe(true)
    }
  })

  it('la derivada hereda del padre lo que no override', () => {
    const t = porSlug.get('coliflor-temprana')!
    const padre = porSlug.get('coliflor')!
    expect(t.temperaturas).toEqual(padre.temperaturas)
    expect(t.suelo).toEqual(padre.suelo)
    expect(t.asociaciones).toEqual(padre.asociaciones)
    expect(t.nombre_cientifico).toBe(padre.nombre_cientifico)
  })

  it('la coliflor temprana tiene su propio calendario y sus propios días', () => {
    const t = porSlug.get('coliflor-temprana')!
    const d = porSlug.get('coliflor-tardia')!
    expect(t.calendario.fuente_meses.siembra_ideal).toEqual([10])
    expect(t.calendario.fuente_meses.siembra_posible).toEqual([11, 12])
    expect(d.calendario.fuente_meses.siembra_ideal).toEqual([3, 4])
    expect(t.dias_a_cosecha).toEqual({ min: 90, max: 90 })
    expect(d.dias_a_cosecha).toEqual({ min: 200, max: 200 })
  })

  it('toda derivada explica por qué difiere', () => {
    for (const v of derivadas) {
      expect(v.variedad_derivacion, v.slug).toBeTruthy()
      expect(v.variedad_derivacion!.length, v.slug).toBeGreaterThan(20)
    }
  })
})
```

- [ ] **Paso 2: Correr el test y verificar que falla**

Ejecutar: `npx vitest run tests/variedades.test.ts`
Esperado: FAIL — `coliflor-temprana` no existe, y `e.variedad_de` no está en el tipo.

- [ ] **Paso 3: Sumar los tipos**

En `src/lib/data/types.ts`, antes de `EspecieEnriquecida`:

```ts
/**
 * Lo que el padre necesita saber de una variedad para dibujar su tarjeta sin
 * tener que cargar la derivada entera.
 */
export interface VariedadRef {
  slug: string
  /** el nombre corto, como lo escribe la fuente: "Temprana", "De enrame" */
  nombre: string
  nombre_comun: string
  /** los campos en los que difiere, ya resueltos para mostrar */
  cambia: { campo: string; valor: string; confianza: number }[]
  /** los cuidados del padre que esta variedad no lleva */
  quita: TipoCuidado[]
  derivacion: string
}
```

Y dentro de `EspecieEnriquecida`, al final:

```ts
  /** slug del padre; null en las 55 especies propiamente dichas */
  variedad_de: string | null
  /** el nombre de la variedad ("Temprana"); null si no lo es */
  variedad: string | null
  /** por qué difiere del padre. Es razonamiento, no cita: por eso va acá y no en un `valor` */
  variedad_derivacion: string | null
  /** las variedades de esta especie; vacío en las derivadas */
  variedades: VariedadRef[]
```

- [ ] **Paso 4: Cargar la coliflor en la capa citable**

En `data/huerta_gba.json`, dentro de la especie `Coliflor`, sumar la clave `variedades` al mismo nivel que `cosecha`. **Los `valor` son recortes textuales de la prosa que ya está en `fecha_siembra` y `cosecha` del padre — no se reescribe nada.**

```jsonc
"variedades": [
  {
    "nombre": "Temprana",
    "difiere_en": {
      "fecha_siembra": {
        "valor": "Variedades tempranas: almácigo de octubre a diciembre, trasplante de diciembre a enero, cosecha de marzo a abril.",
        "fuentes": [
          { "titulo": "¿Cómo cultivar Coliflor?", "url": "https://www.elbroteurbano.com/como-cultivar-coliflor/", "organizacion": "El Brote Urbano" }
        ],
        "confianza": 7
      },
      "cosecha": {
        "valor": "Variedades tempranas: aproximadamente 90 días desde el almácigo/trasplante.",
        "fuentes": [
          { "titulo": "¿Cómo cultivar Coliflor?", "url": "https://www.elbroteurbano.com/como-cultivar-coliflor/", "organizacion": "El Brote Urbano" }
        ],
        "confianza": 7
      }
    }
  },
  {
    "nombre": "Tardía",
    "difiere_en": {
      "fecha_siembra": {
        "valor": "Variedades tardías: almácigo de marzo a abril, trasplante de mayo a junio, cosecha de agosto a septiembre.",
        "fuentes": [
          { "titulo": "¿Cómo cultivar Coliflor?", "url": "https://www.elbroteurbano.com/como-cultivar-coliflor/", "organizacion": "El Brote Urbano" }
        ],
        "confianza": 7
      },
      "cosecha": {
        "valor": "Variedades tardías: aproximadamente 200 días.",
        "fuentes": [
          { "titulo": "¿Cómo cultivar Coliflor?", "url": "https://www.elbroteurbano.com/como-cultivar-coliflor/", "organizacion": "El Brote Urbano" }
        ],
        "confianza": 7
      }
    }
  }
]
```

**Por qué la fuente es solo El Brote Urbano y no las dos del padre:** INTA agrupa brócoli/coliflor y no distingue variedades. La separación la afirma una sola fuente, y la cita tiene que decir eso.

- [ ] **Paso 5: Cargar la coliflor en el overlay**

En `data/enriquecimiento.json`, dentro de `"coliflor"`, sumar:

```jsonc
"variedades_derivado": {
  "temprana": {
    "nombre_comun": "Coliflor temprana",
    "derivacion": "El Brote Urbano separa tempranas de tardías. Los meses salen textuales de esa frase y se quedan dentro de los del padre, conservando su jerarquía (octubre ya era ideal; noviembre y diciembre, posibles). Los 90 días parten el rango 90-200 que el padre ya publica: no hay ninguna cuenta nueva.",
    "calendario": {
      "fuente_meses": {
        "siembra_ideal": [10],
        "siembra_posible": [11, 12],
        "trasplante_ideal": [1, 12],
        "trasplante_posible": []
      },
      "metodo_por_mes": { "10": "almacigo", "11": "almacigo", "12": "almacigo" },
      "derivacion": "De fecha_siembra, El Brote Urbano: tempranas almácigo oct-dic, trasplante dic-ene. Se conserva la jerarquía del padre en cada mes.",
      "confianza": 7
    },
    "dias_a_cosecha": { "min": 90, "max": 90 }
  },
  "tardia": {
    "nombre_comun": "Coliflor tardía",
    "derivacion": "Misma fuente que la temprana, la otra mitad de la frase: almácigo mar-abr, trasplante may-jun, ~200 días. Los meses y los días quedan dentro de los del padre.",
    "calendario": {
      "fuente_meses": {
        "siembra_ideal": [3, 4],
        "siembra_posible": [],
        "trasplante_ideal": [5, 6],
        "trasplante_posible": []
      },
      "metodo_por_mes": { "3": "almacigo", "4": "almacigo" },
      "derivacion": "De fecha_siembra, El Brote Urbano: tardías almácigo mar-abr, trasplante may-jun.",
      "confianza": 7
    },
    "dias_a_cosecha": { "min": 200, "max": 200 }
  }
}
```

- [ ] **Paso 6: Implementar la expansión en el build**

En `scripts/build-enriched.mjs`, después de `resolverMaceta` y antes del loop de chequeo de slugs, agregar:

```js
/**
 * Una variedad se escribe como el conjunto de campos en los que difiere, y acá
 * se expande a una especie completa que hereda todo lo demás del padre. No es
 * una copia: si mañana se corrige el padre, las derivadas se corrigen solas.
 */
function expandirVariedades(padre, citables, derivado) {
  const refs = []
  const hijas = []

  for (const v of citables ?? []) {
    const clave = slugify(v.nombre)
    const donde = `${padre.slug} · variedad "${v.nombre}"`
    const over = (derivado ?? {})[clave]
    if (!over) {
      errores.push(`${donde}: no tiene entrada "${clave}" en variedades_derivado del overlay`)
      continue
    }

    const difiere = v.difiere_en ?? {}
    const quita = over.cuidados_quita ?? []
    // El diff es la decisión: sin diferencia citada ni cuidado quitado, la
    // variedad no se separa de su especie.
    if (!Object.keys(difiere).length && !quita.length) {
      errores.push(`${donde}: sin \`difiere_en\` ni \`cuidados_quita\`. Si no difiere en nada, no va como variedad`)
    }
    for (const [campo, dato] of Object.entries(difiere)) {
      if (!(campo in padre)) errores.push(`${donde}: \`${campo}\` no es un campo de la especie`)
      citable(`${donde} · ${campo}`, dato)
    }
    // Es razonamiento, no cita: por eso se exige aparte del `valor`.
    if (!over.derivacion) errores.push(`${donde}: le falta \`derivacion\``)

    const cuidados = padre.cuidados.filter((c) => !quita.includes(c.tipo))
    for (const t of quita) {
      if (!padre.cuidados.some((c) => c.tipo === t)) {
        errores.push(`${donde}: quita el cuidado "${t}", que el padre no tiene`)
      }
    }
    if (!cuidados.length) errores.push(`${donde}: se queda sin ningún cuidado`)

    const slug = `${padre.slug}-${clave}`
    const nombre_comun = over.nombre_comun ?? `${padre.nombre_comun.split(/[/(]/)[0].trim()} ${v.nombre.toLowerCase()}`
    const calendario = over.calendario
      ? { ...padre.calendario, ...over.calendario }
      : padre.calendario

    const hija = {
      ...padre,
      ...difiere,
      slug,
      nombre_comun,
      variedad_de: padre.slug,
      variedad: v.nombre,
      variedad_derivacion: over.derivacion,
      variedades: [],
      cuidados,
      calendario,
      dias_a_cosecha: over.dias_a_cosecha ?? padre.dias_a_cosecha,
      dias_a_trasplante: over.dias_a_trasplante ?? padre.dias_a_trasplante,
      dias_germinacion: over.dias_germinacion ?? padre.dias_germinacion,
    }
    validarRecorte(donde, padre, hija)

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
      derivacion: over.derivacion,
    })
  }

  for (const clave of Object.keys(derivado ?? {})) {
    if (!(citables ?? []).some((v) => slugify(v.nombre) === clave)) {
      errores.push(`${padre.slug}: variedades_derivado tiene "${clave}" sin variedad citable que lo respalde`)
    }
  }

  return { refs, hijas }
}

/**
 * La regla 2 aplicada a esta capa: una variedad recorta lo que dijeron las
 * fuentes del padre, nunca le suma. Si necesita un mes o un día de más, el que
 * está mal es el padre y se corrige allá.
 */
function validarRecorte(donde, padre, hija) {
  for (const capa of ['siembra', 'trasplante']) {
    const del = (e) =>
      new Set([...e.calendario.fuente_meses[`${capa}_ideal`], ...e.calendario.fuente_meses[`${capa}_posible`]])
    const delPadre = del(padre)
    for (const m of del(hija)) {
      if (!delPadre.has(m)) errores.push(`${donde}: ${capa} en el mes ${m}, que el padre no tiene`)
    }
  }
  for (const campo of ['dias_a_cosecha', 'dias_a_trasplante', 'dias_germinacion']) {
    const r = hija[campo]
    const base = padre[campo]
    if (!r) continue
    if (!base) {
      errores.push(`${donde}: ${campo} con el padre en null. Los días se parten, no se inventan`)
    } else if (r.min < base.min || r.max > base.max) {
      errores.push(
        `${donde}: ${campo} ${r.min}-${r.max} se sale del ${base.min}-${base.max} del padre. No se calcula: se parte`,
      )
    }
  }
}
```

- [ ] **Paso 7: Conectar la expansión al armado de especies**

En `scripts/build-enriched.mjs`, en el destructuring del overlay (línea ~176), sumar `variedades_derivado`:

```js
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
```

Y reemplazar el `return` del `map` (líneas ~194-204) por un armado en dos pasos, cambiando `const especies = fuente.especies.map(...)` por:

```js
const especies = []
for (const e of fuente.especies) {
  // … todo el cuerpo actual hasta el objeto que hoy se retorna …
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
  // `variedades` sale de la base y no del overlay: es capa citable, cada una
  // con sus fuentes propias.
  const { refs, hijas } = expandirVariedades(padre, e.variedades, variedades_derivado)
  padre.variedades = refs
  especies.push(padre, ...hijas)
}
```

**Ojo:** `e.variedades` viene de la base, así que hay que sacarlo de `base` antes del spread para que no quede duplicado sin resolver. Justo después de calcular `base`, agregar:

```js
  // el array citable ya lo consume expandirVariedades; en la especie queda la
  // versión resuelta (`refs`), que es la que la ficha sabe dibujar
  delete base.variedades
```

- [ ] **Paso 8: Regenerar y correr el test**

```bash
npm run data:build
npx vitest run tests/variedades.test.ts
```
Esperado: PASS, y el build imprime `OK: 57 especies`.

- [ ] **Paso 9: Separar padres de derivadas en el índice**

En `src/lib/data/especies.ts`, en `IndiceEspecies`:

```ts
export interface IndiceEspecies {
  db: EspeciesDB
  /** todas, variedades derivadas incluidas: es lo que resuelve `porSlug` */
  todas: EspecieEnriquecida[]
  /** las 55: lo que se lista en Explorar y en el Calendario */
  padres: EspecieEnriquecida[]
  porSlug: Map<string, EspecieEnriquecida>
  porGrupo: Map<Grupo, EspecieEnriquecida[]>
  textoBusqueda: Map<string, string>
}
```

Y en `indexar`:

```ts
  const todas = db.especies
  const padres = todas.filter((e) => !e.variedad_de)
  const porSlug = new Map(todas.map((e) => [e.slug, e]))

  // por grupo van solo los padres: el Calendario dibuja una fila por especie y
  // las derivadas se despliegan desde ahí
  const porGrupo = new Map<Grupo, EspecieEnriquecida[]>()
  for (const e of padres) {
    const lista = porGrupo.get(e.grupo) ?? []
    lista.push(e)
    porGrupo.set(e.grupo, lista)
  }
```

Y devolver `{ db, todas, padres, porSlug, porGrupo, textoBusqueda }`.

- [ ] **Paso 10: Que Explorar liste padres y cuente de verdad**

En `src/screens/Explorar.tsx`, línea 43, cambiar `indice.todas.filter(...)` por `indice.padres.filter(...)`.

En la línea 121, reemplazar el 55 hardcodeado:

```tsx
          {cargando ? 'Cargando el catálogo…' : `${resultados.length} de ${indice!.padres.length} especies`}
```

- [ ] **Paso 11: Actualizar el conteo del test de estructura**

En `tests/data/enriquecido.test.ts`, reemplazar el `it` de las líneas 41-46 por:

```ts
  it('tiene las 55 especies del catálogo más sus variedades, con slugs únicos', () => {
    const padres = db.especies.filter((e: any) => !e.variedad_de)
    expect(padres).toHaveLength(55)
    const slugs = db.especies.map((e: any) => e.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    // el overlay tiene una entrada por especie del catálogo; las derivadas no
    expect(Object.keys(overlay).sort()).toEqual(padres.map((e: any) => e.slug).sort())
  })
```

- [ ] **Paso 12: Verde entero**

```bash
npx tsc -b && npm test
```
Esperado: PASS. Si `tests/clima.test.ts` se queja del conteo, ajustar ese `it` para que corra sobre `db.especies` completo (las derivadas también se afinan).

- [ ] **Paso 13: Commit**

```bash
git add -A
git commit -m "feat: variedades como diff, expandidas por el build

Una variedad se escribe solo con los campos en los que difiere y el build
la expande a especie completa que hereda el resto del padre. La coliflor
estrena el mecanismo: temprana y tardía tienen calendario y días propios.

Refs #8"
```

---

## Task 2: Las validaciones, probadas contra datos rotos

Las validaciones del build no valen nada si nadie prueba que **rechazan**. Un test que solo corre sobre datos buenos pasa aunque la validación esté comentada.

**Files:**
- Create: `tests/variedades-build.test.ts`
- Modify: `scripts/build-enriched.mjs` (extraer las validaciones a funciones puras importables)

**Interfaces:**
- Consumes: `validarRecorte(donde, padre, hija)` de Task 1
- Produces: `scripts/validar-variedades.mjs` exportando `validarRecorte(padre, hija) → string[]` y `validarVariedad(padre, variedadCitable, over) → string[]`

- [ ] **Paso 1: Escribir el test que falla**

Crear `tests/variedades-build.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { validarRecorte } from '../scripts/validar-variedades.mjs'

const padre = {
  slug: 'coliflor',
  calendario: { fuente_meses: { siembra_ideal: [3, 4], siembra_posible: [10], trasplante_ideal: [5], trasplante_posible: [] } },
  dias_a_cosecha: { min: 90, max: 200 },
  dias_a_trasplante: { min: 30, max: 45 },
  dias_germinacion: null,
}

const hija = (over: Record<string, unknown>) => ({ ...padre, slug: 'coliflor-x', ...over })

describe('validarRecorte', () => {
  it('acepta un recorte legítimo', () => {
    expect(
      validarRecorte(padre, hija({
        calendario: { fuente_meses: { siembra_ideal: [3], siembra_posible: [], trasplante_ideal: [5], trasplante_posible: [] } },
        dias_a_cosecha: { min: 90, max: 90 },
      })),
    ).toEqual([])
  })

  it('rechaza un mes que el padre no tiene', () => {
    const errores = validarRecorte(padre, hija({
      calendario: { fuente_meses: { siembra_ideal: [3, 7], siembra_posible: [], trasplante_ideal: [5], trasplante_posible: [] } },
    }))
    expect(errores.join(' ')).toMatch(/mes 7/)
  })

  it('rechaza días calculados fuera del rango del padre', () => {
    // El caso del apio: convertir "80-100 desde trasplante" a "150-190 desde
    // siembra" da un número que el padre nunca publicó.
    const errores = validarRecorte(padre, hija({ dias_a_cosecha: { min: 150, max: 210 } }))
    expect(errores.join(' ')).toMatch(/se sale del 90-200/)
  })

  it('rechaza días cuando el padre no publica rango', () => {
    const errores = validarRecorte(padre, hija({ dias_germinacion: { min: 5, max: 10 } }))
    expect(errores.join(' ')).toMatch(/padre en null/)
  })
})
```

- [ ] **Paso 2: Correr y verificar que falla**

Ejecutar: `npx vitest run tests/variedades-build.test.ts`
Esperado: FAIL — `scripts/validar-variedades.mjs` no existe.

- [ ] **Paso 3: Extraer las validaciones a un módulo propio**

Crear `scripts/validar-variedades.mjs` con `validarRecorte` movido tal cual desde `build-enriched.mjs`, pero **devolviendo** los errores en vez de empujarlos a un array global:

```js
/**
 * La regla 2 aplicada a la capa de variedades: una variedad recorta lo que
 * dijeron las fuentes del padre, nunca le suma. Devuelve los errores en vez de
 * tirar, para que el build los junte con los suyos y los muestre todos juntos.
 */
export function validarRecorte(padre, hija) {
  const errores = []
  const donde = `${hija.slug}`
  for (const capa of ['siembra', 'trasplante']) {
    const del = (e) =>
      new Set([...e.calendario.fuente_meses[`${capa}_ideal`], ...e.calendario.fuente_meses[`${capa}_posible`]])
    const delPadre = del(padre)
    for (const m of del(hija)) {
      if (!delPadre.has(m)) errores.push(`${donde}: ${capa} en el mes ${m}, que el padre no tiene`)
    }
  }
  for (const campo of ['dias_a_cosecha', 'dias_a_trasplante', 'dias_germinacion']) {
    const r = hija[campo]
    const base = padre[campo]
    if (!r) continue
    if (!base) {
      errores.push(`${donde}: ${campo} con el padre en null. Los días se parten, no se inventan`)
    } else if (r.min < base.min || r.max > base.max) {
      errores.push(
        `${donde}: ${campo} ${r.min}-${r.max} se sale del ${base.min}-${base.max} del padre. No se calcula: se parte`,
      )
    }
  }
  return errores
}
```

- [ ] **Paso 4: Que el build use el módulo**

En `scripts/build-enriched.mjs`, importar y reemplazar la llamada:

```js
import { validarRecorte } from './validar-variedades.mjs'
```
```js
    errores.push(...validarRecorte(padre, hija))
```
y borrar la función local.

- [ ] **Paso 5: Correr los dos tests**

```bash
npx vitest run tests/variedades-build.test.ts tests/variedades.test.ts
npm run data:build
```
Esperado: PASS los dos, y el build sigue dando 57.

- [ ] **Paso 6: Commit**

```bash
git add -A
git commit -m "test: las validaciones de variedades, probadas contra datos rotos

Una validación que solo corre sobre datos buenos pasa aunque esté
comentada. El caso del apio (convertir días entre dos fuentes) queda
como test.

Refs #8"
```

---

## Task 3: `cuidados_quita` y el tomate — el requisito de la issue, hecho test

Es la tarea que cumple lo que pidió la issue: que los avisos salgan según la variedad. Hoy la app le dice a **todo** tomatero que tutore y desbrote.

**Files:**
- Modify: `data/huerta_gba.json` (entrada `Tomate`)
- Modify: `data/enriquecimiento.json` (entrada `tomate`)
- Test: `tests/tareas.test.ts`, `tests/variedades.test.ts`

**Interfaces:**
- Consumes: `expandirVariedades` y `cuidados_quita` de Task 1

- [ ] **Paso 1: Escribir el test que falla**

En `tests/variedades.test.ts`, dentro del `describe`, agregar:

```ts
  it('el tomate determinado no lleva tutorado ni poda; el indeterminado sí', () => {
    const det = porSlug.get('tomate-determinado')!
    const ind = porSlug.get('tomate-indeterminado')!
    const tipos = (e: EspecieEnriquecida) => e.cuidados.map((c) => c.tipo)
    expect(tipos(det)).not.toContain('tutorado')
    expect(tipos(det)).not.toContain('poda')
    expect(tipos(ind)).toContain('tutorado')
    expect(tipos(ind)).toContain('poda')
    // riego y rotación no dependen del hábito: los conserva
    expect(tipos(det)).toContain('riego')
    expect(tipos(det)).toContain('rotacion')
  })

  it('la derivada hereda `trucos` textual: no se reescribe la fuente', () => {
    const det = porSlug.get('tomate-determinado')!
    const padre = porSlug.get('tomate')!
    // El texto sigue diciendo "en variedades indeterminadas" y la ficha no
    // muestra tarjeta de tutorado: se puede verificar el razonamiento a ojo.
    expect(det.trucos).toEqual(padre.trucos)
    expect(det.trucos.valor).toContain('variedades indeterminadas')
  })
```

- [ ] **Paso 2: Correr y verificar que falla**

Ejecutar: `npx vitest run tests/variedades.test.ts`
Esperado: FAIL — `tomate-determinado` no existe.

- [ ] **Paso 3: Cargar el tomate en la capa citable**

En `data/huerta_gba.json`, en la especie `Tomate`:

```jsonc
"variedades": [
  {
    "nombre": "Determinado",
    "difiere_en": {}
  },
  {
    "nombre": "Indeterminado",
    "difiere_en": {
      "longevidad": {
        "valor": "Las variedades indeterminadas siguen dando frutos escalonadamente hasta las primeras heladas.",
        "fuentes": [
          { "titulo": "Ficha de cultivo Tomate", "url": "https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Tomate.pdf", "organizacion": "Cátedra de Horticultura - UNLu" }
        ],
        "confianza": 7
      }
    }
  }
]
```

El determinado va con `difiere_en` vacío a propósito: **lo que lo define es lo que no lleva**, y eso vive en `cuidados_quita`. La validación de Task 1 lo acepta porque exige que al menos uno de los dos tenga contenido.

- [ ] **Paso 4: Cargar el tomate en el overlay**

En `data/enriquecimiento.json`, en `"tomate"`:

```jsonc
"variedades_derivado": {
  "determinado": {
    "nombre_comun": "Tomate determinado",
    "derivacion": "El texto de trucos acota la práctica: «tutorar y realizar desbrote/poda en variedades indeterminadas» (FIQ-UNL, Fecoagro). Una determinada no entra en esa frase, así que no lleva esos dos cuidados. El texto se hereda entero y sin tocar: la frase que lo justifica queda a la vista en la ficha.",
    "cuidados_quita": ["tutorado", "poda"]
  },
  "indeterminado": {
    "nombre_comun": "Tomate indeterminado",
    "derivacion": "Es la variedad a la que las fuentes le atribuyen el tutorado, el desbrote y la producción escalonada hasta las heladas. Conserva todos los cuidados del padre."
  }
}
```

- [ ] **Paso 5: Regenerar y correr**

```bash
npm run data:build
npx vitest run tests/variedades.test.ts
```
Esperado: PASS, build en 59.

- [ ] **Paso 6: El test que prueba el requisito de la issue**

En `tests/tareas.test.ts`, siguiendo el estilo de los casos que ya están, agregar un test que arme dos plantas —una `tomate-determinado` y una `tomate-indeterminado`— y verifique que los cuidados que llegan a la agenda difieren. Leer primero cómo el archivo construye su `EntradaMotor` (`plantas`, `porSlug`, `clima`, `hoy`) y reusar ese armado; el motor deriva las tareas de `porSlug.get(p.slug)`, así que basta con cambiar el slug de la planta.

```ts
  it('un tomate determinado no arrastra el tutorado del indeterminado', () => {
    const det = ESPECIES.find((e) => e.slug === 'tomate-determinado')!
    const ind = ESPECIES.find((e) => e.slug === 'tomate-indeterminado')!
    expect(det.cuidados.map((c) => c.tipo)).not.toContain('tutorado')
    expect(ind.cuidados.map((c) => c.tipo)).toContain('tutorado')
    // los dos conservan el ciclo del padre: lo único que cambia es el manejo
    expect(det.dias_a_cosecha).toEqual(ind.dias_a_cosecha)
  })
```

- [ ] **Paso 7: Verde entero**

```bash
npx tsc -b && npm test
```

- [ ] **Paso 8: Commit**

```bash
git add -A
git commit -m "data: el tomate se parte en determinado e indeterminado

Hasta ahora la app le decía a todo el mundo que tutore y desbrote. Las
fuentes acotan las dos prácticas a las indeterminadas; el determinado
hereda el texto entero y no lleva esos cuidados.

Refs #8"
```

---

## Task 4: Chaucha, arveja y zanahoria

Siete derivadas más, todas con el mecanismo ya probado. Nada nuevo salvo datos.

**Files:**
- Modify: `data/huerta_gba.json` (`Chaucha (poroto / judía)`, `Arveja`, `Zanahoria`)
- Modify: `data/enriquecimiento.json` (`chaucha`, `arveja`, `zanahoria`)
- Test: `tests/variedades.test.ts`

- [ ] **Paso 1: Escribir el test que falla**

En `tests/variedades.test.ts`:

```ts
  it('están las once derivadas, y ninguna más', () => {
    expect(derivadas.map((e) => e.slug).sort()).toEqual([
      'arveja-de-enrame',
      'arveja-enana',
      'chaucha-de-enrame',
      'chaucha-enana',
      'coliflor-tardia',
      'coliflor-temprana',
      'tomate-determinado',
      'tomate-indeterminado',
      'zanahoria-chantenay-nantesa',
      'zanahoria-corta',
      'zanahoria-criolla',
    ])
  })

  it('las que difieren por porte no llevan el tutor de la trepadora', () => {
    for (const slug of ['chaucha-enana', 'arveja-enana']) {
      expect(porSlug.get(slug)!.cuidados.map((c) => c.tipo), slug).not.toContain('tutorado')
    }
    for (const slug of ['chaucha-de-enrame', 'arveja-de-enrame']) {
      expect(porSlug.get(slug)!.cuidados.map((c) => c.tipo), slug).toContain('tutorado')
    }
  })

  it('las tres zanahorias parten el 50-150 del padre', () => {
    expect(porSlug.get('zanahoria-chantenay-nantesa')!.dias_a_cosecha).toEqual({ min: 110, max: 110 })
    expect(porSlug.get('zanahoria-criolla')!.dias_a_cosecha).toEqual({ min: 150, max: 150 })
    expect(porSlug.get('zanahoria-corta')!.dias_a_cosecha).toEqual({ min: 50, max: 90 })
  })
```

- [ ] **Paso 2: Correr y verificar que falla**

Ejecutar: `npx vitest run tests/variedades.test.ts`
Esperado: FAIL — faltan siete slugs.

- [ ] **Paso 3: Chaucha en las dos capas**

Citable, en `Chaucha (poroto / judía)`:

```jsonc
"variedades": [
  {
    "nombre": "Enana",
    "difiere_en": {
      "cosecha": {
        "valor": "Variedades enanas: aproximadamente 60 días desde la siembra.",
        "fuentes": [
          { "titulo": "Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)", "url": "https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html", "organizacion": "INTA / ProHuerta (EEA Cerbas)" }
        ],
        "confianza": 8
      },
      "forma_siembra": {
        "valor": "Variedades enanas (mata baja): a chorrillo, 15-20 plantas por metro lineal, surcos a 70 cm.",
        "fuentes": [
          { "titulo": "Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)", "url": "https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html", "organizacion": "INTA / ProHuerta (EEA Cerbas)" }
        ],
        "confianza": 8
      }
    }
  },
  {
    "nombre": "De enrame",
    "difiere_en": {
      "cosecha": {
        "valor": "Variedades de enrame: 70-80 días desde la siembra.",
        "fuentes": [
          { "titulo": "Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)", "url": "https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html", "organizacion": "INTA / ProHuerta (EEA Cerbas)" }
        ],
        "confianza": 8
      },
      "forma_siembra": {
        "valor": "Variedades de enrame: 3-4 semillas por golpe cada 30 cm, a 3-4 cm de profundidad, en surcos separados 70 cm.",
        "fuentes": [
          { "titulo": "Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)", "url": "https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html", "organizacion": "INTA / ProHuerta (EEA Cerbas)" }
        ],
        "confianza": 8
      }
    }
  }
]
```

Overlay, en `"chaucha"`:

```jsonc
"variedades_derivado": {
  "enana": {
    "nombre_comun": "Chaucha enana",
    "derivacion": "INTA/ProHuerta separa enanas de enrame en la siembra y en el ciclo. Los 60 días parten el 60-80 que el padre ya publica. El tutor de 2-2,5 m lo pide Huerta de Cero «para las variedades de enrame», así que la enana no lo lleva.",
    "dias_a_cosecha": { "min": 60, "max": 60 },
    "cuidados_quita": ["tutorado"]
  },
  "de-enrame": {
    "nombre_comun": "Chaucha de enrame",
    "derivacion": "La otra mitad de la misma frase de INTA/ProHuerta: 70-80 días, siembra a golpe. Conserva el tutorado, que es suyo.",
    "dias_a_cosecha": { "min": 70, "max": 80 }
  }
}
```

- [ ] **Paso 4: Arveja en las dos capas**

Citable, en `Arveja`:

```jsonc
"variedades": [
  {
    "nombre": "Enana",
    "difiere_en": {
      "forma_siembra": {
        "valor": "Entre hileras 30-40 cm en variedades enanas.",
        "fuentes": [
          { "titulo": "Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)", "url": "https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html", "organizacion": "INTA / ProHuerta (EEA Cerbas)" }
        ],
        "confianza": 8
      }
    }
  },
  {
    "nombre": "De enrame",
    "difiere_en": {
      "forma_siembra": {
        "valor": "Entre hileras hasta 60 cm en las variedades de enrame.",
        "fuentes": [
          { "titulo": "Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)", "url": "https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html", "organizacion": "INTA / ProHuerta (EEA Cerbas)" }
        ],
        "confianza": 8
      }
    }
  }
]
```

Overlay, en `"arveja"`:

```jsonc
"variedades_derivado": {
  "enana": {
    "nombre_comun": "Arveja enana",
    "derivacion": "INTA/ProHuerta acota el tutor a las trepadoras: «colocar ramas o tutores/enrejado a las variedades trepadoras». La enana no entra en esa frase y queda sin ese cuidado; el texto se hereda entero.",
    "cuidados_quita": ["tutorado"]
  },
  "de-enrame": {
    "nombre_comun": "Arveja de enrame",
    "derivacion": "Es la trepadora a la que INTA/ProHuerta le pide ramas o enrejado. Conserva el tutorado."
  }
}
```

**Ojo:** `arveja-enana` queda con un solo cuidado (`abonado`). La validación de Task 1 exige al menos uno, así que pasa — pero verificalo, porque si alguien saca `abonado` del padre, esta variedad rompe el build.

- [ ] **Paso 5: Zanahoria en las dos capas**

Citable, en `Zanahoria`. **Las tres van con confianza 5, más baja que el 7 del padre**: Portal Frutícola y una "Guía 2026" no están a la altura de INTA, y la separación por variedad la sostienen ellas.

```jsonc
"variedades": [
  {
    "nombre": "Chantenay-Nantesa",
    "difiere_en": {
      "cosecha": {
        "valor": "Chantenay-Nantesa: aproximadamente 110 días desde la siembra.",
        "fuentes": [
          { "titulo": "Calendario de siembra", "url": "https://www.mihuerta.org.ar/wp-content/uploads/2013/11/Calendario-de-siembra.pdf", "organizacion": "Mi Huerta" }
        ],
        "confianza": 5
      }
    }
  },
  {
    "nombre": "Criolla",
    "difiere_en": {
      "cosecha": {
        "valor": "Criolla: aproximadamente 150 días desde la siembra.",
        "fuentes": [
          { "titulo": "Calendario de siembra", "url": "https://www.mihuerta.org.ar/wp-content/uploads/2013/11/Calendario-de-siembra.pdf", "organizacion": "Mi Huerta" }
        ],
        "confianza": 5
      }
    }
  },
  {
    "nombre": "Corta",
    "difiere_en": {
      "cosecha": {
        "valor": "Variedades cortas: 50-90 días desde la siembra.",
        "fuentes": [
          { "titulo": "Cómo cultivar zanahorias en el huerto | Guía 2026", "url": "https://www.portalfruticola.com/noticias/2026/02/23/zanahorias/", "organizacion": "Portal Frutícola" }
        ],
        "confianza": 5
      }
    }
  }
]
```

Overlay, en `"zanahoria"`:

```jsonc
"variedades_derivado": {
  "chantenay-nantesa": {
    "nombre_comun": "Zanahoria Chantenay-Nantesa",
    "derivacion": "Los tres números salen de la misma frase de cosecha del padre y parten su 50-150: no hay ninguna cuenta nueva. Confianza 5 y no 7: la separación por variedad la sostienen fuentes más flojas que INTA.",
    "dias_a_cosecha": { "min": 110, "max": 110 }
  },
  "criolla": {
    "nombre_comun": "Zanahoria Criolla",
    "derivacion": "Ídem Chantenay-Nantesa, el otro extremo del rango del padre.",
    "dias_a_cosecha": { "min": 150, "max": 150 }
  },
  "corta": {
    "nombre_comun": "Zanahoria corta",
    "derivacion": "El extremo rápido del rango del padre. Portal Frutícola la da en 50-90 días; el padre ya publicaba ese 50 como mínimo.",
    "dias_a_cosecha": { "min": 50, "max": 90 }
  }
}
```

- [ ] **Paso 6: Regenerar, correr y mirar los errores del build**

```bash
npm run data:build
npx vitest run tests/variedades.test.ts
npx tsc -b && npm test
```
Esperado: build en 66, todo verde.

- [ ] **Paso 7: Commit**

```bash
git add -A
git commit -m "data: chaucha, arveja y zanahoria, con sus once derivadas en total

La chaucha y la arveja se parten por el tutor, que las fuentes acotan a
la trepadora. La zanahoria parte su 50-150 en tres, con confianza 5:
la separación la sostienen fuentes más flojas que INTA.

Refs #8"
```

---

## Task 5: Revisar el afinado de las once derivadas

Es un **gate**, no una tarea de código. El afinado puede dejar a la coliflor temprana sin ventana ideal, y eso sería bug del modelo, no del dato.

**Files:**
- Modify: `data/REVISION_CALENDARIO.md` (generado)

- [ ] **Paso 1: Regenerar la tabla de revisión**

```bash
npm run data:tabla
```

- [ ] **Paso 2: Revisar las once, una por una**

En `data/REVISION_CALENDARIO.md`, para cada uno de los once slugs derivados:

- **Ventanas vacías**: si alguna quedó sin una sola década ideal en alguna de las tres zonas, anotarlo.
- **Huecos**: una década degradada con vecinas ideales de los dos lados es casi siempre un criterio incoherente. Ya pasó con el tomate y el zapallito.
- **Qué recortó el modelo**: cada recorte con su regla. Si un recorte no tiene sentido agronómico, es bug del modelo.

- [ ] **Paso 3: Si algo está mal, ir por el modelo y no por el dato**

**No tocar los datos para que el modelo quede contento.** Si el afinado contradice a la fuente, gana la fuente: invocar la skill `/modelo-clima` y arreglarlo ahí. Pasó cinco veces y las cinco el modelo estaba mal.

- [ ] **Paso 4: Commit**

```bash
git add data/REVISION_CALENDARIO.md
git commit -m "data: la tabla de revisión con las once variedades afinadas

Refs #8"
```

---

## Task 6: Explorar — la marca de variedades y el buscador

**Files:**
- Modify: `src/lib/data/especies.ts` (`indexar`, `textoBusqueda`)
- Modify: `src/screens/Explorar.tsx:41-52`
- Modify: `src/components/EspecieCard.tsx`
- Modify: `src/components/EspecieCard.css`
- Test: `tests/variedades.test.ts`

**Interfaces:**
- Consumes: `IndiceEspecies.padres`, `EspecieEnriquecida.variedades` de Task 1

- [ ] **Paso 1: Escribir el test que falla**

Crear `tests/busqueda-variedades.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { cargarEspecies } from '../src/lib/data/especies'

describe('buscar por nombre de variedad', () => {
  it('"chantenay" encuentra la derivada, no el padre', async () => {
    const i = await cargarEspecies()
    const texto = i.textoBusqueda
    expect(texto.get('zanahoria-chantenay-nantesa')).toContain('chantenay')
    expect(texto.get('zanahoria')).not.toContain('chantenay')
  })

  it('el padre sigue encontrándose por su nombre y sus alias', async () => {
    const i = await cargarEspecies()
    expect(i.textoBusqueda.get('chaucha')).toContain('poroto')
  })

  it('las derivadas heredan los alias del padre', async () => {
    const i = await cargarEspecies()
    // quien busca "poroto" espera ver también la enana y la de enrame
    expect(i.textoBusqueda.get('chaucha-enana')).toContain('poroto')
  })
})
```

- [ ] **Paso 2: Correr y verificar que falla**

Ejecutar: `npx vitest run tests/busqueda-variedades.test.ts`
Esperado: FAIL — las derivadas no tienen alias heredados.

- [ ] **Paso 3: Indexar las derivadas con los alias del padre**

En `src/lib/data/especies.ts`, en `indexar`:

```ts
  // una derivada hereda los alias del padre: quien busca "poroto" espera ver
  // también la enana y la de enrame
  const textoBusqueda = new Map(
    todas.map((e) => [
      e.slug,
      normalizar(
        [e.nombre_comun, e.nombre_cientifico, ...(ALIAS[e.variedad_de ?? e.slug] ?? [])].join(' '),
      ),
    ]),
  )
```

- [ ] **Paso 4: Que Explorar muestre derivadas solo cuando las buscás**

En `src/screens/Explorar.tsx`, reemplazar el `useMemo` de `resultados`:

```tsx
  const resultados = useMemo(() => {
    if (!indice) return []
    const texto = normalizar(busqueda.trim())
    // sin búsqueda se ven las 55 especies; buscando aparecen también las
    // variedades, que es cuando el nombre puntual importa
    const base = texto ? indice.todas : indice.padres
    return base.filter((e) => {
      if (texto && !indice.textoBusqueda.get(e.slug)!.includes(texto)) return false
      if (soloAhora && !estadoSiembra(e, decadaHoy, zona)) return false
      if (grupo && e.grupo !== grupo) return false
      if (suelo && e.suelo.categoria_suelo !== suelo) return false
      if (luz && e.luz.categoria_luz !== luz) return false
      return true
    })
  }, [indice, busqueda, soloAhora, grupo, suelo, luz, decadaHoy, zona])
```

- [ ] **Paso 5: La marca en la tarjeta**

En `src/components/EspecieCard.tsx`, dentro de `especie-card__cabeza`, después del `<h2>`:

```tsx
        {especie.variedades.length > 0 && (
          <span className="especie-card__variedades">
            {especie.variedades.length} variedades
          </span>
        )}
```

En `src/components/EspecieCard.css`, con tokens ya existentes y sin bajar contraste:

```css
/* la marca informa, no compite: se distingue por tamaño y peso, nunca
   aclarando el color (regla 3) */
.especie-card__variedades {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--tinta-media);
  white-space: nowrap;
}
```

- [ ] **Paso 6: Correr los tests**

```bash
npx vitest run tests/busqueda-variedades.test.ts
npx tsc -b && npm test
```

- [ ] **Paso 7: Commit**

```bash
git add -A
git commit -m "feat: Explorar muestra las 55 y encuentra las variedades al buscar

Sin búsqueda se ven las especies; escribiendo \"chantenay\" o \"enrame\"
aparece la variedad. Las derivadas heredan los alias del padre.

Refs #8"
```

---

## Task 7: La sección Variedades en la ficha del padre

**Files:**
- Create: `src/components/Variedades.tsx`
- Create: `src/components/Variedades.css`
- Modify: `src/screens/FichaEspecie.tsx`

**Interfaces:**
- Consumes: `EspecieEnriquecida.variedades: VariedadRef[]` de Task 1
- Produces: `<Variedades refs={e.variedades} />`

- [ ] **Paso 1: Escribir el componente**

Crear `src/components/Variedades.tsx`:

```tsx
import { Link } from 'react-router'
import { ConfidenceBadge } from './ConfidenceBadge'
import type { VariedadRef } from '../lib/data/types'
import './Variedades.css'

/** Cómo se llama cada campo cuando hay que decirlo en una frase corta. */
const CAMPO: Record<string, string> = {
  fecha_siembra: 'Cuándo se siembra',
  cosecha: 'Cosecha',
  forma_siembra: 'Cómo se siembra',
  transplante: 'Trasplante',
  longevidad: 'Ciclo de vida',
  trucos: 'Manejo',
  riego: 'Riego',
  maceta: 'Maceta',
}

const CUIDADO: Record<string, string> = {
  tutorado: 'no necesita tutor',
  poda: 'no se desbrota',
  blanqueo: 'no se blanquea',
  raleo: 'no se ralea',
  aporque: 'no se aporca',
}

/**
 * Las variedades que se cultivan distinto. Cada una dice **qué cambia**: sin
 * eso sería una lista de nombres, y el criterio del catálogo es justamente que
 * una variedad se separa por una diferencia de cultivo citada.
 */
export function Variedades({ refs }: { refs: VariedadRef[] }) {
  if (refs.length === 0) return null

  return (
    <section className="variedades">
      <h2 className="dato__titulo">Variedades</h2>
      <p className="dato__texto-chico">
        Se cultivan distinto entre sí. Si sabés cuál tenés, abrila: su ficha trae el calendario y
        los cuidados que le tocan.
      </p>
      <ul className="variedades__lista">
        {refs.map((v) => (
          <li key={v.slug}>
            <Link to={`/explorar/${v.slug}`} className="variedad">
              <span className="variedad__nombre">{v.nombre_comun}</span>
              <ul className="variedad__cambios">
                {v.cambia.map((c) => (
                  <li key={c.campo}>
                    <span className="variedad__campo">{CAMPO[c.campo] ?? c.campo}</span>
                    <span className="variedad__valor">{c.valor}</span>
                    <ConfidenceBadge valor={c.confianza} compacto />
                  </li>
                ))}
                {v.quita.map((t) => (
                  <li key={t}>
                    <span className="variedad__campo">Manejo</span>
                    <span className="variedad__valor">{CUIDADO[t] ?? `sin ${t}`}</span>
                  </li>
                ))}
              </ul>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Paso 2: Los estilos**

Crear `src/components/Variedades.css`. Reglas: target táctil de 44 px mínimo en el `<a>`, contraste AA, y la jerarquía por tamaño y peso — **nunca** bajando el contraste. Copiar los tokens de `src/components/Cuidados.css`, que es la sección más parecida, y no inventar colores.

- [ ] **Paso 3: Enchufarla en la ficha**

En `src/screens/FichaEspecie.tsx`, importar `Variedades` y ponerla después de `<Cuidados cuidados={e.cuidados} />`:

```tsx
        <Cuidados cuidados={e.cuidados} />
        <Variedades refs={e.variedades} />
```

- [ ] **Paso 4: Verificar en el navegador**

```bash
npm run dev
```
Abrir `/explorar/coliflor`, `/explorar/tomate` y `/explorar/zanahoria`. **Mirar de verdad**: que las tarjetas se lean, que el link se toque cómodo con el pulgar, y que "no necesita tutor" no parezca un error.

- [ ] **Paso 5: Verde**

```bash
npx tsc -b && npm test && npm run e2e
```

- [ ] **Paso 6: Commit**

```bash
git add -A
git commit -m "feat: la sección Variedades en la ficha, con qué cambia en cada una

Refs #8"
```

---

## Task 8: La línea de procedencia en la ficha de la derivada

**Files:**
- Modify: `src/screens/FichaEspecie.tsx`
- Modify: `src/screens/FichaEspecie.css`

- [ ] **Paso 1: Escribir el bloque**

En `src/screens/FichaEspecie.tsx`, dentro de `pantalla__cuerpo`, **antes** de `ficha__resumen`:

```tsx
        {e.variedad_de && (
          <p className="ficha__procedencia">
            Variedad de{' '}
            <Link to={`/explorar/${e.variedad_de}`}>
              {indice!.porSlug.get(e.variedad_de)?.nombre_comun}
            </Link>
            . Lo que no figura acá abajo es igual que en la especie, con las mismas fuentes.
            {e.variedad_derivacion && (
              <>
                {' '}
                <span className="ficha__derivacion">{e.variedad_derivacion}</span>
              </>
            )}
          </p>
        )}
```

- [ ] **Paso 2: Los estilos**

En `src/screens/FichaEspecie.css`, con tokens existentes:

```css
/* La procedencia se lee antes que el resto: quien llegó por un link tiene que
   entender enseguida que está en una variedad y no en la especie. */
.ficha__procedencia {
  margin-bottom: var(--espacio-3);
  font-size: 0.9rem;
  color: var(--tinta-media);
}

.ficha__derivacion {
  display: block;
  margin-top: var(--espacio-1);
  font-size: 0.85rem;
}
```

Verificar los nombres de las variables contra `src/theme.css` antes de escribirlas; si `--espacio-3` no existe, usar el que corresponda.

- [ ] **Paso 3: Verificar en el navegador**

Abrir `/explorar/coliflor-temprana` y `/explorar/tomate-determinado`. Confirmar que el tomate determinado **muestra el texto de trucos que dice "en variedades indeterminadas" y no tiene tarjeta de tutorado**: es el razonamiento a la vista.

- [ ] **Paso 4: Verde y commit**

```bash
npx tsc -b && npm test && npm run e2e
git add -A
git commit -m "feat: la ficha de una variedad dice de qué especie sale y por qué difiere

Refs #8"
```

---

## Task 9: Elegir variedad al dar de alta una planta

Es la interacción que hace valer todo lo anterior: es donde el requisito de la issue se cumple para la persona.

**Files:**
- Modify: `src/lib/huerta/tipos.ts`
- Modify: `src/components/AltaPlanta.tsx`
- Modify: `src/components/AltaPlanta.css`
- Modify: `src/lib/huerta/store.ts` (`agregarPlanta`)
- Modify: `src/screens/DetallePlanta.tsx`
- Test: `tests/huerta.test.ts`

**Interfaces:**
- Consumes: `EspecieEnriquecida.variedades` de Task 1
- Produces: `Planta.variedad?: string`

- [ ] **Paso 1: Escribir el test que falla**

En `tests/huerta.test.ts`, siguiendo el estilo del archivo:

```ts
  it('la planta guarda la variedad anotada a mano', async () => {
    const p = await agregarPlanta({
      slug: 'albahaca',
      apodo: '',
      sembrada: '2026-03-01',
      metodo: 'directa',
      variedad: 'Morada',
    })
    expect(p.variedad).toBe('Morada')
  })
```

- [ ] **Paso 2: Correr y verificar que falla**

Ejecutar: `npx vitest run tests/huerta.test.ts`
Esperado: FAIL — `variedad` no está en el tipo ni lo guarda el store.

- [ ] **Paso 3: Sumar el campo al modelo**

En `src/lib/huerta/tipos.ts`, dentro de `Planta`, después de `apodo`:

```ts
  /**
   * La variedad, cuando no cambia el cultivo y por eso no tiene entrada propia
   * (la albahaca morada). Texto libre: es dato tuyo, no del catálogo.
   */
  variedad?: string
```

No hace falta migración de IndexedDB: el campo es opcional, las plantas se guardan enteras y el backup las lleva enteras.

- [ ] **Paso 4: Que el store lo persista**

En `src/lib/huerta/store.ts`, en `agregarPlanta`, sumar `variedad` al objeto que arma y a su firma. Leer la función antes de tocarla y seguir su forma exacta.

- [ ] **Paso 5: El paso de variedad en el alta**

En `src/components/AltaPlanta.tsx`:

Sumar el estado, junto a los demás `useState`:

```tsx
  const [variedad, setVariedad] = useState('')
```

Sumarlo a `limpiar()` (`setVariedad('')`) y al `agregarPlanta` de `guardar()` (`variedad: variedad.trim() || undefined`).

Y, dentro del bloque `{especie && (…)}`, después del campo de fecha:

```tsx
          {especie.variedades.length > 0 && !especie.variedad_de && (
            <div className="alta__campo">
              <span className="alta__label">¿Qué variedad?</span>
              <div className="alta__variedades">
                {especie.variedades.map((v) => (
                  <button
                    key={v.slug}
                    className="alta__variedad"
                    onClick={() => setElegida(v.slug)}
                  >
                    {v.nombre}
                  </button>
                ))}
              </div>
              <p className="alta__ayuda">
                Si no sabés cuál es, dejalo así: la ficha te va a dar los datos de la especie, que
                son más amplios pero igual de ciertos.
              </p>
            </div>
          )}
```

Y para el caso de la variedad que no cambia el cultivo, junto al campo de apodo:

```tsx
          <div className="alta__campo">
            <label className="alta__label" htmlFor="alta-variedad">
              Variedad <span className="alta__opcional">(opcional)</span>
            </label>
            <input
              id="alta-variedad"
              className="alta__input"
              placeholder="Morada, genovesa, cherry…"
              value={variedad}
              onChange={(ev) => setVariedad(ev.target.value)}
            />
            <p className="alta__ayuda">
              Queda anotado en tu diario. Es dato tuyo, no del catálogo.
            </p>
          </div>
```

**Ojo con `slug`:** cuando el sheet viene de una ficha, `slug` es prop y `elegida` no se usa. Cambiar `const especieSlug = slug ?? elegida` por `const especieSlug = elegida ?? slug`, e inicializar `elegida` con `slug`, para que elegir una variedad pueda pisar al padre. Verificar que el `limpiar()` vuelva a dejar `elegida` en `slug` y no en `undefined`.

- [ ] **Paso 6: Mostrarla en el detalle**

En `src/screens/DetallePlanta.tsx`, donde hoy se muestra el nombre de la especie, sumar la variedad libre si la hay. Leer el archivo primero y seguir su forma.

- [ ] **Paso 7: Los estilos**

En `src/components/AltaPlanta.css`, `.alta__variedades` y `.alta__variedad` copiando la forma de `.alta__metodos` / `.alta__metodo`, que ya cumple los 44 px y el contraste.

- [ ] **Paso 8: Verde, y probar a mano**

```bash
npx tsc -b && npm test && npm run e2e
npm run dev
```
Dar de alta una coliflor eligiendo "Temprana" y confirmar que la planta queda en `/huerta/<id>` mostrando **Coliflor temprana** y que sus estimaciones usan los 90 días.

- [ ] **Paso 9: Commit**

```bash
git add -A
git commit -m "feat: elegir la variedad al sumar una planta

Si la especie tiene variedades, el alta pregunta cuál — y a partir de ahí
los avisos salen por esa. Más un campo libre para la variedad que no
cambia el cultivo, que es dato tuyo y queda en el diario.

Refs #8"
```

---

## Task 10: El plegado en el Calendario

**El fallback está autorizado.** Si el plegado complica la matriz o baja la accesibilidad, se deja la marca + link a la ficha y **se dice en el PR**, en vez de forzarlo.

**Files:**
- Modify: `src/screens/Calendario.tsx`
- Modify: `src/screens/Calendario.css`
- Test: `e2e/accesibilidad.spec.ts` (verificar que sigue pasando)

- [ ] **Paso 1: Leer cómo arma las filas**

`src/screens/Calendario.tsx:36-43` y `:105-125`. Las secciones salen de `indice.porGrupo`, que después de Task 1 ya trae **solo padres**: el Calendario sigue en 55 filas sin tocar nada.

- [ ] **Paso 2: Sumar el plegado**

Estado por especie abierta:

```tsx
  const [abiertas, setAbiertas] = useState<Set<string>>(new Set())
```

En la fila de una especie con `e.variedades.length > 0`, un botón que la despliega. Debajo, una fila por derivada, sacada de `indice.porSlug.get(ref.slug)`.

Requisitos que no se negocian: `aria-expanded` en el botón, target de 44 px, y que la derivada se distinga **por indentación y por su nombre**, no solo por color.

- [ ] **Paso 3: Correr accesibilidad**

```bash
npm run e2e
```
`e2e/accesibilidad.spec.ts` mide las 7 pantallas y falla si algo baja. Si falla acá, **ir al fallback**: sacar el plegado, dejar la marca de variedades en la fila con link a la ficha, y anotarlo.

- [ ] **Paso 4: Mirar las capturas**

```bash
npm run shots
```
Abrir `e2e/shots/` y mirar la del Calendario. Los tests no ven que una fila quedó desalineada o que la indentación se lee como error.

- [ ] **Paso 5: Commit**

```bash
git add -A
git commit -m "feat: las variedades se despliegan bajo su especie en el Calendario

Refs #8"
```

---

## Task 11: Capturas, changelog, versión y PR

**Files:**
- Modify: `e2e/screenshots.spec.ts`
- Modify: `CHANGELOG.md`
- Modify: `package.json`
- Modify: `README.md` (si menciona 55 especies)

- [ ] **Paso 1: Sumar las capturas nuevas**

En `e2e/screenshots.spec.ts`, siguiendo el patrón que ya está: la ficha de la coliflor con su sección Variedades, la ficha de `coliflor-temprana`, y el alta con el paso de variedad.

- [ ] **Paso 2: Correr y mirar**

```bash
npm run shots
```
**Mirar las capturas de verdad.** En este repo los screenshots encontraron un ícono de cosecha que parecía tacho de basura y una lista de pasos desarmada en palabras sueltas. Nada de eso rompe un test.

- [ ] **Paso 3: Buscar los 55 que queden**

```bash
grep -rn "55 especies" src README.md e2e tests
```
Actualizar lo que aparezca.

- [ ] **Paso 4: Bump de versión**

En `package.json`, subir la **MENOR**. Los datos suben la menor: sumar variedades al catálogo es de lo que se trata la app, no un detalle técnico.

- [ ] **Paso 5: Changelog**

En `CHANGELOG.md`, bajo `## [Sin publicar]`, escrito para quien usa la app y no para quien lee el diff:

```markdown
### Agregado
- **Variedades.** Ahora, cuando sumás una planta, podés decir qué variedad
  plantaste — y los avisos te salen según esa. Una coliflor temprana y una
  tardía no se siembran el mismo mes ni tardan lo mismo, y la app ya no te dice
  lo mismo para las dos. Once variedades de coliflor, chaucha, arveja, tomate y
  zanahoria, cada una con su fuente.
- Si tu variedad no cambia el cultivo (una albahaca morada), la podés anotar
  igual: queda en tu diario.

### Cambiado
- **Un tomate determinado ya no te pide tutor ni desbrote.** Las fuentes acotan
  las dos prácticas a las indeterminadas, y hasta ahora se lo decíamos a todo
  el mundo. Lo mismo con la chaucha y la arveja de mata baja.
```

- [ ] **Paso 6: Verde entero, la última vez**

```bash
npx tsc -b && npm test && npm run e2e && npm run shots
```

- [ ] **Paso 7: Las issues de lo que quedó afuera**

Crear una issue con el apio y el brócoli: a los dos les falta **fuente**, no decisión. El apio necesita una fuente que dé el ciclo del autoblanqueo **desde siembra** (las que hay lo dan desde trasplante y no cierran con el total de INTA); el brócoli, una que **nombre variedades** en vez de clases de ciclo.

- [ ] **Paso 8: PR**

```bash
git push -u origin data/variedades-por-especie
gh pr create --base staging --title "Variedades por especie: el diff como decisión" --body "…"
```

El cuerpo tiene que llevar:
- `Closes #8`
- `Refs` a la issue nueva del apio y el brócoli
- **La zanahoria marcada para revisión**: entra con confianza 5 porque la sostienen Portal Frutícola y una "Guía 2026", más flojas que INTA.
- Si Task 10 terminó en el fallback, decirlo.

---

## Autorrevisión del plan

**Cobertura de la spec:**

| Sección de la spec | Tarea |
|---|---|
| Modelo de datos, dos capas | 1 |
| Expansión en el build | 1 |
| Validación 1 (citable) | 1 (paso 6) |
| Validación 2 (diff vacío) | 1 (paso 6) |
| Validación 3 (meses ⊆ padre) | 1, 2 |
| Validación 4 (días ⊆ padre) | 1, 2 |
| Validación 5 (derivación al quitar cuidado) | 1 (paso 6), 3 |
| Validación 6 (nunca sin cuidados) | 1 (paso 6), 4 (paso 4) |
| Las 11 derivadas | 1, 3, 4 |
| Explorar | 1 (paso 10), 6 |
| Ficha del padre | 7 |
| Ficha de la derivada | 8 |
| Calendario | 10 |
| Alta de planta + `Planta.variedad` | 9 |
| Tests | 1, 2, 3, 4, 6, 9 |
| Riesgo del afinado | 5 |
| Versión y changelog | 11 |

**Corrección a la spec, aplicada acá:** la validación 5 de la spec decía que quitar un cuidado exige overridear el campo del que sale. Eso obligaría a reescribir la prosa citable del padre. La versión de este plan es la correcta: la variedad **hereda el texto textual** y lo que se exige es una `derivacion`. La spec hay que corregirla.

**Corrección de atribuciones:** la tabla de la spec pone INTA en el tomate. Es **FIQ-UNL / Fecoagro** (`trucos`) y **UNLu** (`longevidad`). En la chaucha, `dias_a_cosecha` sí es INTA/ProHuerta, pero el tutor es **Huerta de Cero**.

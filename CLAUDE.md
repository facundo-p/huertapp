# Huerta GBA — cómo trabajar en este repo

PWA offline-first para una huerta casera en el Gran Buenos Aires. Local-first:
sin backend, sin cuentas, sin nube. Leé `README.md` para qué es y `BRIEF.md`
para el encargo original.

## Las cuatro reglas que no se negocian

Si una de estas se rompe, el producto está roto aunque los tests pasen.

**1. No se inventan datos agronómicos.** Todo sale del JSON investigado. Si un
dato falta, se muestra "sin dato" con su estilo propio; no se completa con lo
que parezca razonable. Cada dato conserva sus `fuentes` con URL y su
`confianza` 1-10, accesibles desde la ficha.

**2. El modelo climático solo puede recortar lo que dijeron las fuentes, nunca
agregar.** Las fuentes hablan en meses; el afinado a décadas puede quitar
décadas dentro de esos meses, jamás poner una fuera. Hay un `throw` en runtime
y un test sobre 55 especies × 3 zonas. Cuando el modelo contradice a una
fuente, **gana la fuente y se corrige el modelo** — pasó cinco veces y las
cinco el modelo estaba mal. Ver `.claude/LECCIONES.md`.

**3. Accesibilidad.** Contraste AA en todo el texto, targets táctiles de 44 px,
el color nunca como único canal (ideal/posible se distinguen también por forma
y relleno). No es una pasada final: `e2e/accesibilidad.spec.ts` lo mide en las
7 pantallas y falla si algo baja. La jerarquía visual se hace con tamaño y
peso, **nunca** bajando el contraste.

**4. Todo texto de UI en español rioplatense, con vos.** "Fijate", "sembrá",
"tenés". Cálido y breve. Cuando algo no funciona en cierta plataforma, se dice
antes de que la persona lo intente, no después.

## El pipeline de datos

```
data/huerta_gba.json          base investigada, capa citable — se toca poco
        +
data/enriquecimiento.json     interpretación a mano: calendario en meses,
        │                     días, temperaturas, asociaciones,
        │                     cuidados ← ACÁ SE EDITA
        ▼
scripts/build-enriched.mjs    + clima-gba.mjs + afinar-calendario.mjs
        ▼
data/huerta_gba_enriquecido.json   GENERADO — nunca a mano (hay un hook)
```

Después de tocar cualquier fuente: `npm run data:build`. Si te olvidás,
`npm test` te lo dice — corre `--check` antes de los tests.

Lo mismo con `data/REVISION_CALENDARIO.md` (`npm run data:tabla`) y con `dist/`
(`npm run build`).

## Ramas, versión y changelog

**`staging` es el tronco. A `main` no se commitea ni se pushea nunca.**

`main` es lo que está publicado: cada push dispara el deploy a GitHub Pages y le
cambia la app a quien ya la tiene instalada. Hay un hook que bloquea `git
commit` y `git push` si estás parado en main.

A main se llega solo por un **release**, y el release lo pide la persona — nunca
se hace por iniciativa propia. Cuando lo pida, seguí la skill `/release`: PR de
staging a main, bump de versión, entrada de changelog, etiqueta.

### El trabajo entra por rama y PR, nunca commiteando sobre staging

Cada cambio sale de su **issue**, va en su **rama** y entra por un **PR contra
`staging`**. Los prefijos que ya usa el repo: `feat/`, `fix/`, `data/`, `docs/`.

**El PR tiene que cerrar su issue con una palabra clave** —`Closes #N`,
`Fixes #N`— y no sólo mencionarla. No es cosmético: la palabra clave es lo único
que llena el campo **Linked pull requests** del tablero, y ese campo es lo que
hace que la issue y su PR se muevan juntos entre columnas. Un `Refs #N` aparece
en la conversación y **no** los vincula.

Si el PR deja algo sin terminar de esa issue, ese resto va en una issue aparte y
la original se cierra igual. Una issue que queda abierta esperando algo que el PR
no hizo se referencia con `Refs`, no con `Closes`.

El tablero tiene dos vistas para consultar esto: **Issues** y **PRs**.

**La versión** vive en `package.json`, la inyecta Vite en el build y se ve sola
al pie de Ajustes. Es SemVer de **tres** partes; el cuarto segmento
que usan otros ecosistemas codificaría el build, y acá eso ya existe con más
información (el service worker se identifica con el hash de lo que precachea).

Una particularidad del proyecto: **los datos suben la MENOR, no la PARCHE**.
Sumar una especie o corregir una ventana de siembra no es un detalle técnico —
es de lo que se trata la app.

**El changelog** (`CHANGELOG.md`) se escribe para quien usa la app. Mientras se
trabaja, los cambios se anotan bajo `## [Sin publicar]`; el release convierte esa
sección en la versión con su fecha. Si un cambio no se nota desde afuera, no va:
para eso está el historial de git.

## Verde antes de decir "listo"

```bash
npx tsc -b        # tipos
npm test          # 537 unitarios + chequeo de que el JSON generado esté al día
npm run e2e       # 12 e2e: backup, offline, actualización, accesibilidad
npm run shots     # 27 capturas en 390×844 → e2e/shots/fase-N/
```

`e2e` y `shots` hacen `npm run build` solos: corren contra `dist/` servido por
`vite preview`, no contra el dev server.

**Mirá las capturas.** No alcanza con que los tests pasen: en este repo los
screenshots encontraron un ícono de cosecha que se leía como tacho de basura,
una lista de pasos desarmada en palabras sueltas y un ícono de libro para
"Bajar backup". Nada de eso rompe un test.

## Convenciones de código

- **Identificadores y comentarios en español.** `derivarTareas`, `esperarOffline`,
  `posible`, `ideal`. Es el idioma del dominio y del producto.
- **Los comentarios explican por qué, no qué — y en las menos palabras que se
  entiendan.** Si se deduce leyendo la línea de abajo, sobra. Mucho texto no lo
  lee nadie, así que dos líneas que se leen valen más que ocho que se saltean.
  Vale igual para `CLAUDE.md` y `.claude/LECCIONES.md`. El comentario que sirve
  registra una decisión o una trampa: *"replaceAll y no replace: si el marcador
  aparece también en un comentario, replace sustituye ese. Pasó."*
- **Un token de color, un significado.** Todo color de texto vive en
  `src/theme.css` calibrado a ~4,6:1. No hay colores sueltos en los CSS de
  componentes.
- **Íconos SVG propios**, todos con la misma gramática: viewBox 24, trazo 1.75,
  puntas y uniones redondeadas, `currentColor`. Ícono nuevo → entrada nueva en
  el Glosario.
- **Sin librerías de UI.** El objetivo explícito del brief es que no parezca
  una app genérica.
- **Lógica pura, testeable, con la fecha inyectada.** El motor de tareas y el
  modelo climático son funciones de sus entradas; nada de `new Date()` adentro.

## Cuando el trabajo tenga forma conocida

Hay skills con el procedimiento completo, incluidos los pasos que es fácil
saltearse:

| Tarea | Skill |
|---|---|
| Agregar, sacar o corregir una especie | `/especie` |
| Pantalla o feature nueva de UI | `/pantalla` |
| Tocar el modelo climático o el afinado | `/modelo-clima` |
| Publicar una versión (solo cuando lo pidan) | `/release` |

Y `.claude/LECCIONES.md` tiene las trampas que ya nos costaron una tarde, con
síntoma y causa. Vale leerlo antes de pelear con el service worker, con el
calendario o con un test que pasa sin haber revisado nada.

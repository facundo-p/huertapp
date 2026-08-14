# Instrucciones para Claude Code — App "Huerta GBA" (PWA móvil)

> **Cómo usar este documento:** copialo al repo del proyecto (por ejemplo como `BRIEF.md`), poné `huerta_gba.json` en `data/`, y arrancá la sesión de Claude Code con:
> *"Leé BRIEF.md completo y construí la app siguiendo sus fases. Empezá por la Fase 0 y mostrame el resultado de cada fase antes de seguir."*
> Conviene arrancar en **plan mode** (`Shift+Tab`) para revisar el plan antes de que escriba código.

---

## 1. Qué estamos construyendo

Una **PWA instalable, mobile-first y offline-first** para planificar y mantener una huerta casera en el Gran Buenos Aires. Es la evolución de un prototipo HTML existente y consume una base de conocimiento ya investigada: `data/huerta_gba.json` (55 especies; cada dato tiene `valor`, `fuentes[]` con URLs, y `confianza` 1–10; incluye categorías estandarizadas de suelo y luz).

**Usuario:** una persona con huerta en casa (balcón, patio o bancal) que la consulta en el celular, con tierra en las manos. Sesiones cortas y frecuentes: "¿qué siembro esta semana?", "¿esto ya se trasplanta?", "¿qué le pasa a mi tomate?".

**Principio rector de producto:** pantallas principales **mínimas y visuales** (íconos, colores, casi sin texto); la densidad de información completa (textos largos, fuentes, índices de confianza) vive solo en las pantallas de detalle, a un tap de distancia.

## 2. Stack técnico

- **Vite + React + TypeScript** (o Preact si preferís bundle mínimo — justificá la elección).
- **PWA real**: `manifest.webmanifest` (íconos, `display: standalone`, tema), **service worker** con precache de app y datos → funciona 100 % offline tras la primera carga. Instalable en Android e iOS (documentar en un README corto cómo instalarla en cada uno).
- **Persistencia local: IndexedDB** (via `idb` o similar) para la huerta del usuario, tareas y diario. Las **fotos se guardan como Blobs en IndexedDB**, redimensionadas al guardar (máx ~1280px) para no explotar el storage. Nada de backend: la app es local-first.
- **Export/Import de backup**: un botón en Ajustes que descarga un JSON con todos los datos del usuario (fotos en base64) y otro que lo restaura. Es la red de seguridad ante pérdida de datos del navegador — hacelo temprano, no al final.
- **Notificaciones**: usar la Notification API local cuando la PWA está instalada, con esta honestidad: en iOS las notificaciones de PWA son limitadas. Por eso el diseño NO depende de notificaciones: la pantalla "Hoy" siempre muestra las tareas pendientes al abrir la app. Las notificaciones son un extra, no el mecanismo principal.
- CSS propio con design tokens (custom properties) — ver §4. Evitá librerías de componentes genéricas (Material, Bootstrap, shadcn sin customizar): el objetivo explícito es que NO parezca "una app genérica más".

## 3. Fase 0 — Enriquecer los datos (hacer ANTES de la UI)

El JSON actual tiene `_meses_siembra` (lista plana de meses derivada del texto). Hay que reemplazarlo por un modelo más rico. Generá `data/huerta_gba_enriquecido.json` con, por especie:

```jsonc
"calendario": {
  "siembra_ideal":      [8, 9, 10],   // meses IDEALES para sembrar
  "siembra_posible":    [7, 11],      // meses posibles pero NO ideales
  "trasplante_ideal":   [9, 10, 11],  // meses ideales para trasplantar al bancal (si aplica)
  "trasplante_posible": [12],
  "metodo_por_mes":     {"7": "almacigo_protegido", "10": "directa|almacigo"},
  "derivacion": "texto breve explicando de qué texto/fuente se derivó",
  "confianza": 7
}
```

Reglas de derivación:
- La distinción ideal/posible sale del texto de `fecha_siembra.valor` (muchas fichas ya dicen "ideal…", "se puede extender…", "almácigo protegido en…") y de `transplante.valor` (offset de días desde siembra → ventana de trasplante). Donde el texto no distinga, usá criterio agronómico documentado (heladas en GBA ~junio-septiembre, última helada ~septiembre) y bajá `confianza`.
- **No inventes precisión**: si una especie no tiene datos para separar ideal/posible, dejá todo en `siembra_ideal` y anotalo en `derivacion`.
- Presentame la tabla derivada completa (especie × meses) como markdown para que yo la revise y corrija a mano ANTES de construir la UI sobre ella. Mis correcciones valen más que la derivación automática.
- Derivá también, por especie, `dias_a_trasplante` y `dias_a_cosecha` (rangos numéricos parseados de los textos) — los necesita el motor de tareas (§6).

## 4. Dirección de diseño — "cute de huerta", cuidado y coherente

**Antes de escribir el primer componente**, hacé una pasada de diseño explícita:

1. **Usá los skills/plugins de diseño disponibles.** Corré `/plugins` y revisá el marketplace de Anthropic: instalá y usá lo que aplique — típicamente **`frontend-design`** (estética no genérica, la instrucción clave que le doy: "diseñá como si fuera una app indie querible, no un admin dashboard"), **`theme-factory`** (generar el tema/tokens), **`dataviz`** (para el calendario y cualquier visualización), y si está disponible el plugin de **design** usá sus skills `design-critique` y `accessibility-review` como pasadas de revisión al final de cada fase de UI. Si alguno no existe en mi entorno, decímelo y seguí con los lineamientos de abajo.
2. **Definí design tokens en un solo archivo** (`src/theme.css`): paleta, tipografía, radios, sombras, espaciado. Dirección estética:
   - Paleta tierra/verde cálida (verdes salvia y oliva, crema/papel, terracota, un amarillo sol como acento), fondo tipo papel, no blanco puro ni gris frío.
   - Bordes bien redondeados, sombras suaves, sensación "orgánica": la referencia es *cozy garden game* / cuaderno de campo bonito, no corporativo.
   - Tipografía: una display redondeada y amigable para títulos (p.ej. Nunito, Quicksand o similar, self-hosted) + una sans legible para cuerpo. Nada de fuentes por CDN externo (rompería el offline).
   - Microdetalles que suman "cute" sin ensuciar: esquinas de tarjetas tipo etiqueta de semillas, animaciones sutiles (una hojita que aparece al completar una tarea), estados vacíos ilustrados con los mismos íconos del sistema y un texto simpático.
3. **Sistema de iconografía — es EL núcleo del diseño.** Construí un set de íconos SVG propio y consistente (mismo grosor de trazo, misma esquina, mismo estilo, inline en el bundle):
   - Un ícono por **grupo** (hoja, fruto, raíz/bulbo, legumbre, aromática, flor polinizadora).
   - Un ícono por **categoría de suelo** (5) y por **categoría de luz** (4), cada uno con su color de categoría.
   - Íconos de estado/acción: sembrar, almácigo, trasplantar, cosechar, regar, plaga, nota, foto, alerta, fuente/libro, confianza.
   - Regla de uso: en listas, chips y calendario va **el ícono solo** (con `aria-label` siempre); el nombre en texto aparece solo en pantallas de detalle o en el primer uso. Un **Glosario** accesible desde el menú y desde cualquier ícono (long-press o "?" ) explica todos los íconos, colores y la escala de confianza en una sola pantalla linda.
   - Accesibilidad no negociable: el color nunca es el único canal (ideal vs posible = color **+** forma/relleno distinto), targets táctiles ≥ 44px, contraste AA. Al final, corré una revisión de accesibilidad (con el skill si está, a mano si no).

## 5. Pantallas (navegación por tab bar inferior, 4 tabs + detalle)

**🏠 Hoy** *(pantalla de inicio — la más importante)*
- Cabecera con la fecha/semana y un saludo corto contextual a la estación.
- **"Para sembrar en almácigo esta semana"**: dada la semana actual, tarjetas horizontales con las especies cuyo mes actual está en `siembra_ideal` y admiten almácigo (de `metodo_por_mes` / `forma_siembra`). Orden: primero las que se les está por cerrar la ventana ideal ("⏳ última semana ideal"). Distinguir visualmente ideal (verde) de posible (amarillo) si se muestran ambas.
- **Tareas pendientes de mi huerta** (del motor de tareas, §6): máximo 3–4 visibles, el resto detrás de "ver todas".
- Si la huerta está vacía: estado vacío simpático que invita a explorar qué sembrar ahora.

**🔍 Explorar**
- Buscador + filtros como chips de íconos (mes, grupo, suelo, luz, confianza). Compacto: una fila scrolleable por dimensión, o un botón de filtros que abre bottom-sheet.
- Tarjetas de especie minimalistas: nombre + íconos (grupo/suelo/luz) + mini-tira de 12 meses con **verde=ideal, amarillo=posible** + badge "⏰ ahora" si el mes actual es ideal.
- Tap → **Ficha de especie** (pantalla completa, acá SÍ va toda la densidad): todos los campos del JSON con su badge de confianza, advertencias "si no se cumple", señales de trasplante/cosecha listos, asociaciones buenas/malas como chips navegables, y las **fuentes como links** al final de cada dato. Botón primario: "🧺 Agregar a mi huerta".

**📅 Calendario**
- Matriz especie × 12 meses, dos capas conmutables: **siembra** y **trasplante**. Celdas: verde=ideal, amarillo=posible, con distinción de forma además de color. Columna del mes actual resaltada y línea de "hoy". Filtro por grupo. Tap en celda → mini-popup: qué significa + link a la ficha.

**🧺 Mi huerta**
- Mis plantas como tarjetas: especie, apodo opcional, ubicación (maceta/bancal/almácigo — el usuario define sus ubicaciones), fecha de siembra, y **estado del ciclo** (almácigo → trasplantada → creciendo → cosechando → terminada) visualizado como una barrita de progreso con los íconos del ciclo.
- Al agregar una planta se calculan automáticamente sus fechas estimadas (trasplante, inicio de ventana de cosecha) desde `dias_a_trasplante` / `dias_a_cosecha`.
- **Compatibilidades**: como en el prototipo, avisos de pares conflictivos entre mis plantas y sugerencias de buenas compañeras (usando los índices `_asoc_*` del JSON).
- Tap en una planta → **Detalle de planta**: línea de tiempo del ciclo con fechas, tareas asociadas, y el **Diario**: entradas con fecha, nota, foto(s) y etiqueta opcional (💧 riego, 🐛 plaga, 🌱 progreso, ✂️ poda, 🧺 cosecha). Las fotos se ven como tira cronológica — el "antes y después" de la planta.

**Transversal:** Glosario de íconos; Ajustes (export/import backup, notificaciones on/off, borrar datos); y en todas las pantallas de detalle el pie con la leyenda de confianza.

## 6. Motor de tareas/recordatorios

Derivar tareas automáticamente, nunca pedirle al usuario que las cree a mano (aunque puede editarlas/desactivarlas y crear propias):
- Al sembrar en almácigo → tarea "revisar germinación" (a los `germinacion` días) y "trasplantar" (ventana `dias_a_trasplante`, mostrando los `signos_listo` de la ficha como checklist).
- Al trasplantar → tarea "empezar a revisar cosecha" al abrirse la ventana de `dias_a_cosecha`, con los `indicadores_listo` como guía.
- Estacionales: "se abre la época ideal de siembra de X" para especies favoritas/marcadas.
- Toda tarea muestra de qué dato salió (transparencia: "según la ficha, 25–35 días — confianza 8/10").
- Las tareas viven en la pantalla Hoy; posponer y completar con un tap (con su microanimación 🌱).

## 7. Calidad y proceso — cómo quiero que trabajes

- **Fases con checkpoint**: (0) datos enriquecidos → me mostrás la tabla para corregir; (1) tokens + iconografía + glosario → me mostrás screenshots; (2) Explorar + Ficha; (3) Calendario; (4) Mi huerta + diario; (5) Hoy + tareas; (6) PWA/offline + pulido final. No avances de fase sin mostrarme el resultado.
- **Verificación visual en cada fase de UI**: levantá la app y sacá screenshots con Playwright en viewport móvil (390×844) — incluyendo estados vacíos y con datos — y revisalos vos mismo antes de mostrármelos. Después corré una pasada de **design critique** (con el skill si está instalado) y aplicá lo que salga.
- Tests de la lógica pura (derivación de calendario, motor de tareas, compatibilidades) con vitest.
- Performance: la app abre en <2s en un teléfono medio; el JSON de especies puede cargarse lazy o partirse si hace falta.
- Datos de ejemplo/demo: un botón oculto en Ajustes que carga una huerta de ejemplo, para poder ver la app "viva" sin cargar datos reales.
- Español rioplatense en toda la UI (vos, no tú). Tono cálido y breve; los textos de estado vacío pueden tener humor suave.

## 8. Qué NO hacer

- No agregar backend, cuentas ni sync en la nube (futuro, no ahora).
- No usar librerías de UI genéricas sin customización profunda.
- No mostrar los 13 campos de una especie fuera de su ficha.
- No inventar datos agronómicos nuevos: todo sale del JSON; si falta algo, mostralo como "sin dato" con su estilo propio.
- No romper la trazabilidad: fuentes y confianza siempre accesibles desde cada dato en las fichas.

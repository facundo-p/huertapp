# Variedades por especie — diseño

Issue #8 · rama `data/variedades-por-especie` · 21 de agosto de 2026

Resuelve el modelo general de variedades y su primera aplicación. La decisión
del tomate cherry (#33) es sub-issue aparte y no entra acá.

---

## El problema

El catálogo tiene una entrada por especie. Adentro de varias hay dos o tres
variedades que **no se cultivan igual**, y la entrada las promedia:

```
coliflor    90–200 días     dos ventanas de siembra    ← adentro hay dos variedades
zanahoria   50–150 días
chaucha     60–80 días
```

Peor que el promedio es el consejo. Hoy la app le dice a todo el mundo que
tutore el tomate y le saque los chupones, que le ponga tutores de 2-2,5 m a la
chaucha y enrejado a la arveja. Para un tomate determinado, una chaucha de mata
baja o una arveja enana eso es el consejo equivocado — y las tres fuentes ya
acotan la práctica a la otra variedad **en su propio texto**.

El requisito que ordena todo: **los avisos y las indicaciones tienen que salir
según la variedad que la persona cargó en su huerta.**

## La decisión: el diff es la decisión

El último comentario de #8 pide que agrupar-o-separar deje de ser una opinión:

> Dos variedades comparten entrada cuando coinciden en todos los campos
> estructurados. Se separan cuando difieren en al menos uno — y ese campo, con
> su fuente, es la justificación de la separación.

Acá eso no se documenta: **se ejecuta**. Una variedad se escribe como el
conjunto de campos en los que difiere. Si el conjunto está vacío, no hay
variedad que declarar. Si tiene algo, el build la expande a entrada propia.

`cuidados` cuenta como campo que justifica separar. La lista original del
comentario se escribió pensando en el riego, antes de que apareciera el
requisito de arriba — y los cuidados **son** las indicaciones.

## El modelo: una variedad es una especie chiquita, escrita como diff

Las mismas dos capas que tiene una especie, escribiendo solo lo que difiere.

**Capa citable** — `data/huerta_gba.json`, dentro de la especie:

```jsonc
"variedades": [
  { "nombre": "Temprana",
    "difiere_en": {
      "fecha_siembra": { "valor": "…", "fuentes": [...], "confianza": 7 },
      "cosecha":       { "valor": "…", "fuentes": [...], "confianza": 7 }
    } },
  { "nombre": "Tardía", "difiere_en": { … } }
]
```

Cada entrada de `difiere_en` es un `Dato` **completo**, no un parche: la ficha
de la derivada tiene que poder decir la frase entera con su cita. Las claves
son las mismas de la especie (`fecha_siembra`, `cosecha`, `transplante`,
`trucos`, `riego`, `maceta`, `longevidad`).

**Capa de interpretación** — `data/enriquecimiento.json`, bajo una clave que
**no colisiona** con nada de la base:

```jsonc
"coliflor": {
  "variedades_derivado": {
    "temprana": {
      "nombre_comun": "Coliflor temprana",          // opcional; por defecto se compone
      "calendario": { "fuente_meses": {…}, "metodo_por_mes": {…},
                      "derivacion": "…", "confianza": 7 },
      "dias_a_cosecha": { "min": 90, "max": 90 }
    }
  }
},
"tomate": {
  "variedades_derivado": {
    "determinado": { "cuidados_quita": ["tutorado", "poda"] }
  }
}
```

`variedades_derivado` y no `variedades` a propósito: el merge del build es
shallow y una clave con el mismo nombre pisaría el array citable entero,
fuentes incluidas, sin que nada avise. Es la misma trampa que documentó #26 y
que ya obligó a `transplante_signos` y a `riego_regimen`.

## La expansión en el build

`scripts/build-enriched.mjs`, después de armar cada especie:

1. Por cada variedad con `difiere_en` no vacío, arma una `EspecieEnriquecida`
   completa: **hereda todo del padre**, aplica los overrides citables, aplica
   los del overlay, saca los `cuidados_quita`.
2. `slug = "<padre>-<slugify(nombre)>"` → `coliflor-temprana`.
   `nombre_comun` explícito, o compuesto de `nombreCorto(padre) + nombre`.
3. Le suma `variedad_de: "coliflor"` y `variedad: "Temprana"`.
4. Corre `afinarEspecie()` con el calendario efectivo, igual que con cualquier
   especie.
5. Al padre le deja `variedades[]` resuelto, con el slug de cada derivada, para
   que la ficha y Explorar puedan navegar.

**Río abajo no cambia nada.** `porSlug.get(p.slug)` devuelve un registro
completo, y el motor de tareas, el estimador, la germinación, la barra de ciclo
y la ficha funcionan sin tocarse. El requisito de que los avisos salgan por
variedad queda resuelto por construcción, no por una rama nueva en el motor.

Y la herencia no es una copia: si mañana se corrige el padre, las derivadas se
corrigen solas.

## Las validaciones: las reglas 1 y 2, hechas mecánica

Todas rompen el build, como el resto del pipeline.

1. **Cada `difiere_en[campo]` es citable.** Fuentes con URL, confianza 1-10.
   Reusa el `citable()` que ya existe.

2. **`difiere_en` vacío **y** `cuidados_quita` vacío es error.** No se puede
   declarar una variedad aparte "porque sí". El diff es la decisión — y a veces
   el diff es lo que la variedad **no** lleva: al tomate determinado lo define
   que no se tutora ni se desbrota, no un dato nuevo.

3. **El calendario de la variedad no agrega meses.**
   `ideal ∪ posible` de la variedad ⊆ `ideal ∪ posible` del padre.
   Es la regla 2 aplicada a esta capa: una variedad recorta lo que dijeron las
   fuentes del padre, nunca le suma un mes. Si lo necesita, **el que está mal es
   el padre** y se corrige allá.

4. **Los días de la variedad no se calculan: se parten.**
   `dias_a_cosecha` de la variedad ⊆ `dias_a_cosecha` del padre. Ídem
   `dias_a_trasplante` y `dias_germinacion`.

   Esta es la que sacó al apio (ver abajo). Sin ella, la tentación de convertir
   unidades entre dos fuentes y publicar el resultado como dato pasa sin que
   nadie la vea.

5. **Quitar un cuidado exige una `derivacion` que cite la frase que lo acota.**
   La variedad **hereda el texto citable del padre tal cual** — la tentación
   sería reescribirlo para sacarle la cláusula que no aplica, y reescribir una
   fuente es peor que el problema que resuelve. Lo que se exige es el
   razonamiento, aparte y declarado como tal: es el principio de #33, el
   encadenamiento va en `derivacion` y nunca en un `valor`.

   El resultado se verifica a ojo: un tomate determinado muestra el texto entero
   —"tutorar y realizar desbrote/poda en variedades indeterminadas"— y **no**
   tiene tarjeta de tutorado. El lector puede seguir el razonamiento sin
   confiar en nosotros.

6. **`derivacion` es obligatoria en toda variedad derivada**, y ninguna queda
   sin cuidados: el test que ya exige al menos uno por especie corre también
   sobre ellas.

## Qué se carga: 11 derivadas, 66 entradas

| Padre | Derivadas | Campo que lo justifica | Fuente |
|---|---|---|---|
| Coliflor | temprana · tardía | `fuente_meses` (oct-dic vs mar-abr) **y** `dias_a_cosecha` (90 vs 200) | El Brote Urbano |
| Chaucha | enana · de enrame | `dias_a_cosecha` (60 vs 70-80) y `cuidados` (el tutor) | INTA/ProHuerta · el tutor, Huerta de Cero |
| Zanahoria | Chantenay-Nantesa · Criolla · corta | `dias_a_cosecha` (110 · 150 · 50-90) | Mi Huerta, Portal Frutícola |
| Tomate | determinado · indeterminado | `cuidados` (tutorado y poda) | FIQ-UNL, Fecoagro · el ciclo, UNLu |
| Arveja | enana · de enrame | `cuidados` (tutorado) | INTA/ProHuerta |

Las tres particiones de rango son eso, **particiones**: los números ya están
publicados en el rango del padre y se reparten. No hay una sola cuenta nueva.

**La zanahoria entra con reparo declarado.** Portal Frutícola y una "Guía 2026"
no están a la altura de INTA. Va con la confianza que le toca y marcada en el
PR.

## Qué NO se carga, y por qué

**Apio.** Es el caso que enseña por qué existe la validación 4. La fuente da
"verdes ~120 días, autoblanqueo 80-100" **desde trasplante**; el padre publica
120-150 **desde siembra**, de INTA. Convertirlas exige sumarle los 70-90 días de
`dias_a_trasplante`, y el resultado (150-210) queda fuera del rango del padre:
las dos fuentes no coinciden en el total. Publicarlo sería cálculo propio
disfrazado de dato. Queda pendiente de una fuente que dé el ciclo del apio de
autoblanqueo desde siembra.

**Brócoli.** La fuente da clases de ciclo (corto 50-75, mediano 80-120, largo
+150) **sin nombrar ninguna variedad**. Una entrada "Brócoli de ciclo corto" que
nadie puede reconocer en su sobre es peor que el rango ancho de hoy.

**Papa.** La fuente nombra el eje ("según sea variedad precoz o tardía") y da un
solo rango, 120-150, para las dos. Nombra la diferencia sin cuantificarla: no
hay qué poner en el `difiere_en`.

**La mitad "agrupa" del modelo.** #8 pide también que la ficha liste las
variedades que comparten cultivo ("incluye albahaca común, morada y genovesa: se
cultivan igual"). No se construye ahora: **ninguna especie del catálogo tiene
hoy una fuente que diga que sus variedades se cultivan igual**, y escribir esa
frase sin fuente es inventar. Sería una sección vacía en 55 fichas. El día que
la fuente aparezca es relajar la validación 2. Queda anotado en la issue: más
adelante se investigan las subespecies y esa info entra ahí.

## La app

**Explorar** — siguen siendo las 55 tarjetas de los padres. La que tiene
derivadas lleva una marca ("2 variedades"). El buscador indexa los nombres de
variedad: buscar "chantenay" o "enrame" **trae la derivada directamente**, no el
padre.

**Ficha del padre** — sección nueva *Variedades*, con una tarjeta por variedad
que dice **qué cambia** (el campo, el valor, su `ConfidenceBadge`) y linkea a su
ficha.

**Ficha de la derivada** — idéntica a cualquier especie, con una línea arriba:
*"Variedad de Coliflor. Lo que no figura acá abajo es igual que en la coliflor,
con las mismas fuentes."* Honestidad de procedencia sin marcar campo por campo.

**Calendario** — el padre ocupa una fila con la unión de ventanas y se despliega
en sus derivadas, plegado por defecto. Es la pantalla más apretada y la de
accesibilidad más cara: **si el plegado se complica, el fallback es marca + link
a la ficha**, dicho en el PR en vez de forzado.

**Alta de planta** — al elegir una especie con variedades, el sheet pregunta
cuál. *"No sé / no figura"* deja al padre, con su rango ancho y honesto. Es la
interacción que hace valer todo lo anterior.

**`Planta.variedad?: string`** — texto libre, para cuando tu variedad no cambia
el cultivo (la albahaca morada) pero querés que quede en el diario. Sin
migración de IndexedDB: es opcional, las plantas se guardan enteras y el backup
las lleva enteras.

**DetallePlanta** — muestra "Coliflor temprana" y, si hay `variedad` libre, el
nombre anotado.

## Tests

- `tests/data/enriquecido.test.ts`: el conteo deja de ser 55 pelado. Pasa a
  `especies.filter(e => !e.variedad_de).length === 55`, más que toda derivada
  tenga padre existente y que ningún slug se repita.
- `tests/variedades.test.ts` (nuevo): las seis validaciones de arriba, sobre los
  datos reales. Las 3 y 4 son las que sostienen la regla 2 en esta capa.
- `tests/clima.test.ts`: "las 55 especies se afinan sin romper" pasa a correr
  sobre las 66.
- `tests/tareas.test.ts`: un caso que confirme que un tomate determinado **no**
  genera aviso de tutorado y uno indeterminado sí. Es el requisito de la issue,
  hecho test.
- e2e: capturas de la ficha del padre con la sección Variedades, de una ficha
  derivada, y del paso de variedad en el alta.
- Los `55` de `src/screens/Explorar.tsx` y de tres tests más se actualizan.

## Riesgos

1. **El afinado de las derivadas.** La coliflor temprana, con siembra oct-dic,
   puede quedar sin ventana ideal. Si pasa, es bug del modelo y no del dato: se
   mira en `REVISION_CALENDARIO.md` y se va por `/modelo-clima`. **Nunca se
   corrige tocando el dato para que el modelo quede contento.**
2. **La matriz del calendario**, con su fallback ya declarado.
3. **La zanahoria**, con su fuente floja ya declarada.

## Versión y changelog

Sube la **menor**: los datos suben la menor, y esto agrega entradas al catálogo.
Changelog bajo `[Sin publicar]`, escrito para quien usa la app — lo que se nota
desde afuera es que ahora podés decir qué variedad plantaste y los avisos te
salen según esa.

PR contra `staging` con `Closes #8`. El apio y el brócoli van como issue aparte
(les falta fuente, no decisión), referenciada desde el PR con `Refs`.

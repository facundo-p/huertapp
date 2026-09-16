# Lecciones del equipo

Qué aprendimos de trabajar con un orquestador y subagentes con roles, mientras
resolvemos el lote de issues de #117 y compañía.

Hermano de `.claude/LECCIONES.md`, que registra las trampas de la **app**. Éste
registra las del **equipo**: consumo, coordinación, reparto y entorno. Mismo
formato, porque funciona: **síntoma → causa → qué hacemos**.

El destino es un plugin con este flujo ya afinado. Por eso cada entrada termina
en **qué llevamos al plugin**: si no se puede convertir en una regla, un prompt
de rol o un hook, es una anécdota y no una lección.

---

## Entorno y herramientas

### Los archivos de agente no existen para la sesión que los crea

**Síntoma.** Escribí los cinco `.claude/agents/*.md`, con el frontmatter
validado, y `subagent_type: "investigador"` falló: *"Agent type 'investigador'
not found. Available agents: claude, claude-code-guide, Explore,
general-purpose, Plan, statusline-setup"*.

**Causa.** El registro de agentes se arma **al iniciar la sesión**. Los archivos
estaban en disco y bien formados; simplemente no se relee el directorio a mitad
de camino.

**Qué hacemos.** En la sesión que los crea, los roles se emulan: el tipo
incorporado más parecido (`Explore` para los de sólo lectura, `general-purpose`
o `claude` para los que escriben), con `model:` explícito en la llamada y el
prompt del rol traído desde su archivo —al agente se le pide que lea
`.claude/agents/<rol>.md` y lo adopte, que además verifica que el archivo sirva—.
Desde la sesión siguiente, los nombres resuelven solos.

**Al plugin.** El plugin tiene que estar instalado **antes** de arrancar la
sesión. Vale la pena que su README lo diga en la primera línea: instalarlo a
mitad de una sesión no rompe nada, pero tampoco hace nada hasta reiniciar.

### El entorno bloquea la red saliente, así que no hay cita textual

**Síntoma.** El investigador salió a buscar proporciones de sustrato y volvió sin
una sola cita. No por falta de material: `WebFetch` y `curl` dieron 403 contra
`inta.gob.ar`, `repositorio.inta.gob.ar`, `argentina.gob.ar` y
`aulavirtual.agro.unlp.edu.ar`, entre otros.

**Causa.** La política de red de este entorno. Confirmado en
`curl -sS "$HTTPS_PROXY/__agentproxy/status"`:

```
"kind": "connect_rejected",
"detail": "gateway answered 403 to CONNECT (policy denial or upstream failure)",
"host": "www.argentina.gob.ar:443"
```

Lo único que llega es `WebSearch`, que devuelve links **más un resumen
parafraseado por un modelo**. Y una paráfrasis no es una cita.

**Qué hacemos.** Separar el lote en dos: lo que no necesita fuente nueva —UI,
navegación, densidad, doctrina— corre normal; lo que necesita leer un PDF para
citarlo, **no se puede hacer en este entorno**. No es que salga mal: sale sin el
respaldo que la regla 1 exige, que es peor, porque el dato entra igual y parece
verificado.

**Al plugin.** El rol investigador arranca **chequeando el estado del proxy** y lo
dice en su primer parte. Si el egreso está cerrado, avisa antes de gastar once
búsquedas, no después. Y el orquestador no agenda tandas de datos en un entorno
sin red abierta.

### El investigador hizo bien su trabajo devolviendo nada

**Síntoma.** Cuatro minutos, 70.120 tokens, 33 llamadas, y el entregable fue "no
encontré fuente".

**Causa.** Ninguna: así tiene que ser. Encontró mezclas con proporciones —UGA,
Clemson, INTA Floricultura, un par de diarios— y **descartó todas** porque ninguna
decía el dato que se le pedía. Tenía material suficiente para entregar algo que
sonara bien.

**Qué hacemos.** Tratarlo como el resultado exitoso que es, y quedarnos con el
mapa de lo buscado, que evita repetir la búsqueda dentro de un año.

**Al plugin.** Que el prompt del rol diga explícitamente que "no encontré" es una
respuesta buena **es lo que hizo que la diera**. Un rol de investigación sin esa
línea entrega la mezcla de Clemson y nadie se entera.

### El repo ya sabía lo que la issue pedía averiguar

**Síntoma.** Escribí la issue #129 pidiendo recetas de suelo para las cinco
categorías. `src/lib/glosario.ts:223-230` ya decía, textual: *"Ojo con la
tentación de dar cinco recetas exactas, una por categoría de suelo: **ninguna
fuente da eso**"*.

**Causa.** Escribí la issue mirando el `AJUSTE_SUELO` de abajo sin leer el
comentario de arriba. El comentario registraba una decisión ya tomada, que es
justo para lo que sirven los comentarios de este repo.

**Qué hacemos.** Corregir la issue. Y antes de escribir una issue que pida
averiguar algo, leer los comentarios del módulo que toca: acá registran
decisiones, no explican el código.

**Al plugin.** Paso obligatorio del planner y del orquestador antes de abrir una
issue de investigación: buscar si el repo ya se hizo esa pregunta. Un
`grep -rn "ninguna fuente\|no hay fuente\|no existe" src/` cuesta segundos.

---

## Consumo y contexto

### Una lectura de MCP puede tumbarte el contexto de una sola llamada

**Síntoma.** `issue_read` con `get_sub_issues` sobre el epic devolvió 124.456
caracteres. No entró en contexto y quedó volcado en un archivo.

**Causa.** Pedí "los sub-issues" cuando lo que necesitaba eran **los diez
números**. La herramienta devuelve cada hija entera, cuerpo incluido, y los
cuerpos de este repo son largos a propósito.

**Qué hacemos.** Contra respuestas que pueden venir grandes, pedir lo puntual
antes que lo completo: `fields` cuando la herramienta lo acepta, y si ya se
desbordó, `grep` sobre el archivo volcado. Acá `grep -o '"number":1[0-9][0-9]'`
resolvió en dos líneas lo que no entraba en el contexto.

**Al plugin.** Regla para el orquestador: antes de una llamada que pueda devolver
N elementos con cuerpo, preguntarse qué campo se necesita. Y nunca leer el
transcript de un subagente para enterarse de cómo le fue.

### Línea de base de consumo por tipo de consulta

**Síntoma.** No hay con qué comparar cuando algo "consumió mucho".

**Qué hacemos.** Anotar los números que devuelve cada corrida. Los de esta
sesión:

| Rol / tipo | Tarea | Tokens | Llamadas | Duración |
|---|---|---|---|---|
| `Explore` | Reconocimiento amplio (glosario y fichas) | 97.869 | 27 | 2m 40s |
| `Explore` | Reconocimiento amplio (issues y convenciones) | 103.855 | 23 | 3m 28s |
| `claude-code-guide` | Pregunta acotada (esquema de frontmatter) | 23.547 | 4 | 55s |
| investigador (emulado) | Búsqueda web con verificación | 70.120 | 33 | 4m 10s |
| dev (emulado, opus) | Issue #118, seis archivos, docs y un párrafo | 93.614 | 34 | 4m 02s |

**Al plugin.** Un reconocimiento amplio ronda los 100 k; una consulta acotada, los
25 k. Si un rol con alcance definido —investigador, reviewer, tester— se acerca a
los 100 k, el prompt está mal delimitado y hay que mirarlo, no aceptarlo.

### Los worktrees de los agentes ensucian el repo que aíslan

**Síntoma.** Con dos devs corriendo en paralelo, el hook de cierre avisó que
había archivos sin trackear. Era `.claude/worktrees/`.

**Causa.** `isolation: worktree` crea los checkouts **adentro del repo**. Cada uno
es un árbol completo y, apenas corre `npm ci`, pesa unos 100 MB. Aislan al
agente del árbol principal y al mismo tiempo aparecen en su `git status`.

**Qué hacemos.** `.claude/worktrees/` al `.gitignore`. Una línea, y hay que
ponerla **antes** de lanzar el primer dev, no cuando el hook se queja.

**Al plugin.** El plugin agrega esa línea al `.gitignore` al instalarse. Es la
clase de detalle que no rompe nada y aparece siempre.

---

## Coordinación entre agentes

### Un agente que no reporta no avisa que no reportó

**Síntoma.** Lancé tres exploradores en paralelo. El de pipeline de datos nunca
volvió. Me di cuenta porque me faltaba un informe, no porque algo fallara.

**Causa.** El modo de fallar es silencioso: no hay error, hay ausencia. Y si el
orquestador no anotó qué lanzó, la ausencia no se nota — se nota mucho después,
cuando falta el dato.

**Qué hacemos.** Anotar qué agentes se lanzaron y contra qué lista se van a
cotejar antes de seguir. En este caso cubrí el hueco explorando yo y no costó
tiempo, pero fue suerte, no diseño.

**Al plugin.** El orquestador lleva una lista de corridas en vuelo y la revisa
antes de cerrar una tanda. Si falta un parte, se relanza o se dice que falta:
nunca se sigue como si hubiera llegado.

### Un "barrí y no encontré nada" es una afirmación, no una ausencia

**Síntoma.** El dev de #118 cerró su parte diciendo que había barrido `data/`
buscando agroquímicos y calendario lunar, que el resultado era **cero**, y que
por lo tanto #132 arrancaba sin hallazgos. Son tres casos y están ahí:

```
$ grep -c "caldo bordel" data/huerta_gba.json
3
```

Acelga, arveja y rabanito. Arveja además menciona oxicloruro de cobre.

**Causa.** No sé qué patrón usó y no importa: lo que importa es que un negativo
**se lee como diligencia**. "Busqué y no hay" suena a trabajo hecho, mientras que
un positivo trae su evidencia adjunta y se verifica solo. El negativo no trae
nada que verificar, y ahí está la trampa.

Lo agarré de casualidad: había corrido ese mismo barrido antes y tenía los tres
casos en la cabeza. Sin eso, #132 arrancaba con un dato falso de base.

**Qué hacemos.** Todo negativo que vaya a apoyar una decisión se vuelve a correr,
y el comando se pide en el parte. Un negativo sin comando reproducible no entra
en ningún lado.

**Al plugin.** Va al prompt de todos los roles: **cuando reportes que no
encontraste algo, escribí el comando exacto con el que buscaste.** Para el
orquestador, la regla de oro: los positivos traen su prueba, los negativos hay
que ir a buscarla.

### Un dev que se le va del alcance, y uno que pregunta

**Síntoma.** El mismo dev encontró que `README.md` también tenía el conteo viejo
de tests. No lo tocó: lo preguntó en el parte, porque yo le había pedido el de
`CLAUDE.md`.

**Causa.** El prompt del rol dice "leé la issue entera, sobre todo *lo que no va
acá*, y no amplíes el alcance". Hizo exactamente eso.

**Qué hacemos.** Nada: así queremos que se comporte. Lo anoto porque es el
contraejemplo de la entrada de arriba y se lee junto. **El mismo agente que
inventó un negativo respetó el alcance con disciplina.** No se trata de confiar o
desconfiar de un agente entero, sino de saber qué tipo de afirmación verificar:
el juicio de alcance salió bien, el resultado de búsqueda salió mal.

### El `.gitignore` tiene que estar en la rama donde vas a commitear

**Síntoma.** Puse `.claude/worktrees/` en el `.gitignore` de la rama de #134, y
un rato después un `git add -A` en la rama de la bitácora se llevó los dos
worktrees como repos embebidos. Commiteado y pusheado antes de darme cuenta.

**Causa.** Dos errores encadenados, los dos míos. El `.gitignore` es **por rama**,
y la de la bitácora salía de `staging`, que no lo tenía. Y `git add -A` con
worktrees adentro del repo es una mala idea aunque el ignore esté puesto.

**Qué hacemos.** El ignore de los worktrees va a `staging` **antes** de abrir
cualquier rama de trabajo, no a la primera rama que lo necesite. Y mientras haya
agentes corriendo, `git add <archivo>`, nunca `-A`.

**Al plugin.** Refuerza la entrada anterior: el plugin pone la línea en el ignore
al instalarse, o sea en el tronco, y no en la rama de turno. Y el prompt del
orquestador dice que con worktrees vivos se commitea por archivo.

---

## Reparto y modelo

Primera medición, Tanda A. El dev de #118 corrió en **Opus** y la elección se
sostiene: la tarea era prosa de doctrina —redactar la regla que las otras diez
issues van a seguir, en el tono de las otras cuatro— y el resultado entró sin
retoques. Lo mecánico del mismo PR (corregir un número) no justificaba bajar a
Sonnet: era una línea dentro de una tarea de criterio.

Falta la comparación real, que es el dev de #128 en Sonnet sobre una tarea
mecánica. Se completa cuando reporte.

---

## Qué llevamos al plugin

La lista corta, para no releer todo:

1. **Instalarlo antes de arrancar la sesión.** Los roles no existen para la
   sesión que los crea.
2. **El orquestador lleva registro de lo que lanzó** y no cierra una tanda con un
   parte faltante.
3. **Pedir el campo, no el objeto**, en toda llamada que pueda devolver muchos
   elementos con cuerpo.
4. **Cada rol devuelve un parte, nunca diffs ni logs.** Es lo que permite
   sostener diecisiete issues sin llenarse de contexto inútil.
5. **Medir cada corrida** (tokens, llamadas, duración) contra la línea de base de
   su tipo.
6. **El investigador chequea el proxy antes de buscar**, y el orquestador no
   agenda tandas de datos si el egreso está cerrado.
7. **"No encontré fuente" es una respuesta buena, y hay que decírselo al rol**
   para que la dé.
8. **Antes de abrir una issue de investigación**, buscar si el repo ya contestó
   esa pregunta en un comentario.
9. **`.claude/worktrees/` al `.gitignore`** al instalar, antes del primer dev.
10. **Todo negativo se reporta con el comando exacto** y el orquestador lo
    vuelve a correr antes de apoyar una decisión en él.
11. **El ignore de los worktrees va al tronco**, y con agentes corriendo se
    commitea por archivo y nunca con `git add -A`.

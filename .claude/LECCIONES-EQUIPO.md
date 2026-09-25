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
Desde la sesión siguiente deberían resolver solos; en la Tanda B no pasó. La
receta vigente para emular, que además escribe en el pedido el límite de
herramientas del rol, está en «Los agentes del proyecto tampoco cargan en la
sesión siguiente».

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

**Al plugin.** El proxy lo chequea **el orquestador, antes de lanzar al
investigador**, que no tiene Bash. Si el egreso está cerrado, mejor saberlo
antes de gastar once búsquedas que después. Si igual un `WebFetch` da 403, el
investigador pega el error tal cual en el parte, host incluido, y el
orquestador vuelve a chequear. Y no se agendan tandas de datos en un entorno
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
categorías. El comentario de `SUSTRATO` en `src/lib/glosario.ts` ya decía,
textual: *"Ojo con la tentación de dar cinco recetas exactas, una por categoría
de suelo: **ninguna fuente da eso**"*.

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

**Causa.** Cada corrida devuelve tokens, llamadas y duración, pero hasta esta
sesión no se anotaban: la tabla de abajo es la primera medición. Sin registro,
"mucho" no tiene contra qué medirse.

**Qué hacemos.** Anotar los números que devuelve cada corrida. Los de esta
sesión:

| Rol / tipo | Tarea | Tokens | Llamadas | Duración |
|---|---|---|---|---|
| `Explore` | Reconocimiento amplio (glosario y fichas) | 97.869 | 27 | 2m 40s |
| `Explore` | Reconocimiento amplio (issues y convenciones) | 103.855 | 23 | 3m 28s |
| `claude-code-guide` | Pregunta acotada (esquema de frontmatter) | 23.547 | 4 | 55s |
| investigador (emulado) | Búsqueda web con verificación | 70.120 | 33 | 4m 10s |
| dev (emulado, opus) | Issue #118, seis archivos, docs y un párrafo | 93.614 | 34 | 4m 02s |
| dev (emulado, **sonnet**) | Issue #128, tarea "mecánica" de UI | **144.695** | **84** | **9m 09s** |
| tester (emulado, sonnet) | 3 baterías completas + merge de prueba | 156.002 | 109 | 33m 28s |

**Al plugin.** Un reconocimiento amplio ronda los 100 k; una consulta acotada, los
25 k. Si un rol con alcance definido —investigador, reviewer, tester— se acerca a
los 100 k sin hallazgos que lo justifiquen, el prompt está mal delimitado y
hay que mirarlo, no aceptarlo.

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

**Al plugin.** El orquestador verifica por tipo de afirmación, no por agente:
un negativo se vuelve a correr aunque el mismo dev haya cuidado el alcance. Y
el prompt del dev conserva lo de *lo que no va acá*, que es lo que hizo que
preguntara por `README.md` en vez de tocarlo.

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

### Dos ramas escriben sus capturas en el mismo lugar

**Síntoma.** El tester corrió la batería sobre una rama, cambió a la otra y
volvió a correr. Las capturas de la primera **se sobrescribieron**: mismo
`FASE=cantero-dia`, mismo directorio destino.

**Causa.** El destino de `npm run shots` depende de `FASE`, no de la rama. Con un
solo agente en un solo checkout eso nunca molestó; con un tester que compara dos
ramas, sí.

**Qué hacemos.** El tester copia las capturas a una carpeta por rama antes de
cambiar, o corre cada rama en su propio worktree. Lo agarró él solo y lo dijo en
el parte, que es lo que corresponde.

**Al plugin.** El prompt del tester lleva el paso de guardar las capturas por
rama antes de cambiar de checkout. Y el orquestador, cuando pida comparar dos
ramas, pide explícitamente las dos tandas de capturas.

### Playwright no puede bajarse el browser, y el que hay sirve

**Síntoma.** En el worktree, `playwright install` dio 403 contra
`cdn.playwright.dev` — la misma política de egreso que bloquea INTA.

**Causa.** El entorno trae Chromium preinstalado en `/opt/pw-browsers`, pero
`@playwright/test` 1.62 busca un nombre de revisión propio.

**Qué hacemos.** La receta está en «Playwright no encuentra el navegador», en
«Entorno» de `.claude/LECCIONES.md`. El tester lo resolvió solo y aclaró que
era del entorno y no algo que el dev tuviera que arreglar, que es la distinción
correcta.

**Al plugin.** Pertenece al setup del entorno, no al rol. Pero el prompt del
tester conviene que diga que si `playwright install` falla, mire
`/opt/pw-browsers` antes de darse por vencido.

---

## Reparto y modelo

Primera medición, Tanda A, y **el resultado va en contra de la política de modelo
que escribimos**.

| Issue | Modelo | Por qué se eligió | Tokens | Llamadas | Duración |
|---|---|---|---|---|---|
| #118 | Opus | Prosa de doctrina: criterio | 93.614 | 34 | 4m 02s |
| #128 | Sonnet | `id`s y chips: mecánico | **144.695** | **84** | **9m 09s** |

**Sonnet en la tarea mecánica salió 55 % más caro en tokens, con 2,5 veces las
llamadas y más del doble de tiempo que Opus en la de criterio.**

Los dos entregaron bien: #118 entró sin retoques, y #128 además detectó dos
errores de la issue —que eran doce secciones y no once, y que `descSuelo` no se
podía unificar porque `SUELOS` no tiene `desc`—. O sea que no es un problema de
calidad: es que llegar al mismo lugar le llevó muchos más pasos.

**La hipótesis, sin confirmar:** la tarea de #128 era mecánica *de describir* y no
*de ejecutar*. Tocaba doce secciones, un componente compartido con otro dev, CSS
pegajoso con accesibilidad medida, y dos constantes a unificar de las cuales una
no se podía. Eso es exploración, no tipeo. La etiqueta "mecánico" la puse yo
mirando el enunciado, no la forma real del trabajo.

**Qué hacemos.** No cambiar la política todavía con una sola medición, pero dejar
de clasificar por el enunciado. La pregunta no es "¿esto es mecánico?" sino
**"¿cuántos archivos tiene que entender antes de tocar el primero?"**. Si son
muchos, es exploración aunque el cambio final sean tres líneas.

**Al plugin.** El criterio de modelo se mide, no se declara. Y la tabla de consumo
por rol es lo que permite descubrir esto: sin los números, "Sonnet para lo
mecánico" habría quedado como una verdad del proyecto.

---

## Tanda B: #133 y #129, con los roles todavía emulados

### Los agentes del proyecto tampoco cargan en la sesión siguiente

**Síntoma.** Los cinco `.claude/agents/*.md` estaban en `staging` antes de
iniciar la sesión, `claude plugin validate .claude/agents` pasa, y
`subagent_type: "planner"` sigue dando *not found*. Los de `~/.claude/agents/`
(los `gsd-*`) y los de plugins sí aparecen.

**Causa probable.** No es el archivo ni el momento: el harness.
La sesión de la Tanda B corrió en la extensión de VSCode sobre el Agent SDK, y
ahí los agentes de usuario y de plugin cargaron y los del proyecto no. El Agent
SDK en sí no es: en #142, también sobre el Agent SDK, el reviewer cargó como
agente del proyecto, con su prompt y sus herramientas.
Queda algo de la extensión que no está documentado: la guía de Claude Code
listó las causas conocidas —`settingSources` sin `project`, frontmatter roto,
directorio creado a mitad de sesión— y ninguna aplica.

**Qué hacemos.** Seguir emulando. Emulado, el frontmatter del rol no se
aplica: lo que ponía va en la llamada y en el pedido. Ésta es la receta
vigente, y reemplaza la de la Tanda A:

- `general-purpose` para todos. `Explore` y `Plan` sacan Edit y Write, pero
  corren sin `CLAUDE.md`, y los roles lo necesitan: el reviewer revisa sus
  cinco reglas. Por eso ya no se usa `Explore` para leer, como en la Tanda A.
- `model:` explícito en la llamada, e `isolation: worktree` para dev y tester.
- El pedido dice "leé `.claude/agents/<rol>.md` y adoptalo" y **pone las
  herramientas de su `tools:` como límite**. Es un límite escrito, no una
  restricción: `general-purpose` sigue teniendo Bash y Edit. Sin eso queda
  sólo la frase del prompt del rol, sin el `tools:` que la hacía cumplir. Al
  terminar el reviewer, `git -C <worktree que revisó> status --short` y un
  `git log` sin commits nuevos dicen si editó. En su cwd no se ve:
  `.claude/worktrees/` está ignorado.

Esta tanda corrió sin el límite, y el investigador usó Bash (ver «El positivo
también se verificó, y costó un minuto»); por lo demás, anduvo en las siete
corridas y las dos reanudaciones. En la próxima sesión, lo primero es ver si
cargan: si el rol está entre los `subagent_type` de la herramienta Agent (el
*not found* trae la lista de los que sí). `/agents` es del CLI: lo corre la
persona, no el orquestador.

**Al plugin.** Los agentes de plugin cargan donde los del proyecto no. El
plugin no depende de `.claude/agents/` del repo, y es justamente por eso que
conviene que exista. Los roles van como agentes del plugin; el orquestador
arranca mirando si están entre los `subagent_type` y, si no, emula con la
receta de arriba.

### El tester no pudo tomar la rama porque el worktree del dev la tenía

**Síntoma.** `git checkout docs/129-suelos-direccion` en el worktree del tester
falló: git no deja la misma rama en dos worktrees. El tester lo resolvió solo
con `git reset --hard origin/<rama>` sobre su worktree y lo dijo en el parte.

**Causa.** El worktree del dev sigue vivo después del push, y tiene que
seguir: si el tester encuentra un bug, el arreglo vuelve al mismo dev y lo
hace ahí.

**Qué hacemos.** El orquestador pushea la rama del dev antes de llamar al
tester, y el tester trabaja sobre `origin/<rama>` sin tomar el nombre, en una
rama propia, `qa/<rama>`, que no se pushea. El orquestador lleva sus
tests a la rama del dev con `merge --ff-only`, pushea, y recién ahí borra el
worktree del tester y `qa/<rama>`. El worktree del dev se borra cuando cerró
el QA —el tester reportó en verde y sus tests están en la rama—, no antes.

**Al plugin.** Va al prompt del tester. Y el orquestador borra worktrees sólo
después de comprobar que `HEAD` coincide con `origin/<rama>` y que no hay
cambios sin commitear.

### Las correcciones del review vuelven al mismo dev, no a uno nuevo

**Síntoma.** Dos reviews con tres bloqueantes cada uno. Los dos devs se
reanudaron por mensaje con su contexto intacto y aplicaron todo en una vuelta:
el de #129 en 9 llamadas y dos minutos.

**Causa.** Un dev nuevo tendría que releer la issue, la rama y el review.

**Qué hacemos.** `SendMessage` al dev que escribió el código, con los hallazgos
ya decididos por el orquestador (qué va, qué no, qué se cambia de diseño).

**Al plugin.** El flujo es dev → reviewer → **mismo dev** → tester. Lo que el
orquestador decide antes de reenviar el review es lo que le ahorra al dev la
segunda lectura.

### La métrica de la issue definía la búsqueda y dejaba afuera el peor caso

**Síntoma.** #133 contaba "114 reglas de CSS usando `--texto-s` o
`--texto-xs` repartidas en 27 archivos" y ponía «La semana» como caso
ejemplar. `CarrilSemana.css` **no usa ningún token**: sus tamaños de letra
chica son 10, 11, 12 y 13 px a mano. El ejemplo de la issue no estaba en el
recuento de la issue.

**Causa.** El orquestador contó lo fácil de contar. Hay otras 86 a 89 reglas
en píxeles literales (según el tope que se tome) que el token no ve, y el
`Compost.css`, el que más letra chica tiene en píxeles (21 reglas), entraba al
recuento con 2.

**Qué hacemos.** Cuando una issue cuantifica, verificar **qué deja afuera la
métrica**, no sólo si el número está bien. 114 contra 115 no importaba; el
recuento por tokens contra el recuento por tamaño sí.

**Al plugin.** Extiende el punto 13 de «Qué llevamos al plugin»: las issues
del orquestador se verifican, y en las que traen un número, se verifica la
vara antes que la cifra.

### Quien redacta a partir de una cita la endurece

**Síntoma.** La cita dice *"hace muy difícil poder hablar de un sustrato
ideal"*. El dev escribió *"el INTA lo dice sin vueltas, no hay un sustrato
ideal"*. Y cargó confianza 9 porque el investigador la propuso. Se bajó a 7
por la escala del Glosario, que pide para 8-10 "fuentes oficiales o técnicas
que concuerdan", y acá había una. La de los datos (`meta.escala_confianza`)
admite 8-9 con "una fuente oficial clara": cuál manda lo decide #154.

**Causa.** Redactar para que suene bien tira hacia lo categórico, y la
confianza se tomó del dossier sin cotejarla con ninguna escala. Los dos errores
son de la misma familia: el texto se alejó de la fuente en el último paso, el
de escribir.

**Qué hacemos.** El reviewer coteja cada frase que atribuye algo a una fuente
contra la cita textual, palabra por palabra, y la confianza contra la escala de
los datos. Lo hizo, y fueron dos de sus tres bloqueantes. Cotejó contra la del
Glosario sin ver que los datos tienen otra: lo que cae entre las dos se
pregunta.

**Al plugin.** Va al prompt del reviewer, para diffs que toquen datos. Y al del
investigador: la confianza que propone se justifica contra la escala con que se
cargaron los datos, no contra su criterio. Si el repo publica dos escalas que
no coinciden, eso es una issue, no una regla del prompt.

### El positivo también se verificó, y costó un minuto

**Síntoma.** El investigador trajo la cita con página y comandos. Antes de
pasársela al dev, el orquestador bajó el PDF (esta sesión tenía el egreso
abierto) y corrió
`grep -n "sustrato ideal"`: línea 523, como decía. Un minuto.

**Causa.** La regla 1 de CLAUDE.md no tiene margen, y cotejar cuesta un minuto.

**Qué hacemos.** Un dato que va a entrar al catálogo lo coteja el orquestador
antes de pasárselo al dev, aunque venga con prueba adjunta, y no por
desconfianza.

**Al plugin.** El dossier trae dónde cotejar: la URL, la página y una frase
exacta de la cita. Los comandos los arma y los corre el orquestador, y dice qué
dio: el investigador no tiene Bash. Acá lo tenía porque lo emulaba
`general-purpose`, y emulado lo sigue teniendo aunque el pedido le escriba el
límite (ver «Los agentes del proyecto tampoco cargan en la sesión siguiente»).
Cotejar es parte del paso de carga, no una opción.

### El reviewer calcula, el tester mide, el orquestador decide

**Síntoma.** El reviewer de #133 hizo la cuenta: con un botón de 44 px debajo
de cada grupo, un grupo de una tarea quedaba igual o más alto que antes. Tenía
razón en la dirección. La decisión —un solo botón por día en vez de uno por
grupo— la tomó el orquestador antes de reenviar el review; el tester midió
después: antes entraban 3-4 filas del día en 390×844, y ahora las 6.

**Causa.** Un hallazgo de layout no se resuelve con aritmética ni se delega al
dev como "arreglalo": necesita una decisión de diseño y una medición.

**Qué hacemos.** Hallazgo de layout → decisión del orquestador → pedido de
medición explícito al tester (antes y después, en píxeles o en filas). El
tester de esta tanda corrió las capturas de `staging` antes de cambiar de
commit, que es lo que permitió comparar.

**Al plugin.** El prompt del tester acepta un "antes" y un "después" y guarda
las dos tandas por separado. Y el orquestador no reenvía un hallazgo de layout
sin decidirlo primero.

### El dev que mira su propio PNG

**Síntoma.** La captura nueva de #133 salía sin la planta que el test
insertaba, y pasaba en verde. El dev la agarró **mirando el PNG**.

**Causa.** La trampa del hash, en `.claude/LECCIONES.md`: cambiar de ruta no
vuelve a leer la base. Y un test de captura no afirma nada sobre la imagen.

**Qué hacemos.** El dev abre el PNG antes del parte. "Mirá las capturas" no es
sólo del tester.

**Al plugin.** Al prompt del dev: si agregás una captura, mirala.

### Consumo de la Tanda B

| Rol / tipo | Tarea | Tokens | Llamadas | Duración |
|---|---|---|---|---|
| `claude-code-guide` | Pregunta acotada (por qué no cargan los agentes) | 56.836 | 13 | 1m 57s |
| investigador (emulado, opus) | Un PDF de 97 páginas, una cita | 52.922 | 13 | 2m 40s |
| dev (emulado, opus) | #129, textos y una fuente | 75.033 | 31 | 5m 16s |
| dev #129 reanudado | Nueve puntos del review | 85.498 | 9 | 2m 13s |
| reviewer (emulado, opus) | #129, 4 archivos | 82.268 | 24 | 5m 09s |
| dev (emulado, opus) | #133, inventario de 27 archivos + carril | 146.573 | 61 | 13m 36s |
| dev #133 reanudado | Rediseño a un botón por día + dos specs | 203.131 | 44 | 11m 42s |
| reviewer (emulado, opus) | #133, 6 archivos | 95.477 | 32 | 5m 56s |
| tester (emulado, sonnet) | #129, batería + capturas | 81.018 | 39 | 11m 02s |
| tester (emulado, sonnet) | #133, batería + antes/después | 104.549 | 50 | 13m 11s |

Dos lecturas. **Los reviewers rondan los 90 k** y estuvieron cerca del umbral
de "prompt mal delimitado" de la línea de base; pero fueron el mejor gasto
de la tanda —seis bloqueantes reales en dos diffs—, así que el umbral no es
"100 k = mal": es "100 k sin hallazgos = mal". Y **en un agente reanudado,
las llamadas son de la vuelta sola, pero los tokens arrastran el contexto
anterior**: 44 llamadas no pueden incluir las 61 de la primera, y #129
reanudado da 85 k con 9 llamadas contra 75 k con 31. La tabla los anota tal
como llegan.

---

## Tanda C: #130, la primera corrida del tester como QA

QA y tester son el mismo rol. En esta tanda el tester, además de correr la
batería, probó la issue punto por punto rompiendo el código. Ese pedido ahora
está en `.claude/agents/tester.md`.

### El tester refutó la hipótesis del reviewer rompiendo el código a propósito

**Síntoma.** El reviewer sospechó que el link del pie de la hoja podía dejar el
`<dialog>` modal colgado al navegar, y pidió verificarlo a mano. El tester lo probó
en el navegador y funcionó; después **borró el `onClick` que lo cerraba** y los
tests siguieron pasando: React Router desmonta la ficha entera y el navegador
limpia el diálogo solo. El riesgo real no estaba ahí. Rompió el ancla y ahí
sí el test se puso rojo: eso es lo que el test fija.

**Causa.** Una hipótesis de comportamiento se lee plausible en el diff y no se
puede resolver leyendo más diff. Se resuelve mutando el código y mirando qué
test cae.

**Qué hacemos.** El reviewer entrega hipótesis con el pedido concreto de
verificación; el tester las prueba rompiendo y deja el test que fija lo que
sí importaba. Dos e2e salieron de acá, y un tercero de la issue. Tres de sus
aserciones, igual, no podían fallar (ver «Lo que se le escapó al tester»).

**Al plugin.** Es el pedido de probar rompiendo funcionando como se escribió:
"un test que nace verde no probó nada", que ahora está en el prompt del
tester. Y para el reviewer: cuando no puede confirmar, que lo diga como
hipótesis con su chequeo, no como hallazgo.

### El dev verificó con specs temporales y los borró; el tester los escribió de nuevo

**Síntoma.** El dev de #130 confirmó con dos specs de Playwright que el foco
volvía al botón y que el pie navegaba al ancla, y los borró antes de commitear
"para no ensuciar". El tester escribió los mismos dos, más uno, media hora después.

**Causa.** El rol del dev dice que los e2e los corre otro, y el dev lo leyó
como "no dejes specs nuevos". Lo que sobra es el trabajo repetido, no el spec.

**Qué hacemos.** Un spec que el dev escribió para convencerse se queda en
`e2e/` y se entrega en el parte con lo que verifica. El tester lo revisa, lo hace
fallar y decide si queda; si queda, lo cablea, en vez de reescribirlo.

**Al plugin.** Al prompt del dev: los specs que escribas para verificar se
commitean y se nombran en el parte; el tester decide si quedan.

### Un arreglo de una línea con ubicación conocida lo hace el orquestador

**Síntoma.** Del review quedó un comentario de CSS mal contado ("los 27 que
sobran" cuando el margen absorbe 16).

**Causa.** Reanudar al dev por eso cuesta decenas de miles de tokens;
corregirlo en el worktree del dev, una llamada.

**Qué hacemos.** Si el hallazgo es una línea, está ubicado y no cambia
comportamiento, lo corrige el orquestador y lo dice. Todo lo demás vuelve al
dev.

**Al plugin.** Regla del orquestador con su límite escrito: una línea,
ubicada, sin comportamiento. Si hay que entender algo para arreglarlo, no
califica. Este mismo arreglo no calificaba: el comentario nuevo decía que los
16 px volvían al padding, y 3 de ellos quedaban encima del «cuándo». Era el bug
de los 3 px, que después hubo que arreglar.

### Tres errores más en una issue del orquestador

**Síntoma.** #130 hablaba de "Los chips de labor de `Cuidados.tsx`, que hoy
mandan a `/glosario#labores` a secas", que no existen (hay una etiqueta de
texto y un link en la bajada), nombraba `SUELOS` como si viviera en
`glosario.ts` (vive en otro módulo) y decía que la hoja leería de `PALABRAS`
mientras "Lo que no va acá" dejaba justamente esos términos para la issue
siguiente.

**Causa.** La issue salió sin cotejar sus citas contra el código ni sus
secciones entre sí.

**Qué hacemos.** Lo del punto 13 de «Qué llevamos al plugin»: se verifica la
issue y se le avisa al dev lo que esté mal. Por eso ninguno de los tres lo
frenó. Sigue haciendo falta: de las cinco issues verificadas hasta acá (#118,
#128, #129, #133 y #130), cuatro tenían algo mal.

**Al plugin.** Antes de publicar una issue, el orquestador corre `git grep`
sobre cada archivo y símbolo que cita, y chequea que "Qué hacer" no pida lo
que "Lo que no va acá" deja afuera.

### Lo que se le escapó al tester

**Síntoma.** Después de su pasada aparecieron tres cosas en el mismo PR, y
ninguna la encontró la batería. El «cuándo» de cada labor se quedaba con los
últimos 3 px del botón de la labor: un toque en ese borde no abría nada. Un e2e
afirmaba que el documento no tenía el atributo `inert`, que `showModal()` no
pone nunca: pasaba pasara lo que pasara. Y las dos aserciones de
`dialog.count()` tampoco podían fallar: la propia mutación del tester, borrar
el `onClick`, las había dejado en verde, y el tester las dejó igual. Los 3 px se le
pasaron también al reviewer y al orquestador en su primera pasada, cuando
corrigió el comentario del margen (1e7a562, en #143).

**Causa.** El target se midió por la caja, que daba 44 px, y no por lo que
recibe el toque. Y el "cada test visto en rojo" se cumplió por test, no por
aserción. Y una mutación que deja el test en verde se leyó como «el riesgo
no estaba ahí», no como «esta aserción sobra».

**Qué hacemos.** Los targets se miden con `elementFromPoint` sobre toda el
área, bordes incluidos pero medio píxel adentro. Cada aserción nueva se ve en
rojo por separado, y la que no cae con ninguna mutación sobra.

El arreglo de los 3 px lo hizo el orquestador, y cambia comportamiento: no
calificaba para el punto 25 de «Qué llevamos al plugin» y tendría que haber
vuelto al dev.

**Al plugin.** Las dos van al prompt del tester, con estos casos como ejemplo.

### Consumo de la Tanda C

| Rol / tipo | Tarea | Tokens | Llamadas | Duración |
|---|---|---|---|---|
| dev (emulado, opus) | #130, componente nuevo, 12 archivos (8 de código), 2 specs borrados | 174.350 | 105 | 16m 28s |
| reviewer (emulado, opus) | #130, 12 archivos + merge de prueba con #140 | 115.860 | 30 | 7m 58s |
| tester como QA (emulado, sonnet) | issue punto por punto + batería + 3 e2e con mutaciones | 165.458 | 77 | 21m 35s |

Como QA, el tester cuesta entre 1,6 y 2 veces lo de la tanda anterior
(81-104 k): escribe tests, los hace fallar y corre la batería dos veces. No vio
los tres problemas de la entrada anterior, pero dejó tres comportamientos
fijados y una hipótesis descartada con evidencia. Es el gasto que reemplaza a
"lo probé a mano y andaba".

El reviewer pasó los 100 k con un hallazgo de una línea y una hipótesis que no
se sostuvo, y se le pasaron los 3 px. Lo que suma el merge de prueba con #140
no está medido aparte, así que no se sabe si es el prompt mal delimitado que
dice la línea de base o el merge.

**Al plugin.** El merge de prueba se le pide al reviewer como tarea aparte, con
su propia medición.

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
   su tipo. Un paso que se suma a un rol, como el merge de prueba del reviewer,
   se pide y se mide aparte.
6. **El orquestador chequea el proxy antes de lanzar al investigador**, que no
   tiene Bash y pega tal cual el error que le dé un `WebFetch`. Si el egreso
   está cerrado, no se agendan tandas de datos.
7. **"No encontré fuente" es una respuesta buena, y hay que decírselo al rol**
   para que la dé.
8. **Antes de abrir una issue de investigación**, buscar si el repo ya contestó
   esa pregunta en un comentario.
9. **`.claude/worktrees/` al `.gitignore`** al instalar, antes del primer dev.
10. **Todo negativo se reporta con el comando exacto** y el orquestador lo
    vuelve a correr antes de apoyar una decisión en él.
11. **El ignore de los worktrees va al tronco**, y con agentes corriendo se
    commitea por archivo y nunca con `git add -A`.
12. **Elegir modelo por cuántos archivos hay que entender**, no por si el cambio
    final parece mecánico.
13. **Las issues que escribe el orquestador también se verifican.** Cuatro de
    las cinco verificadas hasta ahora tenían algo mal. Antes de publicar cada
    una, `git grep` sobre lo que cita, y "Qué hacer" contra "Lo que no va acá".
14. **Las capturas se guardan por rama** antes de cambiar de checkout.
15. **Un tester que compara ramas necesita su propio worktree**, o pisa su
    propio trabajo.
16. **Los agentes del proyecto no cargan en todos los harness; los de plugin
    sí.** Es una razón más para el plugin. Los roles van como agentes del
    plugin; el orquestador arranca mirando si están entre los `subagent_type`
    y, si no, emula con la receta de «Los agentes del proyecto tampoco cargan
    en la sesión siguiente».
17. **El tester no toma la rama del dev**: el orquestador la pushea, y el
    tester trabaja en `qa/<rama>`, sobre `origin/<rama>`. El orquestador lleva
    sus tests con `merge --ff-only`, y el worktree del dev vive hasta que
    cierre el QA: el tester reportó en verde y sus tests están en la rama.
18. **Las correcciones del review vuelven al mismo dev por mensaje**, con lo
    que el orquestador ya decidió.
19. **En una issue con números, verificar la vara antes que la cifra.**
20. **El reviewer coteja cada frase atribuida contra la cita textual y la
    confianza contra la escala de los datos**; si el repo tiene dos que no
    coinciden, lo que cae entre ellas va como pregunta.
21. **Un hallazgo de layout se decide y se mide**: decisión del orquestador,
    medición del tester antes y después, nunca "arreglalo" al dev.
22. **Un dato que entra al catálogo lo coteja el orquestador aunque venga con
    prueba**: con la URL, la página y la frase del dossier, baja el documento,
    la busca y dice qué dio antes de pasárselo al dev. Es un minuto.
23. **El reviewer entrega hipótesis con su chequeo, y se prueban rompiendo el
    código.** Si la mutación la confirma, queda el test que la mostró en rojo;
    si la descarta, no queda una aserción para ella.
24. **Los specs que el dev escribe para convencerse se commitean**, no se
    borran, y el tester decide si quedan. **La captura que agrega, la mira.**
25. **Una línea, ubicada, sin comportamiento y sin nada que entender para
    arreglarla, la arregla el orquestador.** Todo lo demás vuelve al dev.
26. **Cada aserción se ve en rojo por separado, y un target se mide por
    dónde entra el toque** (`elementFromPoint`), no por su caja.

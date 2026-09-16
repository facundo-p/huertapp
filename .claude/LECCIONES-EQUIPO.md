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

**Al plugin.** Un reconocimiento amplio ronda los 100 k; una consulta acotada, los
25 k. Si un rol con alcance definido —investigador, reviewer, tester— se acerca a
los 100 k, el prompt está mal delimitado y hay que mirarlo, no aceptarlo.

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

---

## Reparto y modelo

Todavía sin entradas: se llena cuando corran las primeras tandas y se pueda
decir si Sonnet alcanzó donde lo pusimos y si Opus quedó grande.

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

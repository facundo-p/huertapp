#!/bin/bash
# PreToolUse (Bash)
#
# Bloquea los mata-procesos por patrón. Esto pasó de verdad en este repo: un
# `pkill -f vite` para limpiar el dev server propio se llevó puesto el de otro
# proyecto que estaba abierto en la misma máquina. El patrón no distingue de
# quién es el proceso, y el daño cae fuera del repo, donde no se ve.
#
# La alternativa siempre existe: guardar el PID al lanzar y matar ese, o usar
# un puerto propio con `npx vite --port NNNN`.

cmd=$(jq -r '.tool_input.command // empty')
[ -z "$cmd" ] && exit 0

if echo "$cmd" | grep -Eq '(^|[;&|[:space:]])(pkill|killall)([[:space:]]|$)'; then
  cat >&2 <<'FIN'
`pkill` / `killall` matan por patrón y no distinguen procesos de otros
proyectos. En esta máquina ya se cargaron el dev server de otro repo.

En vez de eso:
  · lanzá con puerto propio:  npx vite --port 5199 &  →  guardá $! y matá ese PID
  · o dejá que Playwright maneje el servidor (webServer en playwright.config.ts,
    con reuseExistingServer: ya está configurado)
  · si de verdad hace falta, matá por PID exacto después de mirar `lsof -ti:PUERTO`
FIN
  exit 2
fi

exit 0

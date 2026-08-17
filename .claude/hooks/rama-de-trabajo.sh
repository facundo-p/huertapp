#!/bin/bash
# PreToolUse (Bash)
#
# Impide commitear o pushear estando parado en `main`.
#
# `main` es lo que está publicado: cada push dispara el deploy a GitHub Pages y
# le cambia la app a quien ya la tiene instalada. Por eso a main solo se llega
# por un release —un PR desde `staging`, con su versión y su entrada de
# changelog— y nunca commiteando encima.
#
# El merge del release no pasa por acá: lo hace `gh pr merge`, del lado de
# GitHub, que es justo lo que se quiere.

entrada=$(cat)
cmd=$(printf '%s' "$entrada" | jq -r '.tool_input.command // empty')
[ -z "$cmd" ] && exit 0

# solo interesan commit y push
echo "$cmd" | grep -Eq 'git[[:space:]]+(commit|push)' || exit 0

rama=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
[ "$rama" = "main" ] || exit 0

cat >&2 <<'FIN'
Estás parado en `main`, y a main no se commitea ni se pushea directo.

main es lo que está publicado: cada push dispara el deploy y le cambia la app a
quien ya la tiene instalada. Los cambios van a `staging`:

  git checkout staging          # o: git switch -c staging

Y a main se llega por un release, cuando la persona lo pide: PR de staging a
main, con el bump de versión y la entrada del changelog. Está el procedimiento
completo en la skill `release`.
FIN
exit 2

#!/bin/bash
# PreToolUse (Edit|Write|MultiEdit|NotebookEdit)
#
# Bloquea la edición a mano de archivos generados. No es burocracia: editarlos
# "funciona" —la app toma el cambio— y el siguiente `npm run data:build` o
# `npm run build` lo borra sin decir nada. El trabajo se pierde horas después,
# lejos de donde se hizo, y cuesta muchísimo darse cuenta.
#
# Salida 2 = bloquea la herramienta y le pasa stderr a Claude como explicación.

# stdin se lee UNA sola vez: el segundo `jq` de un pipe se encuentra el
# stream vacío y devuelve nada, y el hook deja pasar todo en silencio.
entrada=$(cat)
ruta=$(printf '%s' "$entrada" | jq -r '.tool_input.file_path // empty')
[ -z "$ruta" ] && exit 0

raiz=$(printf '%s' "$entrada" | jq -r '.cwd // empty')
# relativa a la raíz del repo, para que matchee igual con paths absolutos
rel="${ruta#"$raiz"/}"

case "$rel" in
  data/huerta_gba_enriquecido.json)
    cat >&2 <<'FIN'
Ese archivo es generado: lo pisa `npm run data:build` en cuanto se corra.

Editá la fuente que corresponda y regenerá:
  · datos por especie (calendario, días, temperaturas, asociaciones)
      → data/enriquecimiento.json
  · el modelo climático o el afinado a décadas
      → scripts/clima-gba.mjs / scripts/afinar-calendario.mjs
  · la forma del JSON de salida
      → scripts/build-enriched.mjs

  npm run data:build && npm test
FIN
    exit 2
    ;;
  data/REVISION_CALENDARIO.md)
    echo "Generado por \`npm run data:tabla\`. Cambiá los datos de origen y regeneralo." >&2
    exit 2
    ;;
  dist/*)
    echo "dist/ es salida del build. Editá src/ o scripts/ y corré \`npm run build\`." >&2
    exit 2
    ;;
  data/huerta_gba.json)
    # No se bloquea —a veces hay que corregir la investigación de base— pero
    # sí se avisa, porque es la capa citable y tiene reglas propias.
    cat >&2 <<'FIN'
Ojo: data/huerta_gba.json es la base investigada, la capa citable.

Todo dato que se toque acá necesita `fuentes` con URL y `confianza`. Si lo que
querés es derivar o interpretar algo, va en data/enriquecimiento.json, que es
la capa de interpretación; la base queda tal como la dijeron las fuentes.
FIN
    exit 0
    ;;
esac

exit 0

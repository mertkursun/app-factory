#!/bin/bash
# PostToolUse: Edit|Write sonrası değişen .ts/.tsx dosyasını lint + format et.
# Çıktı Claude'a geri döner, böylece hataları hemen görür.

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

[ -z "$FILE" ] && exit 0
case "$FILE" in
  *.ts|*.tsx) ;;
  *) exit 0 ;;
esac

# Dosyanın ait olduğu app kökünü bul (package.json olan en yakın üst dizin)
DIR=$(dirname "$FILE")
while [ "$DIR" != "/" ] && [ ! -f "$DIR/package.json" ]; do
  DIR=$(dirname "$DIR")
done
[ -f "$DIR/package.json" ] || exit 0

cd "$DIR" || exit 0
if [ -x node_modules/.bin/prettier ]; then
  node_modules/.bin/prettier --write "$FILE" >/dev/null 2>&1
fi
if [ -x node_modules/.bin/eslint ]; then
  OUT=$(node_modules/.bin/eslint "$FILE" 2>&1)
  if [ -n "$OUT" ]; then
    echo "ESLint ($FILE):"
    echo "$OUT" | head -40
  fi
fi
exit 0

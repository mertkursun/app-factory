#!/bin/bash
# PreToolUse: Edit|Write — .env dosyalarına yazmayı engelle (.env.example hariç).

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
[ -z "$FILE" ] && exit 0

BASE=$(basename "$FILE")
case "$BASE" in
  .env.example|.env.sample) exit 0 ;;
  .env|.env.*)
    echo "Engellendi: $BASE dosyasına yazılamaz. Şablonu .env.example'a yaz, gerçek değerleri kullanıcı girer." >&2
    exit 2 ;;
esac
exit 0

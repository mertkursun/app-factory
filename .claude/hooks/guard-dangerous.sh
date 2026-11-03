#!/bin/bash
# PreToolUse: Bash — dışa etkili / yıkıcı komutları engelle.
# exit 2 = engelle ve mesajı Claude'a göster.

INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
[ -z "$CMD" ] && exit 0

block() {
  echo "Engellendi: $1. Bu komutu yalnızca kullanıcı açıkça isterse ve kendisi çalıştırırsa." >&2
  exit 2
}

echo "$CMD" | grep -qE '(^|\s|&&|\|\|)eas\s+submit'        && block "eas submit (store'a gönderim)"
echo "$CMD" | grep -qE '(^|\s|&&|\|\|)npm\s+publish'       && block "npm publish"
echo "$CMD" | grep -qE 'git\s+push\s+.*--force'            && block "git push --force"
echo "$CMD" | grep -qE 'rm\s+-rf\s+(/|~|\$HOME)(\s|$)'     && block "rm -rf kök/ev dizini"
echo "$CMD" | grep -qE 'git\s+(reset\s+--hard|clean\s+-fd)' && block "yıkıcı git komutu"
echo "$CMD" | grep -qE 'supabase\s+db\s+push'                && block "supabase db push (prod şema değişikliği)"
echo "$CMD" | grep -qE 'supabase\s+db\s+reset\s+.*--linked'  && block "supabase db reset --linked (prod sıfırlama)"

exit 0

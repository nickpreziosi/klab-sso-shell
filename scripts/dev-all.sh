#!/usr/bin/env bash
# Start shell + child apps. Each next dev MUST run from its own repo root.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORTS=(3000 3001 3002 3003)

echo "Stopping anything still bound to ports ${PORTS[*]}..."
for port in "${PORTS[@]}"; do
  pids=$(lsof -ti ":$port" 2>/dev/null || true)
  if [ -n "$pids" ]; then
    echo "  port $port → kill $pids"
    kill -9 $pids 2>/dev/null || true
  fi
done
sleep 1

next_bin() {
  local dir="$1"
  if [ -x "$dir/node_modules/.bin/next" ]; then
    echo "$dir/node_modules/.bin/next"
  else
    echo "npx next"
  fi
}

SHELL_NEXT="$(next_bin "$ROOT")"
KRISK_NEXT="$(next_bin "$ROOT/../ux-krisk")"
KBPM_NEXT="$(next_bin "$ROOT/../keo-core-admin-web-ui")"
KLEADS_NEXT="$(next_bin "$ROOT/../klab-gbl-kleads-portal-web-ui")"

echo ""
echo "Starting:"
echo "  Shell   → http://app.lvh.me:3000"
echo "  K Risk  → http://krisk.lvh.me:3001"
echo "  KBPM    → http://kbpm.lvh.me:3002"
echo "  K Leads → http://kleads.lvh.me:3003"
echo ""

# Bind 127.0.0.1; *.lvh.me resolves there via public DNS. (.localhost can't share SSO cookies.)
exec "$ROOT/node_modules/.bin/concurrently" \
  --kill-others-on-fail \
  --names "SHELL,KRISK,KBPM,KLEADS" \
  --prefix-colors "blue,cyan,green,magenta" \
  "cd \"$ROOT\" && exec $SHELL_NEXT dev --hostname 127.0.0.1 --port 3000" \
  "cd \"$ROOT/../ux-krisk\" && exec $KRISK_NEXT dev --hostname 127.0.0.1 --port 3001" \
  "cd \"$ROOT/../keo-core-admin-web-ui\" && exec $KBPM_NEXT dev --hostname 127.0.0.1 --port 3002" \
  "cd \"$ROOT/../klab-gbl-kleads-portal-web-ui\" && exec $KLEADS_NEXT dev --hostname 127.0.0.1 --port 3003"

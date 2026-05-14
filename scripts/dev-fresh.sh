#!/usr/bin/env bash
# 포트에 남은 Next 프로세스 종료 → .next 삭제 → dev (청크 누락/331.js류 예방)
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if command -v lsof >/dev/null 2>&1; then
  for port in 3000 3001; do
    pids="$(lsof -ti:"$port" -sTCP:LISTEN 2>/dev/null || true)"
    if [[ -n "${pids}" ]]; then
      # shellcheck disable=SC2086
      kill -9 ${pids} 2>/dev/null || true
    fi
  done
fi

rm -rf .next

if [[ ! -f "${ROOT}/node_modules/next/dist/bin/next" ]] && [[ ! -x "${ROOT}/node_modules/.bin/next" ]]; then
  echo "next가 없습니다. 프로젝트 루트에서 npm install 을 먼저 실행하세요." >&2
  exit 1
fi

exec "${ROOT}/node_modules/.bin/next" dev "$@"

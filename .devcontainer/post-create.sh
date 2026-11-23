#!/usr/bin/env bash
set -euo pipefail
# The repository pins the minimum supported runtime in .nvmrc.
if command -v nvm >/dev/null 2>&1; then
  nvm install
elif [ -s "${NVM_DIR:-/usr/local/share/nvm}/nvm.sh" ]; then
  source "${NVM_DIR:-/usr/local/share/nvm}/nvm.sh"
  nvm install
fi
npm ci

#!/usr/bin/env bash
# Produit build/artefact.html : la même page sans <!doctype>, <html>, <head>, <body>,
# format attendu pour la publier comme Artifact claude.ai.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p build
sed -e '1,2d' -e 's#^</head><body>$##' -e 's#^</body></html>$##' index.html > build/artefact.html
echo "build/artefact.html prêt"

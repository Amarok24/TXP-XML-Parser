#!/bin/sh
# echo $@
echo "Bundling TS files and converting to a single JS file..."

deno bundle src/index.ts dist/index.js

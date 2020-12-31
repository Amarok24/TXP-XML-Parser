#!/bin/sh
# echo "Running TS code"
# echo $@

deno run --allow-net --allow-read --allow-write src/index.ts

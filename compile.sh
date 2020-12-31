#!/bin/sh
# echo $@
echo "Compiling TS files to one executable file..."

deno compile --unstable ./src/index.ts

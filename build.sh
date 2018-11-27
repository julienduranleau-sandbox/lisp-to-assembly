#!/bin/bash
node src/main.js > bin/output.asm
nasm -f elf64 bin/output.asm && gcc bin/output.o -o bin/output -no-pie && ./bin/output

ref: http://notes.eatonphil.com/compiler-basics-lisp-to-assembly.html

Dependencies: x64 system, nasm

Converts lisp style addition to assembly and solves it. Eg: `(+ 1 (+ 2 3) (+ 4 5 2))` to `17`

```sh
./build.sh
```

Sample assembly generated for the above example:
```asm
extern printf, exit

section .data
   format db "%d", 10, 1

section .text
   global main

   plus:
       add rdi, rsi
       add rdi, rdx
       mov rax, rdi
       ret

   main:
       mov rdi, 0
       mov rsi, 0
       mov rdx, 0
       mov rax, 0

      mov rdi, 1
      push rdi
      push rsi
      push rdx
      mov rdi, 2
      mov rsi, 3
      call plus
      pop rdx
      pop rsi
      pop rdi
      mov rsi, rax
      push rdi
      push rsi
      push rdx
      mov rdi, 4
      mov rsi, 5
      mov rdx, 2
      call plus
      pop rdx
      pop rsi
      pop rdi
      mov rdx, rax
      call plus
      
       ; Print value stored in rax register
       sub rsp, 8
       mov rsi, rax ; value to print
       mov rdi, format
       call printf

       ; Exit
       mov rdi, 0
       call exit
```

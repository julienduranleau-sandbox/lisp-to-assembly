module.exports = class Compiler {
    constructor() {
        this.output = null
    }

    get registerIndices() { return ['rdi', 'rsi', 'rdx'] }
    get functions() { return {
        '+': 'plus'
    }}

    compile(ast) {
        this.output = ''

        this.prefix()
        this.compileFn(ast[0], ast.slice(1))
        this.postfix()

        return this.output
    }

    prefix() {
        this.emit('' +
            'extern printf, exit\n' +
            '\n' +
            'section .data\n' +
            '   format db "%d", 10, 1\n' +
            '\n' +
            'section .text\n' +
            '   global main\n' +
            '\n' +
            '   plus:\n' +
            '       add rdi, rsi\n' +
            '       add rdi, rdx\n' +
            '       mov rax, rdi\n' +
            '       ret\n' +
            '\n' +
            '   main:\n' +
            '       mov rdi, 0\n' +
            '       mov rsi, 0\n' +
            '       mov rdx, 0\n' +
            '       mov rax, 0\n' +
        '', 0)
    }

    postfix() {
        this.emit('' + 
            '\n' +
            '       ; Print value stored in rax register\n' +
            '       sub rsp, 8\n' +
            '       mov rsi, rax ; value to print\n' +
            '       mov rdi, format\n' +
            '       call printf\n' +
            '\n' +
            '       ; Exit\n' +
            '       mov rdi, 0\n' +
            '       call exit\n' +
        '', 2)
    }

    // call (fn arg1 arg2 arg3)
    compileFn(fn, args) {

        // apply each argument values to registers
        for (let i = 0; i < args.length; i++) {

            let registerIndex = this.registerIndices[i]

            // if argument is an array (function call), solve it first
            if (Array.isArray(args[i])) {
                // save current state
                for (let idx = 0; idx < this.registerIndices.length; idx++) {
                    this.emit(`push ${this.registerIndices[idx]}`)
                }
                // solve
                this.compileFn(args[i][0], args[i].slice(1))
                // restore state
                for (let idx = this.registerIndices.length - 1; idx >= 0; idx--) {
                    this.emit(`pop ${this.registerIndices[idx]}`)
                }
                // apply value from function output
                this.emit(`mov ${registerIndex}, rax`)

            // else if the argument is a value apply directly to register
            } else {
                this.emit(`mov ${registerIndex}, ${args[i]}`) // move number in register
            }
        }

        // call the function
        this.emit(`call ${this.functions[fn] || fn}`)
    }

    emit(code, indentLevel = 2) {
        this.output += '   '.repeat(indentLevel) + code + "\n"
    }
}

module.exports = class Compiler {
    constructor() {
        this.output = null
    }

    get memoryIndices() { return ['rdi', 'rsi', 'rdx'] }
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
        this.emit('extern printf, exit', 0)
            this.emit('', 0)
        this.emit('section .data', 0)
            this.emit('format db "%x", 10, 1', 1)
            this.emit('', 0)
        this.emit('section .text', 0)
            this.emit('global main', 1)
            this.emit('', 0)
            this.emit('plus:', 1)
                this.emit('add rdi, rsi', 2)
                this.emit('mov rax, rdi', 2)
                this.emit('ret', 2)
                this.emit('', 0)
            this.emit('main:', 1)
    }

    postfix() {
        this.emit('; Print value stored in rax register')
        this.emit('sub rsp, 8')
        this.emit('mov rsi, rax')
        this.emit('mov rdi, format')
        this.emit('call printf')
        this.emit('')
        this.emit('; Exit')
        this.emit('mov rdi, 0')
        this.emit('call exit')
    }

    compileFn(fn, args, memoryIndex) {
        for (let i = 0; i < args.length; i++) {
            this.emit(`push ${this.memoryIndices[i]}`)
            this.compileArgument(args[i], this.memoryIndices[i])
        }

        this.emit(`call ${this.functions[fn] || fn}`)

        for (let i = args.length - 1; i >= 0; i--) {
            this.emit(`pop ${this.memoryIndices[i]}`)
        }

        if (memoryIndex) {
            this.emit(`mov ${memoryIndex}, rax`)
        }

        this.emit('')
    }

    compileArgument(arg, memoryIndex) {
        if (Array.isArray(arg)) {
            this.compileFn(arg[0], arg.slice(1), memoryIndex)
            return
        }

        this.emit(`mov ${memoryIndex}, ${arg}`) // move number in register
    }

    emit(code, indentLevel = 2) {
        this.output += '   '.repeat(indentLevel) + code + "\n"
    }
}

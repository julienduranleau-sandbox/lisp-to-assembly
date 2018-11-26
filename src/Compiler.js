module.exports = class Compiler {
    constructor() {
        this.output = null
    }

    get memoryIndices() { return ['RDI', 'RSI', 'RDX'] }
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
        this.emit('.global _main', 1)
        this.emit('.text', 1)
        this.emit('')
        this.emit('plus:')
        this.emit('ADD RDI, RSI', 1)
        this.emit('MOV RAX, RDI', 1)
        this.emit('RET', 1)
        this.emit('')
        this.emit('_main:')
    }

    postfix() {
        this.emit('MOV RDI, RAX')
        this.emit('MOV RAX, 60')
        this.emit('SYSCALL')
    }

    compileFn(fn, args, memoryIndex) {
        for (let i = 0; i < args.length; i++) {
            this.emit(`PUSH ${this.memoryIndices[i]}`)
            this.compileArgument(args[i], this.memoryIndices[i])
        }

        this.emit(`CALL ${this.functions[fn] || fn}`)

        for (let i = args.length - 1; i >= 0; i--) {
            this.emit(`POP ${this.memoryIndices[i]}`)
        }

        if (memoryIndex) {
            this.emit(`MOV ${memoryIndex}, RAX`)
        }

        this.emit('')
    }

    compileArgument(arg, memoryIndex) {
        if (Array.isArray(arg)) {
            this.compileFn(arg[0], arg.slice(1), memoryIndex)
            return
        }

        this.emit(`MOV ${memoryIndex}, ${arg}`) // move number in register
    }

    emit(code, indentLevel = 0) {
        this.output += '   '.repeat(indentLevel) + code + "\n"
    }
}

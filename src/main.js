const UnitTesting = require('./UnitTesting.js')
const Parser = require('./Parser.js')
const Compiler = require('./Compiler.js')

//UnitTesting.assert_eq((new Parser()).parse('(+ 1 (+ 2 (+ 1 2)) 5)'), ['+', 1, ['+', 2, ['+', 1, 2]], 5])

let ast = (new Parser()).parse('(+ 1 (+ 2 3) (+ 4 5 2))')
let asm = (new Compiler()).compile(ast)
console.log(asm)


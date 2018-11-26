module.exports = class Parser {
    constructor() {}

    parse(str) {
        let rootScope = []
        let scope = rootScope

        let token = ''

        for (let index = 0, nChars = str.length; index < nChars; index++) {
            const char = str[index]

            switch (char) {
                case '(':
                    let newScope = []
                    newScope.parentScope = scope
                    scope.push(newScope)
                    scope = newScope
                    break

                case ')':
                    if (token.length) scope.push(+token || token)
                    token = ''
                    scope = scope.parentScope
                    break
                    
                case '+':
                    scope.push('+')
                    break

                case ' ':
                    if (token.length) scope.push(+token || token)
                    token = ''
                    break

                default:
                    token += char
                    break
            }
        }

        return rootScope[0]
    }
}

module.exports = class UnitTesting {
    static assert_eq(result, expected, comment) {
        // turn objects in strings if necessary
        result = typeof(result) === "object" ? JSON.stringify(result) : result
        expected = typeof(expected) === "object" ? JSON.stringify(expected) : expected

        const success = result === expected

        if (!success) console.error(`|= Failed Test =| Got ${result}, expected ${expected}`)
        else console.log('|= Test passed =|')

        return success
    }
}

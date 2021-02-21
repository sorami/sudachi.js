const index = require('../src/index')

test('sum function', () => {
    expect(index.sum(1, 2)).toBe(3)
})

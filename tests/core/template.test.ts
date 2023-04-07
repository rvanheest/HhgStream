import { htmlEncode, positionCssClass, TextPosition } from "../../src/core/template"

describe('htmlEncode', () => {
    const cases = [
        ['helemaal geen replacements', 'helemaal geen replacements'],
        ['Mattheüs', 'Matthe&uuml;s'],
        ['Matthéüs', 'Matth&eacute;&uuml;s'],
        ['Er is meer dan één replacement', 'Er is meer dan &eacute;&eacute;n replacement'],
        ['Mattheüs en Timoteüs', 'Matthe&uuml;s en Timote&uuml;s'],
    ]

    test.each(cases)('htmlEncode(%s) === %s', (input, expectedOutput) => {
        expect(htmlEncode(input)).toBe(expectedOutput)
    })
})

describe('positionCssClass', () => {
    const cases = [
        { input: TextPosition.TopLeft, expectedOutput: 'top-left' },
        { input: TextPosition.BottomLeft, expectedOutput: 'bottom-left' },
        { input: TextPosition.TopRight, expectedOutput: 'top-right' },
        { input: TextPosition.BottomRight, expectedOutput: 'bottom-right' },
        { input: TextPosition.Center, expectedOutput: 'center' },
    ]

    test.each(cases)('positionCssClass(%s) === %s', ({ input, expectedOutput }) => {
        expect(positionCssClass(input)).toBe(expectedOutput)
    })
})

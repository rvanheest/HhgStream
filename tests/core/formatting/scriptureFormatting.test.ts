import { formatScripture } from "../../../src/core/formatting/scriptureFormatting";

describe('formatScripture', () => {
    describe('no further formatting', () => {
        const cases = [
            'Johannes 1 : 1 - 18',
            'Johannes 1',
            'Johannes 1 : 1',
            'Johannes 1 : 1b',
            'Johannes 1 : 1b - 2a',
            'Johannes 1 : 1 - 9',
            'Judas',
            'Judas : 3 - 5',
            'Johannes 7 : 1 - 9 en 37',
            'Johannes 7 : 1 - 9 en 37 - 39',
            'Johannes 7 : 1 - 9, 21 - 23 en 37 - 39',
            'Johannes 6 : 10b - 7 : 9a',
            'Hebreeën 4 : 14 - 5 : 10',
        ]

        test.each(cases)('formatScripture(%s)', (scripture) => {
            expect(formatScripture(scripture)).toBe(scripture)
        })
    })

    describe('space formatting', () => {
        const cases = [
            ['1 Johannes 1:1b-9a', '1 Johannes 1 : 1b - 9a'],
            ['Johannes 1:1', 'Johannes 1 : 1'],
            ['Judas:3-5', 'Judas : 3 - 5'],
            ['Johannes 1:1,3', 'Johannes 1 : 1 en 3'],
            ['Johannes 9 : 4, en 5', 'Johannes 9 : 4 en 5'],
            ['Johannes 1:1,3 en 5', 'Johannes 1 : 1, 3 en 5'],
            ['Johannes 1:1,3,5', 'Johannes 1 : 1, 3 en 5'],
            ['Johannes 7:1-9,37', 'Johannes 7 : 1 - 9 en 37'],
            ['Johannes 7:1-9 en 37', 'Johannes 7 : 1 - 9 en 37'],
            ['Johannes 7: 1-9 en 37-39', 'Johannes 7 : 1 - 9 en 37 - 39'],
            ['Johannes 7:1-9,21-23,37-39', 'Johannes 7 : 1 - 9, 21 - 23 en 37 - 39'],
            ['Johannes 9 : 1 - 12, en35-41', 'Johannes 9 : 1 - 12 en 35 - 41'],
            ['Johannes 6:10b-7:9a', 'Johannes 6 : 10b - 7 : 9a'],
            ['Hebreeën 4:14-5:10', 'Hebreeën 4 : 14 - 5 : 10'],
        ]

        test.each(cases)('formatScripture(%s) === %s', (input, expectedOutput) => {
            expect(formatScripture(input)).toBe(expectedOutput)
        })
    })
})

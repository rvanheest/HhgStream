import { formatScripture } from "../../../src/core/formatting/scriptureFormatting";

describe('formatScripture', () => {
    describe('no further formatting', () => {
        test('scripture passage', () => {
            const scripture = 'Johannes 1 : 1 - 18'
            expect(formatScripture(scripture)).toBe(scripture)
        })

        test('scripture (full chapter)', () => {
            const scripture = 'Johannes 1'
            expect(formatScripture(scripture)).toBe(scripture)
        })

        test('scripture reference', () => {
            const scripture = 'Johannes 1 : 1'
            expect(formatScripture(scripture)).toBe(scripture)
        })

        test('part of a verse', () => {
            const scripture = 'Johannes 1 : 1b'
            expect(formatScripture(scripture)).toBe(scripture)
        })

        test('part of a verse as range', () => {
            const scripture = 'Johannes 1 : 1b - 2a'
            expect(formatScripture(scripture)).toBe(scripture)
        })

        test('book with number in front', () => {
            const scripture = '1 Johannes 1 : 1 - 9'
            expect(formatScripture(scripture)).toBe(scripture)
        })

        test('book without chapter', () => {
            const scripture = 'Judas'
            expect(formatScripture(scripture)).toBe(scripture)
        })

        test('book without chapter but with verses', () => {
            const scripture = 'Judas : 3 - 5'
            expect(formatScripture(scripture)).toBe(scripture)
        })

        test('two verse ranges within the same chapter', () => {
            const scripture = 'Johannes 7 : 1 - 9 en 37 - 39'
            expect(formatScripture(scripture)).toBe(scripture)
        })

        test('multiple verse ranges within the same chapter', () => {
            const scripture = 'Johannes 7 : 1 - 9, 21 - 23 en 37 - 39'
            expect(formatScripture(scripture)).toBe(scripture)
        })

        test('scripture passage across chapter boundaries', () => {
            const scripture = 'Johannes 6 : 10b - 7 : 9a'
            expect(formatScripture(scripture)).toBe(scripture)
        })
    })

    describe('space formatting', () => {
        test('scripture passage', () => {
            expect(formatScripture('1 Johannes 1:1b-9a')).toBe('1 Johannes 1 : 1b - 9a')
        })

        test('scripture reference', () => {
            expect(formatScripture('Johannes 1:1')).toBe('Johannes 1 : 1')
        })

        test('book without chapter but with verses', () => {
            expect(formatScripture('Judas:3-5')).toBe('Judas : 3 - 5')
        })

        test('scripture two verses', () => {
            expect(formatScripture('Johannes 1:1,3')).toBe('Johannes 1 : 1 en 3')
        })

        test('scripture two verses with comma and "en"', () => {
            expect(formatScripture('Johannes 9 : 4, en 5')).toBe('Johannes 9 : 4 en 5')
        })

        test('scripture multiple verses', () => {
            expect(formatScripture('Johannes 1:1,3 en 5')).toBe('Johannes 1 : 1, 3 en 5')
        })

        test('scripture multiple verses, only commas', () => {
            expect(formatScripture('Johannes 1:1,3,5')).toBe('Johannes 1 : 1, 3 en 5')
        })

        test('two verse ranges within one chapter', () => {
            expect(formatScripture('Johannes 7: 1-9 en 37-39')).toBe('Johannes 7 : 1 - 9 en 37 - 39')
        })

        test('multiple verse ranges within one chapter', () => {
            expect(formatScripture('Johannes 7:1-9,21-23,37-39')).toBe('Johannes 7 : 1 - 9, 21 - 23 en 37 - 39')
        })

        test('multiple verse ranges within one chapter with comma and "en"', () => {
            expect(formatScripture('Johannes 9 : 1 - 12, en35-41')).toBe('Johannes 9 : 1 - 12 en 35 - 41')
        })

        test('scripture passage across chapter boundaries', () => {
            expect(formatScripture('Johannes 6:10b-7:9a')).toBe('Johannes 6 : 10b - 7 : 9a')
        })
    })
})

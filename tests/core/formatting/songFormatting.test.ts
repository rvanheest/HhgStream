import { formatSong, formatSongs } from "../../../src/core/formatting/songFormatting"

describe('formatSong', () => {
    test('a formatted song needs no further formatting', () => {
        const song = 'Psalm 110 : 1, 2 en 3'
        expect(formatSong(song)).toBe(song)
    })

    test('no spaces around colon', () => {
        expect(formatSong('Psalm 110:1')).toBe('Psalm 110 : 1')
    })

    test('no verses defined, but with multiple spaces', () => {
        expect(formatSong('Psalm     117')).toBe('Psalm 117')
    })

    test('no spaces in verse range', () => {
        expect(formatSong('Gezang 12:4-7')).toBe('Gezang 12 : 4 - 7')
    })

    test('no verse formatting', () => {
        expect(formatSong('Psalm 110 : 1 2 3')).toBe('Psalm 110 : 1, 2 en 3')
    })

    test('only commas in verse formatting', () => {
        expect(formatSong('Psalm 110 : 1, 2, 3')).toBe('Psalm 110 : 1, 2 en 3')
    })

    test('correct styling, no formatting', () => {
        expect(formatSong('Psalm 110:1,2 en 3')).toBe('Psalm 110 : 1, 2 en 3')
    })

    test('two verses with comma and "en"', () => {
        expect(formatSong('Psalm 110 : 1, en 2')).toBe('Psalm 110 : 1 en 2')
    })

    test('special case with Voorzang Psalm 18 - spaces', () => {
        expect(formatSong('Psalm 18:VZ')).toBe('Psalm 18 : VZ')
    })

    test('special case with Voorzang Psalm 18 - lowercase', () => {
        expect(formatSong('Psalm 18 : vz')).toBe('Psalm 18 : VZ')
    })

    test('special case with Voorzang Psalm 18 - full', () => {
        expect(formatSong('Psalm 18 : voorzang, 1, 2')).toBe('Psalm 18 : VZ, 1 en 2')
    })

    test('special case with Voorzang Psalm 18 - full lowercase uppercase', () => {
        expect(formatSong('Psalm 18 : VooRZanG')).toBe('Psalm 18 : VZ')
    })

    test('special case with Voorzang Psalm 18 - verses', () => {
        expect(formatSong('Psalm 18: VZ, 1')).toBe('Psalm 18 : VZ en 1')
    })

    test('special case with Voorzang Psalm 18 - verses multiple', () => {
        expect(formatSong('Psalm 18: VZ, 1, 2')).toBe('Psalm 18 : VZ, 1 en 2')
    })

    test('something completely different', () => {
        const song = 'U zij de glorie'
        expect(formatSong(song)).toBe(song)
    })
})

describe('formatSongs', () => {
    test('align songs with different lengths', () => {
        const songs = [
            'Psalm 2 : 1',
            'Psalm 42 : 1, 3 en 5',
            'Psalm 119 : 1 en 3',
            'Psalm 17',
            'Gezang 2 : 1',
            'Gezang 12 : 4, 5, 6 en 7',
            'Psalm 18 : VZ, 1 en 3',
            'Dit is een ander lied',
        ]
        const expected = [
            'Psalm     2 : 1',
            'Psalm   42 : 1, 3 en 5',
            'Psalm 119 : 1 en 3',
            'Psalm   17',
            'Gezang   2 : 1',
            'Gezang 12 : 4, 5, 6 en 7',
            'Psalm   18 : VZ, 1 en 3',
            'Dit is een ander lied',
        ]
        expect(formatSongs(songs)).toStrictEqual(expected)
    })

    test('no spacing around colon', () => {
        const songs = [
            'Psalm 1:1',
            'Psalm 2 :1',
            'Psalm 3: 1',
        ]
        const expected = [
            'Psalm 1 : 1',
            'Psalm 2 : 1',
            'Psalm 3 : 1',
        ]
        expect(formatSongs(songs)).toStrictEqual(expected)
    })

    test('formatting of verses', () => {
        const songs = [
            'Psalm 2 : 1',
            'Psalm 42 : 1 3 5',
            'Psalm 119 : 1,3',
            'Psalm 17',
            'Gezang 2 : 1',
            'Gezang 12 : 4, 5, 6, 7',
            'Psalm 18 : VZ, 1, 3',
            'Dit is een ander lied',
            ]
        const expected = [
            'Psalm     2 : 1',
            'Psalm   42 : 1, 3 en 5',
            'Psalm 119 : 1 en 3',
            'Psalm   17',
            'Gezang   2 : 1',
            'Gezang 12 : 4, 5, 6 en 7',
            'Psalm   18 : VZ, 1 en 3',
            'Dit is een ander lied',
            ]
        expect(formatSongs(songs)).toStrictEqual(expected)
    })
})

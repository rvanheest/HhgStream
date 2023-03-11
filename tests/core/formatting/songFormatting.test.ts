import { formatSong, formatSongs } from "../../../src/core/formatting/songFormatting"

describe('formatSong', () => {
    const cases = [
        ['Psalm 110 : 1, 2 en 3', 'Psalm 110 : 1, 2 en 3'],
        ['Psalm 110:1', 'Psalm 110 : 1'],
        ['Psalm     117', 'Psalm 117'],
        ['Gezang 12:4-7', 'Gezang 12 : 4 - 7'],
        ['Psalm 110 : 1 2 3', 'Psalm 110 : 1, 2 en 3'],
        ['Psalm 110 : 1, 2, 3', 'Psalm 110 : 1, 2 en 3'],
        ['Psalm 110:1,2 en 3', 'Psalm 110 : 1, 2 en 3'],
        ['Psalm 110 : 1, en 2', 'Psalm 110 : 1 en 2'],
        ['Psalm 18:VZ', 'Psalm 18 : VZ'],
        ['Psalm 18 : vz', 'Psalm 18 : VZ'],
        ['Psalm 18 : voorzang, 1, 2', 'Psalm 18 : VZ, 1 en 2'],
        ['Psalm 18 : VooRZanG', 'Psalm 18 : VZ'],
        ['Psalm 18: VZ, 1', 'Psalm 18 : VZ en 1'],
        ['Psalm 18: VZ, 1, 2', 'Psalm 18 : VZ, 1 en 2'],
        ['U zij de glorie', 'U zij de glorie'],
    ]

    test.each(cases)('formatSong(%s) === %s', (song, expectedOutput) => {
        expect(formatSong(song)).toBe(expectedOutput)
    })
})

describe('formatSongs', () => {
    const cases = [
        [
            [
                'Psalm 2 : 1',
                'Psalm 42 : 1, 3 en 5',
                'Psalm 119 : 1 en 3',
                'Psalm 17',
                'Gezang 2 : 1',
                'Gezang 12 : 4, 5, 6 en 7',
                'Psalm 18 : VZ, 1 en 3',
                'Dit is een ander lied',
            ],
            [
                'Psalm     2 : 1',
                'Psalm   42 : 1, 3 en 5',
                'Psalm 119 : 1 en 3',
                'Psalm   17',
                'Gezang   2 : 1',
                'Gezang 12 : 4, 5, 6 en 7',
                'Psalm   18 : VZ, 1 en 3',
                'Dit is een ander lied',
            ]
        ],
        [
            [
                'Psalm 1:1',
                'Psalm 2 :1',
                'Psalm 3: 1',
            ],
            [
                'Psalm 1 : 1',
                'Psalm 2 : 1',
                'Psalm 3 : 1',
            ]
        ],
        [
            [
                'Psalm 2 : 1',
                'Psalm 42 : 1 3 5',
                'Psalm 119 : 1,3',
                'Psalm 17',
                'Gezang 2 : 1',
                'Gezang 12 : 4, 5, 6, 7',
                'Psalm 18 : VZ, 1, 3',
                'Dit is een ander lied',
            ],
            [
                'Psalm     2 : 1',
                'Psalm   42 : 1, 3 en 5',
                'Psalm 119 : 1 en 3',
                'Psalm   17',
                'Gezang   2 : 1',
                'Gezang 12 : 4, 5, 6 en 7',
                'Psalm   18 : VZ, 1 en 3',
                'Dit is een ander lied',
            ]
        ],
    ]

    test.each(cases)('formatSongs(%s) === %s', (songs, expectedOutput) => {
        expect(formatSongs(songs)).toStrictEqual(expectedOutput)
    })
})

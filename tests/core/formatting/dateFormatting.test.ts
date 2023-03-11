import {formatDate} from "../../../src/core/formatting/dateFormatting";

describe('formatDate', () => {
    const cases = [
        { date: new Date('1992-07-30T16:04:00'), expectedOutput: '30 juli 1992' },
    ]

    test.each(cases)('formatDate($date) === $expectedOutput', ({date, expectedOutput}) => {
        expect(formatDate(date)).toBe(expectedOutput)
    })
})

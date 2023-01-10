import {formatDate} from "../../../src/core/formatting/dateFormatting";

describe('formatDate', () => {
    test('format a date', () => {
        const date = new Date('1992-07-30T16:04:00');
        expect(formatDate(date)).toBe('30 juli 1992')
    })
})

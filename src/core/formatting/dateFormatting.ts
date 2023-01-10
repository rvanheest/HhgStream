export function formatDate(date: Date): string {
    return date.toLocaleString('nl-NL', { dateStyle: 'long' })
}

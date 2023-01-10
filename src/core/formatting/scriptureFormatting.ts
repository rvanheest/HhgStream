type ScriptureVerseRange = {
    start: string
    end: string
}

type Scripture = {
    bookNumber: string | undefined
    bookName: string
    chapter: string | undefined
    verses: ScriptureVerseRange | string[] | string | undefined
}

function undefinedOnFalsy<T>(t: T): T | undefined {
    return !!t ? t : undefined
}

function parseVerses(verses: string) {
    const verseRange = verses.match(/^(\d+\w*)\s*-\s*(\d+\w*)$/)
    if (verseRange) return { start: verseRange[1], end: verseRange[2] }

    const coupleOfVerses = verses.match(/(\d+\w*)+/gi)
    if (coupleOfVerses && coupleOfVerses.length) return coupleOfVerses

    return undefinedOnFalsy(verses)
}

function parseScripture(scripture: string): Scripture | string {
    const parsedScripture = scripture.match(/^(\d*)\s*(\w+)\s*(\d*)\s*:\s*(.*)$/)
    if (parsedScripture) return {
        bookNumber: undefinedOnFalsy(parsedScripture[1]),
        bookName: parsedScripture[2],
        chapter: undefinedOnFalsy(parsedScripture[3]),
        verses: parseVerses(parsedScripture[4]),
    }

    return scripture
}

function isScripture(scripture: Scripture | string): scripture is Scripture {
    return typeof scripture === "object" && "bookName" in scripture
}

function isScriptureVerseRange(range: any): range is ScriptureVerseRange {
    return typeof range === "object" && "start" in range && "end" in range
}

function formatVerseArray(verses: string[]): string {
    if (!verses.length) return ""
    if (verses.length === 1) return verses[0]

    const [lastElement, ...init] = verses.reverse()
    return `${init.reverse().join(', ')} en ${lastElement}`
}

function formatScriptureVerses(verses: ScriptureVerseRange | string[] | string): string {
    if (isScriptureVerseRange(verses)) return `${verses.start} - ${verses.end}`
    if (Array.isArray(verses)) return formatVerseArray(verses)
    return verses
}

function formatScriptureInternal({ bookNumber, bookName, chapter, verses }: Scripture): string {
    let result = ""
    if (bookNumber) result += bookNumber + " "
    result += bookName
    if (chapter) result += " " + chapter
    if (verses) result += " : " + formatScriptureVerses(verses)
    return result
}

export function formatScripture(scripture: string): string {
    const parsedScripture = parseScripture(scripture)

    return isScripture(parsedScripture) ? formatScriptureInternal(parsedScripture) : scripture
}

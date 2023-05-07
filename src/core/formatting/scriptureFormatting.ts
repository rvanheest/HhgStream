type Book = {
    bookNumber: string | undefined
    bookName: string
}

type VerseReference = ScriptureVerseRange | string

type ScriptureVerseRange = {
    start: string
    end: string
}

type ChapterAndVerse = {
    chapter: string | undefined
    verses: VerseReference[] | string | undefined
}

type ChapterAndVerseRange = {
    start: {
        chapter: string | undefined
        verse: string
    }
    end: {
        chapter: string | undefined
        verse: string
    }
}

type Scripture = Book & (ChapterAndVerse | ChapterAndVerseRange)

function undefinedOnFalsy<T>(t: T): T | undefined {
    return !!t ? t : undefined
}

function parseVerses(verses: string): VerseReference[] | string | undefined {
    const verseRanges = verses.match(/(\d+\w*)(\s*-\s*(\d+\w*))?/gi)
    if (verseRanges) {
        const ranges = verseRanges.flatMap<VerseReference>(match => {
            const range = match.match(/^(\d+\w*)\s*-\s*(\d+\w*)$/)
            if (range) return [{ start: range[1], end: range[2] }]

            const singleVerse = match.match(/^(\d+\w*)$/)
            if (singleVerse) return [singleVerse[1]]

            return [match]
        })
        if (!!ranges.length) return ranges
    }

    const coupleOfVerses = verses.match(/(\d+\w*)+/gi)
    if (coupleOfVerses && coupleOfVerses.length) return coupleOfVerses

    return undefinedOnFalsy(verses)
}

function parseScripture(scripture: string): Scripture | string {
    let parsedScripture = scripture.match(/^(\d*)\s*([A-Za-zÀ-ÿ]+)\s*(\d*)\s*:\s*(\S*)\s*-\s*(\d*)\s*:\s*(\S*)$/)
    if (parsedScripture) return {
        bookNumber: undefinedOnFalsy(parsedScripture[1]),
        bookName: parsedScripture[2],
        start: {
            chapter: parsedScripture[3],
            verse: parsedScripture[4],
        },
        end: {
            chapter: parsedScripture[5],
            verse: parsedScripture[6],
        }
    }

    parsedScripture = scripture.match(/^(\d*)\s*([A-Za-zÀ-ÿ]+)\s*(\d*)\s*:\s*(.*)$/)
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

function isVerseReferenceArray(range: unknown): range is VerseReference[] {
    return Array.isArray(range) && range.every(isVerseReference)
}

function isVerseReference(range: unknown): range is VerseReference {
    return isScriptureVerseRange(range) || typeof range === 'string'
}

function isScriptureVerseRange(range: unknown): range is ScriptureVerseRange {
    return range !== null && typeof range === "object" && "start" in range && "end" in range
}

function formatVerseArray(verses: string[]): string {
    if (!verses.length) return ""
    if (verses.length === 1) return verses[0]

    const [lastElement, ...init] = verses.reverse()
    return `${init.reverse().join(', ')} en ${lastElement}`
}

function formatScriptureVerses(verses: VerseReference[] | string): string {
    if (isVerseReferenceArray(verses)) return formatVerseArray(verses.map(v => isScriptureVerseRange(v) ? `${v.start} - ${v.end}` : v))
    if (Array.isArray(verses)) return formatVerseArray(verses)
    return verses
}

function formatScriptureInternal(scripture: Scripture): string {
    let result = ""
    if (scripture.bookNumber) result += scripture.bookNumber + " "
    result += scripture.bookName
    if ("chapter" in scripture && "verses" in scripture) {
        if (scripture.chapter) result += " " + scripture.chapter
        if (scripture.verses) result += " : " + formatScriptureVerses(scripture.verses)
    }
    else {
        if (scripture.start.chapter) result += " " + scripture.start.chapter
        if (scripture.start.verse) result += " : " + scripture.start.verse
        if (scripture.end.chapter) result += " - " + scripture.end.chapter
        if (scripture.end.verse) result += " : " + scripture.end.verse
    }
    return result
}

export function formatScripture(scripture: string): string {
    const parsedScripture = parseScripture(scripture)

    return isScripture(parsedScripture) ? formatScriptureInternal(parsedScripture) : scripture
}

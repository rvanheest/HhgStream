type SongVerseRange = {
    start: string
    end: string
}

type Song = {
    type: string
    space: number
    nummer: string
    verses: SongVerseRange | string[] | string | undefined
}

function parseSong(song: string): Song | string {
    const match = song.match(/^(Psalm|Gezang)\s+(\d+)(\s*:\s*(.+))?$/)
    if (!match) return song

    const result: Song = { type: match[1], space: 0, nummer: match[2], verses: undefined }
    if (!match[3]) return result

    const tail = match[4]
    // vers "x - y"
    const verseRangeMatch = tail.match(/^(\d+)\s*-\s*(\d+)$/)
    if (verseRangeMatch) return { ...result, verses: { start: verseRangeMatch[1], end: verseRangeMatch[2] } }

    // vers "x, y en z"
    const verseMatch = tail.match(/(\d+|vz|voorzang)+/gi)
    if (verseMatch && verseMatch.length) return { ...result, verses: verseMatch.map(v => v.match(/vz|voorzang/i) ? 'VZ' : v) }

    return { ...result, verses: tail }
}

function isSong(song: Song | string): song is Song {
    return typeof song === "object" && "type" in song && "nummer" in song && "verses" in song
}

function isSongVerseRange(range: any): range is SongVerseRange {
    return typeof range === "object" && "start" in range && "end" in range
}

function formatVerseArray(verses: string[]): string {
    if (!verses.length) return ""
    if (verses.length === 1) return verses[0]

    const [lastElement, ...init] = verses.reverse()
    return `${init.reverse().join(', ')} en ${lastElement}`
}

function formatVerses(verses: SongVerseRange | string[] | string | undefined): string {
    if (isSongVerseRange(verses)) return `: ${verses.start} - ${verses.end}`
    if (Array.isArray(verses)) return `: ${formatVerseArray(verses)}`
    if (verses === undefined) return ""
    return `: ${verses}`
}

function formatSongInternal({ type, nummer, verses }: Song, extraSpaces: string = '') {
    return `${type} ${extraSpaces}${nummer} ${formatVerses(verses)}`.trim();
}

export function formatSong(song: string): string {
    const parsedSong = parseSong(song)
    return isSong(parsedSong) ? formatSongInternal(parsedSong) : song
}

export function formatSongs(songs: string[]): string[] {
    function calculateMaxSpace(songs: Song[]): number {
        return Math.max(...songs.map(song => (song.type === "Gezang" ? 1 : 0) + song.nummer.length))
    }

    function formatSpaces(song: Song, maxLength: number): string {
        return ' '.repeat(Math.max(0, 2 * (maxLength - song.nummer.length + (song.type === "Gezang" ? -1 : 0))))
    }

    const parsedSongs = songs.map(parseSong)
    const nummerMaxLength = calculateMaxSpace(parsedSongs.filter(isSong))
    return parsedSongs.map(song => isSong(song) ? formatSongInternal(song, formatSpaces(song, nummerMaxLength)) : song)
}
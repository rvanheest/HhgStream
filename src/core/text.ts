import { extension, fileExists, filename, listFiles, readFile, readJsonFile, resolve, saveFile, saveJsonFile } from "./utils";
import { TextTemplate } from "./config";
import Mustache from "mustache";

export enum TextPosition {
    TopLeft = "Links boven",
    BottomLeft = "Links onder",
    TopRight = "Rechts boven",
    BottomRight = "Rechts onder",
    Center = "Midden",
}

type Position = {
    position: TextPosition
}

type Citaat = {
    isCitaat: boolean
}

type Text = {
    value: string
}

type MultilineText = {
    lines: string[]
}

type TextArray = {
    values: string[]
}

export type KerkdienstTextStore = {
    voorzang: Text & Position
    zingen: TextArray & Position
    schriftlezingen: TextArray & Position
    preekBijbeltekst: Text & Position
    preekBijbelcitaat: Text & Citaat
    preekThema: Text & Position
    preekThemaOndertitel: Text
    preekPunten: TextArray
    doopKinderen: TextArray & Position
    mededelingen: MultilineText & Position
}

export type BijbellezingTextStore = {
    voorganger: Text & Position
    datum: Text
    datumVolgendeKeer: Text
    zingen: TextArray & Position
    schriftlezingen: TextArray & Position
    meditatieBijbeltekst: Text & Position
    meditatieBijbeltekstVolgendeKeer: Text
}

export type TextStore = {
    kerkdienst: KerkdienstTextStore
    bijbellezing: BijbellezingTextStore
    isError: false
}

export type TextStoreError = {
    message: string
    error?: string | undefined
    isError: true
}

export const defaultKerkdienst: KerkdienstTextStore = {
    voorzang: { value: "", position: TextPosition.TopRight },
    zingen: { values: [], position: TextPosition.TopLeft },
    schriftlezingen: { values: [], position: TextPosition.TopLeft },
    preekBijbeltekst: { value: "", position: TextPosition.TopLeft },
    preekBijbelcitaat: { value: "", isCitaat: false },
    preekThema: { value: "", position: TextPosition.TopLeft },
    preekThemaOndertitel: { value: "" },
    preekPunten: { values: [] },
    doopKinderen: { values: [], position: TextPosition.BottomRight },
    mededelingen: { lines: [], position: TextPosition.BottomLeft },
}

export const defaultBijbellezing: BijbellezingTextStore = {
    voorganger: { value: "", position: TextPosition.TopRight },
    datum: { value: new Date().toDateString() },
    datumVolgendeKeer: { value: new Date().toDateString() },
    zingen: { values: [], position: TextPosition.TopLeft },
    schriftlezingen: { values: [], position: TextPosition.BottomLeft },
    meditatieBijbeltekst: { value: "", position: TextPosition.BottomLeft },
    meditatieBijbeltekstVolgendeKeer: { value: "" },
}

export function loadTextStore(textPath: string): TextStore | TextStoreError {
    if (!fileExists(textPath)) {
        const initialTextStore: TextStore = {
            kerkdienst: defaultKerkdienst,
            bijbellezing: defaultBijbellezing,
            isError: false,
        }
        saveTextStore(initialTextStore, textPath)
        return initialTextStore
    }
    else {
        try {
            const store = readJsonFile<TextStore>(textPath)

            let needSave = false
            if (!store.kerkdienst || !Object.keys(store.kerkdienst).length) {
                store.kerkdienst = defaultKerkdienst
                needSave = true
            }
            if (!store.bijbellezing || !Object.keys(store.bijbellezing).length) {
                store.bijbellezing = defaultBijbellezing
                needSave = true
            }
            if (needSave) saveTextStore(store, textPath)

            return store
        }
        catch (e) {
            return ({
                message: `error reading text store ${textPath}`,
                error: e instanceof SyntaxError ? e.message : undefined,
                isError: true,
            })
        }
    }
}

export function saveTextStore(textStore: TextStore, textPath: string): void {
    saveJsonFile(textStore, textPath)
}

// voor meer karakters, zie https://www.webmasterresources.nl/webdesign/utf-html-code-speciale-karakters/
const htmlCharacterEncode = {
    "à": "&agrave;",
    "á": "&aacute;",
    "ä": "&auml;",
    "è": "&egrave;",
    "é": "&eacute;",
    "ë": "&euml;",
    "ï": "&iuml;",
    "ó": "&oacute;",
    "ö": "&ouml;",
    "ü": "&uuml;",
}

// Mustache documentation: https://github.com/janl/mustache.js
export function fillTemplates(templateConfig: TextTemplate, teksten: any): void {
    const augmentedTeksten = {
        ...teksten,
        "positionF": () => (s: string, render: (s: string) => TextPosition) => {
            switch (render(s)) {
                case TextPosition.TopLeft: return 'top-left'
                case TextPosition.BottomLeft: return 'bottom-left'
                case TextPosition.TopRight: return 'top-right'
                case TextPosition.BottomRight: return 'bottom-right'
                case TextPosition.Center: return 'center'
                default: return ''
            }
        },
        "htmlEncodeF": () => (s: string, render: (s: string) => string) => {
            return Object.entries(htmlCharacterEncode).reduce((x, [key, value]) => x.replace(key, value), render(s))
        },
    }

    listFiles(templateConfig.templateDir)
        .filter(f => extension(f) === '.mustache')
        .forEach(f => fillTemplate(resolve(templateConfig.templateDir, f), templateConfig.outputDir, augmentedTeksten))
}

function fillTemplate(templateFile: string, outputDir: string, teksten: any): void {
    const fileName = filename(templateFile, false)
    const template = readFile(templateFile)

    const output = Mustache.render(template, teksten)
    const outputPath = resolve(outputDir, `${fileName}.html`)

    saveFile(output, outputPath)
}

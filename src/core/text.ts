import { extension, fileExists, filename, listFiles, readFile, readJsonFile, resolve, saveFile, saveJsonFile } from "./utils";
import { TextFormConfig, useTextStorePath } from "./config"
import { htmlEncode, positionCssClass, TextPosition } from "./template";
import Mustache from "mustache";
import { create } from "zustand"
import { shallow } from "zustand/shallow"
import { useEffect } from "react";

export const schriftTypes = {
    Tekst: "Tekst voor de preek",
    HC: "Heidelbergse Catechismus",
    NGB: "Nederlandse Geloofsbelijdenis",
    DL: "Dordtse Leerregels",
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

type Type = {
    type: string
}

export type KerkdienstTextStore = {
    voorzang: Text & Position
    zingen: TextArray & Position
    schriftlezingen: TextArray & Position
    preekBijbeltekst: Text & Position & Type
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

export type CursusGeestelijkeVormingTextStore = {
    spreker: Text & Position
    sprekerAfkomst: Text
    thema: Text & Position
    openingSpreker: Text & Position
    openingZingen: Text
    schriftlezingen: TextArray
}

export type RouwdienstTextStore = {
    naamOverledene: Text
    inleidendOrgelspel: Text & Position
    zingen: TextArray & Position
    schriftlezingen: TextArray & Position
    preekBijbeltekst: Text & Position
    preekBijbelcitaat: Text & Citaat
    uitleidendOrgelspel: Text & Position
}

export type TrouwdienstTextStore = {
    naamBruidegom: Text
    naamBruid: Text
    inleidendOrgelspel: Text & Position
    zingen: TextArray & Position
    schriftlezingen: TextArray & Position
    preekBijbeltekst: Text & Position
    preekBijbelcitaat: Text & Citaat
    uitleidendOrgelspel: Text & Position
}

export type BezinningsmomentTextStore = {
    voorganger: Text & Position
    datum: Text
    zingen: TextArray & Position
    schriftlezingen: TextArray & Position
    meditatieBijbeltekst: Text & Position
    meditatieBijbelcitaat: Text & Citaat
}

export type TextStore = {
    kerkdienst: KerkdienstTextStore
    bijbellezing: BijbellezingTextStore
    cursusGeestelijkeVorming: CursusGeestelijkeVormingTextStore
    rouwdienst: RouwdienstTextStore
    trouwdienst: TrouwdienstTextStore
    bezinningsmoment: BezinningsmomentTextStore
}

export type TextStoreError = {
    message: string
    error?: string | undefined
}

const defaultKerkdienst: KerkdienstTextStore = {
    voorzang: { value: "", position: TextPosition.TopRight },
    zingen: { values: [], position: TextPosition.TopLeft },
    schriftlezingen: { values: [], position: TextPosition.TopLeft },
    preekBijbeltekst: { type: schriftTypes.Tekst, value: "", position: TextPosition.TopLeft },
    preekBijbelcitaat: { value: "", isCitaat: false },
    preekThema: { value: "", position: TextPosition.TopLeft },
    preekThemaOndertitel: { value: "" },
    preekPunten: { values: [] },
    doopKinderen: { values: [], position: TextPosition.BottomRight },
    mededelingen: { lines: [], position: TextPosition.BottomLeft },
}

const defaultBijbellezing: BijbellezingTextStore = {
    voorganger: { value: "", position: TextPosition.TopRight },
    datum: { value: new Date().toDateString() },
    datumVolgendeKeer: { value: new Date().toDateString() },
    zingen: { values: [], position: TextPosition.TopLeft },
    schriftlezingen: { values: [], position: TextPosition.BottomLeft },
    meditatieBijbeltekst: { value: "", position: TextPosition.BottomLeft },
    meditatieBijbeltekstVolgendeKeer: { value: "" },
}

const defaultCursusGeestelijkeVorming: CursusGeestelijkeVormingTextStore = {
    spreker: { value: "", position: TextPosition.TopRight },
    sprekerAfkomst: { value: "" },
    thema: { value: "", position: TextPosition.TopLeft },
    openingSpreker: { value: "", position: TextPosition.BottomLeft },
    openingZingen: { value: "" },
    schriftlezingen: { values: [] },
}

const defaultRouwdienst: RouwdienstTextStore = {
    naamOverledene: { value: "" },
    inleidendOrgelspel: { value: "", position: TextPosition.TopRight },
    zingen: { values: [], position: TextPosition.TopLeft },
    schriftlezingen: { values: [], position: TextPosition.TopLeft },
    preekBijbeltekst: { value: "", position: TextPosition.TopLeft },
    preekBijbelcitaat: { value: "", isCitaat: false },
    uitleidendOrgelspel: { value: "", position: TextPosition.TopRight },
}

const defaultTrouwdienst: TrouwdienstTextStore = {
    naamBruidegom: { value: "" },
    naamBruid: { value: "" },
    inleidendOrgelspel: { value: "", position: TextPosition.BottomLeft },
    zingen: { values: [], position: TextPosition.TopLeft },
    schriftlezingen: { values: [], position: TextPosition.TopLeft },
    preekBijbeltekst: { value: "", position: TextPosition.TopLeft },
    preekBijbelcitaat: { value: "", isCitaat: false },
    uitleidendOrgelspel: { value: "", position: TextPosition.BottomLeft },
}

const defaultBezinningsmoment: BezinningsmomentTextStore = {
    voorganger: { value: "", position: TextPosition.TopRight },
    datum: { value: new Date().toDateString() },
    zingen: { values: [], position: TextPosition.TopRight },
    schriftlezingen: { values: [], position: TextPosition.TopRight },
    meditatieBijbeltekst: { value: "", position: TextPosition.BottomLeft },
    meditatieBijbelcitaat: { value: "", isCitaat: false },
}

function getDefaultTekstStore<TName extends keyof TextStore>(name: TName): any {
    switch (name) {
        case "kerkdienst": return defaultKerkdienst
        case "bijbellezing": return defaultBijbellezing
        case "cursusGeestelijkeVorming": return defaultCursusGeestelijkeVorming
        case "trouwdienst": return defaultTrouwdienst
        case "rouwdienst": return defaultRouwdienst
        case "bezinningsmoment": return defaultBezinningsmoment
        default: return defaultKerkdienst
    }
}

function loadTextStore(textPath: string): TextStore & { isError: false } | TextStoreError & { isError: true } {
    if (!fileExists(textPath)) {
        const initialTextStore = {
            kerkdienst: defaultKerkdienst,
            bijbellezing: defaultBijbellezing,
            cursusGeestelijkeVorming: defaultCursusGeestelijkeVorming,
            rouwdienst: defaultRouwdienst,
            trouwdienst: defaultTrouwdienst,
            bezinningsmoment: defaultBezinningsmoment,
        }
        saveTextStore(initialTextStore, textPath)
        return { ...initialTextStore, isError: false }
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
            if (!store.cursusGeestelijkeVorming || !Object.keys(store.cursusGeestelijkeVorming).length) {
                store.cursusGeestelijkeVorming = defaultCursusGeestelijkeVorming
                needSave = true
            }
            if (!store.rouwdienst || !Object.keys(store.rouwdienst).length) {
                store.rouwdienst = defaultRouwdienst
                needSave = true
            }
            if (!store.trouwdienst || !Object.keys(store.trouwdienst).length) {
                store.trouwdienst = defaultTrouwdienst
                needSave = true
            }
            if (!store.bezinningsmoment || !Object.keys(store.bezinningsmoment).length) {
                store.bezinningsmoment = defaultBezinningsmoment
                needSave = true
            }
            if (needSave) saveTextStore(store, textPath)

            return { ...store, isError: false }
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

function saveTextStore(textStore: TextStore, textPath: string): void {
    saveJsonFile(textStore, textPath)
}

// Mustache documentation: https://github.com/janl/mustache.js
export function fillTemplates(templateConfig: TextFormConfig, teksten: any): void {
    const augmentedTeksten = {
        ...teksten,
        "positionF": () => (s: string, render: (s: string) => TextPosition) => positionCssClass(render(s)),
        "htmlEncodeF": () => (s: string, render: (s: string) => string) => htmlEncode(render(s)),
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

type ZustandTextStore = {
    texts: TextStore | undefined
    error: TextStoreError | undefined
    loaded: boolean
    loadTextStore: (path: string) => void
    saveTextStore: (path: string) => (partialTextStore: Partial<TextStore>) => void
}

const useTextStore = create<ZustandTextStore>()(setState => ({
    loaded: false,
    texts: undefined,
    error: undefined,
    loadTextStore: path => {
        const textStore = loadTextStore(path)
        if (textStore.isError) {
            const { isError, ...error } = textStore
            setState({ loaded: true, texts: undefined, error: error })
        }
        else {
            const { isError, ...texts } = textStore
            setState({ loaded: true, texts: texts, error: undefined })
        }
    },
    saveTextStore: path => partialTextStore => setState(s => {
        if (!s.texts) return s
        const newTexts = { ...s.texts, ...partialTextStore }
        saveTextStore(newTexts, path)
        return ({ ...s, texts: newTexts })
    })
}))

export function useLoadTextStore(): Pick<ZustandTextStore, "loaded" | "error"> {
    const path = useTextStorePath()
    const { loadTextStore, ...store } = useTextStore(s => ({ loadTextStore: s.loadTextStore, loaded: s.loaded, error: s.error }), shallow)

    useEffect(() => {
        loadTextStore(path)
    }, [loadTextStore, path])

    return store
}

export function useSaveTextStore(): (partialTextStore: Partial<TextStore>) => void {
    const path = useTextStorePath()
    const save = useTextStore(s => s.saveTextStore)
    return save(path)
}

export type UseTekstenReturn<TName extends keyof TextStore> = {
    defaultTextStore: TextStore[TName]
    teksten: TextStore[TName]
    setTeksten: (t: TextStore[TName]) => void
}

export function useTeksten<TName extends keyof TextStore>(name: TName): UseTekstenReturn<TName> {
    const teksten = useTextStore(s => s.texts![name])
    const save = useSaveTextStore()
    const setTeksten = (teksten: TextStore[TName]) => save({ [name]: teksten })
    const defaultTextStore = getDefaultTekstStore(name)

    return { teksten, setTeksten, defaultTextStore }
}

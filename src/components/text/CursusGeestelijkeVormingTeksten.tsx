import React from "react"
import { useForm } from "react-hook-form"
import { TextTemplate } from "../../core/config"
import { formatScripture } from "../../core/formatting/scriptureFormatting";
import { formatSong } from "../../core/formatting/songFormatting";
import { CursusGeestelijkeVormingTextStore, defaultCursusGeestelijkeVorming, fillTemplates, TextPosition } from "../../core/text"
import InputGroup from "../util/form/InputGroup";
import PositionSelect from "../util/form/PositionSelect";
import TextField from "../util/form/TextField";
import TextFieldArray, { emptyTextArrayElement, mapTextArray, mapTextArrayToStore, TextArrayElement } from "../util/form/TextFieldArray";
import TextForm from "../util/form/TextForm";

type FormInput = {
    spreker: string
    sprekerPosition: TextPosition
    sprekerAfkomst: string
    thema: string
    themaPosition: TextPosition
    openingSpreker: string
    openingSprekerPosition: TextPosition
    openingZingen: string,
    schriftlezingen : TextArrayElement[]
}

function mapFormToTextStore(data: FormInput): CursusGeestelijkeVormingTextStore {
    return {
        spreker: {
            value: data.spreker,
            position: data.sprekerPosition,
        },
        sprekerAfkomst: {
            value: data.sprekerAfkomst,
        },
        thema: {
            value: data.thema,
            position: data.themaPosition,
        },
        openingSpreker: {
            value: data.openingSpreker,
            position: data.openingSprekerPosition,
        },
        openingZingen: {
            value: data.openingZingen,
        },
        schriftlezingen: {
            values: mapTextArrayToStore(data.schriftlezingen),
        },
    }
}

function mapTextStoreToForm(data: CursusGeestelijkeVormingTextStore): FormInput {
    return {
        spreker: data.spreker.value,
        sprekerPosition: data.spreker.position,
        sprekerAfkomst: data.sprekerAfkomst.value,
        thema: data.thema.value,
        themaPosition: data.thema.position,
        openingSpreker: data.openingSpreker.value,
        openingSprekerPosition: data.openingSpreker.position,
        openingZingen: data.openingZingen.value,
        schriftlezingen: mapTextArray(data.schriftlezingen.values),
    }
}

function formatTekstenForTemplates(teksten: CursusGeestelijkeVormingTextStore): CursusGeestelijkeVormingTextStore {
    return {
        ...teksten,
        openingZingen: {
            ...teksten.openingZingen,
            value: formatSong(teksten.openingZingen.value),
        },
        schriftlezingen: {
            ...teksten.schriftlezingen,
            values: teksten.schriftlezingen.values.map(formatScripture),
        },
    }
}

type CursusGeestelijkeVormingTekstenProps = {
    teksten: CursusGeestelijkeVormingTextStore
    tekstTemplate: TextTemplate | undefined
    saveTeksten: (teksten: CursusGeestelijkeVormingTextStore) => void
}

const CursusGeestelijkeVormingTeksten = ({ teksten, tekstTemplate, saveTeksten }: CursusGeestelijkeVormingTekstenProps) => {
    const { control, handleSubmit, register, reset } = useForm<FormInput>({ defaultValues: mapTextStoreToForm(teksten) })

    function onSubmit(data: FormInput) {
        const tekstStore = mapFormToTextStore(data)
        const tekstenVoorTemplates = formatTekstenForTemplates(tekstStore)

        reset(mapTextStoreToForm(tekstStore))
        if (!!tekstTemplate) fillTemplates(tekstTemplate, tekstenVoorTemplates)
        saveTeksten(tekstStore)
    }

    function onClear() {
        reset(mapTextStoreToForm(defaultCursusGeestelijkeVorming))
        saveTeksten(defaultCursusGeestelijkeVorming)
    }

    return (
        <TextForm onClear={onClear} onSubmit={handleSubmit(onSubmit)}>
            <InputGroup controlId="cursusGeestelijkeVormingSpreker"
                        label="Spreker"
                        renderPosition={() => <PositionSelect control={control} name="sprekerPosition" />}>
                <TextField placeholder="Naam" control={control} name="spreker" className="mb-1" />
                <TextField placeholder="Woonplaats" control={control} name="sprekerAfkomst" />
            </InputGroup>

            <InputGroup controlId="cursusGeestelijkeVormingOpeningSpreker"
                        label="Opening - spreker"
                        renderPosition={() => <PositionSelect control={control} name="openingSprekerPosition" />}>
                <TextField placeholder="Spreker" control={control} name="openingSpreker" />
            </InputGroup>

            <InputGroup controlId="cursusGeestelijkeVormingOpeningZingen" label="Opening - zingen">
                <TextField placeholder="Zingen (opening)" control={control} name="openingZingen" />
            </InputGroup>

            <InputGroup controlId="cursusGeestelijkeVormingSchriftlezingen" label="Schriftlezing">
                <TextFieldArray placeholder="Bijbelgedeelte"
                                register={register}
                                control={control}
                                name="schriftlezingen"
                                generateElement={emptyTextArrayElement} />
            </InputGroup>

            <InputGroup controlId="cursusGeestelijkeVormingThema"
                        label="Thema"
                        renderPosition={() => <PositionSelect control={control} name="themaPosition" />}>
                <TextField placeholder="Thema" control={control} name="thema" />
            </InputGroup>
        </TextForm>
    )
}

export default CursusGeestelijkeVormingTeksten

import React from "react"
import { formatScripture } from "../../core/formatting/scriptureFormatting";
import { formatSong } from "../../core/formatting/songFormatting";
import { TextPosition } from "../../core/template";
import { CursusGeestelijkeVormingTextStore } from "../../core/text"
import InputGroup from "../util/form/InputGroup";
import PositionSelect from "../util/form/PositionSelect";
import TextField from "../util/form/TextField";
import TextFieldArray, { emptyTextArrayElement, mapTextArray, mapTextArrayToStore, TextArrayElement } from "../util/form/TextFieldArray";
import TextForm from "../util/form/TextForm";
import useTextForm from "../util/form/TextFormHook"

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

const CursusGeestelijkeVormingTeksten = () => {
    const { onSubmit, onClear, control, register } = useTextForm({
        textFormConfigName: 'cursusGeestelijkeVorming',
        mapTextStoreToForm,
        mapFormToTextStore,
        formatTekstenForTemplates,
    })

    return (
        <TextForm onClear={onClear} onSubmit={onSubmit}>
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

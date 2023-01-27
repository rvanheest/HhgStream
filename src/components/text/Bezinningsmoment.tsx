import React from "react"
import { formatDate } from "../../core/formatting/dateFormatting";
import { formatScripture } from "../../core/formatting/scriptureFormatting";
import { formatSongs } from "../../core/formatting/songFormatting";
import { BezinningsmomentTextStore, TextPosition } from "../../core/text"
import CheckboxExtension from "../util/form/CheckboxExtension";
import DatePickerField from "../util/form/DatePickerField";
import InputGroup from "../util/form/InputGroup";
import PositionSelect from "../util/form/PositionSelect";
import TextField from "../util/form/TextField";
import TextFieldArray, { emptyTextArrayElement, mapTextArray, mapTextArrayToStore, TextArrayElement } from "../util/form/TextFieldArray";
import TextForm from "../util/form/TextForm";
import useTextForm from "../util/form/TextFormHook"

type FormInput = {
    voorganger: string
    voorgangerPosition: TextPosition
    datum: Date
    zingen: TextArrayElement[]
    zingenPosition: TextPosition
    schriftlezingen : TextArrayElement[]
    schriftlezingenPosition : TextPosition
    meditatieBijbeltekst: string
    meditatieBijbeltekstPosition: TextPosition
    meditatieBijbelcitaat : string
    meditatieBijbelcitaatCheckbox : boolean
}

function mapFormToTextStore(data: FormInput): BezinningsmomentTextStore {
    return {
        voorganger: {
            value: data.voorganger,
            position: data.voorgangerPosition,
        },
        datum: {
            value: data.datum.toDateString(),
        },
        zingen: {
            values: mapTextArrayToStore(data.zingen),
            position: data.zingenPosition,
        },
        schriftlezingen: {
            values: mapTextArrayToStore(data.schriftlezingen),
            position: data.schriftlezingenPosition,
        },
        meditatieBijbeltekst: {
            value: data.meditatieBijbeltekst,
            position: data.meditatieBijbeltekstPosition,
        },
        meditatieBijbelcitaat: {
            value: data.meditatieBijbelcitaat,
            isCitaat: data.meditatieBijbelcitaatCheckbox,
        },
    }
}

function mapTextStoreToForm(data: BezinningsmomentTextStore): FormInput {
    return {
        voorganger: data.voorganger.value,
        voorgangerPosition: data.voorganger.position,
        datum: new Date(data.datum.value),
        zingen: mapTextArray(data.zingen.values),
        zingenPosition: data.zingen.position,
        schriftlezingen: mapTextArray(data.schriftlezingen.values),
        schriftlezingenPosition: data.schriftlezingen.position,
        meditatieBijbeltekst: data.meditatieBijbeltekst.value,
        meditatieBijbeltekstPosition: data.meditatieBijbeltekst.position,
        meditatieBijbelcitaat: data.meditatieBijbelcitaat.value,
        meditatieBijbelcitaatCheckbox: data.meditatieBijbelcitaat.isCitaat,
    }
}

function formatTekstenForTemplates(teksten: BezinningsmomentTextStore): BezinningsmomentTextStore {
    return {
        ...teksten,
        zingen: {
            ...teksten.zingen,
            values: formatSongs(teksten.zingen.values),
        },
        schriftlezingen: {
            ...teksten.schriftlezingen,
            values: teksten.schriftlezingen.values.map(formatScripture),
        },
        meditatieBijbeltekst: {
            ...teksten.meditatieBijbeltekst,
            value: formatScripture(teksten.meditatieBijbeltekst.value),
        },
        datum: {
            value: formatDate(new Date(teksten.datum.value)),
        },
    }
}

const BezinningsmomentTeksten = () => {
    const { onSubmit, onClear, control, register } = useTextForm({
        textFormConfigName: 'bezinningsmoment',
        mapTextStoreToForm,
        mapFormToTextStore,
        formatTekstenForTemplates,
    })

    return (
        <TextForm onClear={onClear} onSubmit={onSubmit}>
            <InputGroup controlId="bezinningsmomentVoorganger"
                        label="Voorganger"
                        renderPosition={() => <PositionSelect control={control} name="voorgangerPosition" />}>
                <TextField placeholder="Voorganger" control={control} name="voorganger" />
            </InputGroup>

            <InputGroup controlId="bezinningsmomentDatum" label="Datum">
                <DatePickerField placeholder="Datum" control={control} name="datum" />
            </InputGroup>

            <InputGroup controlId="bezinningsmomentZingen"
                        label="Zingen"
                        renderPosition={() => <PositionSelect control={control} name="zingenPosition" />}>
                <TextFieldArray placeholder="Psalm/Gezang"
                                register={register}
                                control={control}
                                name="zingen"
                                generateElement={emptyTextArrayElement} />
            </InputGroup>

            <InputGroup controlId="bezinningsmomentSchriftlezingen"
                        label="Schriftlezing"
                        renderPosition={() => <PositionSelect control={control} name="schriftlezingenPosition" />}>
                <TextFieldArray placeholder="Bijbelgedeelte"
                                register={register}
                                control={control}
                                name="schriftlezingen"
                                generateElement={emptyTextArrayElement} />
            </InputGroup>

            <InputGroup controlId="bezinningsmomentMeditatieBijbeltekst"
                        label="Meditatie - Bijbeltekst"
                        renderPosition={() => <PositionSelect control={control} name="meditatieBijbeltekstPosition" />}>
                <TextField placeholder="Bijbeltekst" control={control} name="meditatieBijbeltekst" />
            </InputGroup>

            <InputGroup controlId="bezinningsmomentPreekBijbelcitaat" label="Meditatie - Bijbelcitaat">
                <TextField placeholder="Meditatie - Bijbelcitaat" control={control} name="meditatieBijbelcitaat">
                    <CheckboxExtension controlId="bezinningsmomentPreekBijbelcitaat_checkbox"
                                       checkboxLabel="Citaat"
                                       control={control}
                        name="meditatieBijbelcitaatCheckbox" />
                </TextField>
            </InputGroup>
        </TextForm>
    )
}

export default BezinningsmomentTeksten
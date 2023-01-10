import React from "react"
import { useForm } from "react-hook-form"
import { TextTemplate } from "../../core/config"
import { formatScripture } from "../../core/formatting/scriptureFormatting";
import { formatSongs } from "../../core/formatting/songFormatting";
import { formatDate } from "../../core/formatting/dateFormatting";
import { BijbellezingTextStore, defaultBijbellezing, fillTemplates, TextPosition } from "../../core/text"
import DatePickerField from "../util/form/DatePickerField";
import InputGroup from "../util/form/InputGroup";
import PositionSelect from "../util/form/PositionSelect";
import SectionHeader from "../util/form/SectionHeader";
import TextField from "../util/form/TextField";
import TextFieldArray, { emptyTextArrayElement, mapTextArray, mapTextArrayToStore, TextArrayElement } from "../util/form/TextFieldArray";
import TextForm from "../util/form/TextForm";

type FormInput = {
    voorganger: string
    datum: Date
    datumVolgendeKeer: Date
    voorgangerPosition: TextPosition
    zingen: TextArrayElement[]
    zingenPosition: TextPosition
    schriftlezingen : TextArrayElement[]
    schriftlezingenPosition : TextPosition
    meditatieBijbeltekst: string
    meditatieBijbeltekstPosition: TextPosition
    meditatieBijbeltekstVolgendeKeer: string
}

function mapFormToTextStore(data: FormInput): BijbellezingTextStore {
    return {
        voorganger: {
            value: data.voorganger,
            position: data.voorgangerPosition,
        },
        datum: {
            value: data.datum.toDateString(),
        },
        datumVolgendeKeer: {
            value: data.datumVolgendeKeer.toDateString(),
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
        meditatieBijbeltekstVolgendeKeer: {
            value: data.meditatieBijbeltekstVolgendeKeer,
        }
    }
}

function mapTextStoreToForm(data: BijbellezingTextStore): FormInput {
    return {
        voorganger: data.voorganger.value,
        voorgangerPosition: data.voorganger.position,
        datum: new Date(data.datum.value),
        datumVolgendeKeer: new Date(data.datumVolgendeKeer.value),
        zingen: mapTextArray(data.zingen.values),
        zingenPosition: data.zingen.position,
        schriftlezingen: mapTextArray(data.schriftlezingen.values),
        schriftlezingenPosition: data.schriftlezingen.position,
        meditatieBijbeltekst: data.meditatieBijbeltekst.value,
        meditatieBijbeltekstPosition: data.meditatieBijbeltekst.position,
        meditatieBijbeltekstVolgendeKeer: data.meditatieBijbeltekstVolgendeKeer.value,
    }
}

function formatTekstenForTemplates(teksten: BijbellezingTextStore): BijbellezingTextStore {
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
        meditatieBijbeltekstVolgendeKeer: {
            value: formatScripture(teksten.meditatieBijbeltekstVolgendeKeer.value),
        },
        datum: {
            value: formatDate(new Date(teksten.datum.value)),
        },
        datumVolgendeKeer: {
            value: formatDate(new Date(teksten.datumVolgendeKeer.value)),
        },
    }
}

type BijbellezingTekstenProps = {
    teksten: BijbellezingTextStore
    tekstTemplate: TextTemplate | undefined
    saveTeksten: (teksten: BijbellezingTextStore) => void
}

const BijbellezingTeksten = ({ teksten, tekstTemplate, saveTeksten }: BijbellezingTekstenProps) => {
    const { control, handleSubmit, register, reset } = useForm<FormInput>({ defaultValues: mapTextStoreToForm(teksten) })

    function onSubmit(data: FormInput) {
        const tekstStore = mapFormToTextStore(data)
        const tekstenVoorTemplates = formatTekstenForTemplates(tekstStore)

        reset(mapTextStoreToForm(tekstStore))
        if (!!tekstTemplate) fillTemplates(tekstTemplate, tekstenVoorTemplates)
        saveTeksten(tekstStore)
    }

    function onClear() {
        reset(mapTextStoreToForm(defaultBijbellezing))
        saveTeksten(defaultBijbellezing)
    }

    return (
        <TextForm onClear={onClear} onSubmit={handleSubmit(onSubmit)}>
            <InputGroup controlId="bijbellezingVoorganger"
                        label="Voorganger"
                        renderPosition={() => <PositionSelect control={control} name="voorgangerPosition" />}>
                <TextField placeholder="Voorganger" control={control} name="voorganger" />
            </InputGroup>

            <InputGroup controlId="bijbellezingDatum" label="Datum">
                <DatePickerField placeholder="Datum" control={control} name="datum" />
            </InputGroup>

            <InputGroup controlId="bijbellezingZingen"
                        label="Zingen"
                        renderPosition={() => <PositionSelect control={control} name="zingenPosition" />}>
                <TextFieldArray placeholder="Psalm/Gezang"
                                register={register}
                                control={control}
                                name="zingen"
                                generateElement={emptyTextArrayElement} />
            </InputGroup>

            <InputGroup controlId="bijbellezingSchriftlezingen"
                        label="Schriftlezing"
                        renderPosition={() => <PositionSelect control={control} name="schriftlezingenPosition" />}>
                <TextFieldArray placeholder="Bijbelgedeelte"
                                register={register}
                                control={control}
                                name="schriftlezingen"
                                generateElement={emptyTextArrayElement} />
            </InputGroup>

            <InputGroup controlId="bijbellezingMeditatieBijbeltekst"
                        label="Meditatie - Bijbeltekst"
                        renderPosition={() => <PositionSelect control={control} name="meditatieBijbeltekstPosition" />}>
                <TextField placeholder="Bijbeltekst" control={control} name="meditatieBijbeltekst" />
            </InputGroup>

            <SectionHeader label="Volgende keer" />

            <InputGroup controlId="bijbellezingDatumVolgendeKeer" label="Datum">
                <DatePickerField placeholder="Datum" control={control} name="datumVolgendeKeer" />
            </InputGroup>

            <InputGroup controlId="bijbellezingMeditatieBijbeltekstVolgendeKeer" label="Meditatie - Bijbeltekst">
                <TextField placeholder="Bijbeltekst" control={control} name="meditatieBijbeltekstVolgendeKeer" />
            </InputGroup>
        </TextForm>
    )
}

export default BijbellezingTeksten

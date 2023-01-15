import React from "react"
import { TextTemplate } from "../../core/config"
import { defaultRouwdienst, fillTemplates, RouwdienstTextStore, TextPosition } from "../../core/text"
import { useForm } from "react-hook-form";
import TextForm from "../util/form/TextForm";
import InputGroup from "../util/form/InputGroup";
import TextField from "../util/form/TextField";
import CheckboxExtension from "../util/form/CheckboxExtension";
import PositionSelect from "../util/form/PositionSelect";
import TextFieldArray, { emptyTextArrayElement, mapTextArray, mapTextArrayToStore, TextArrayElement } from "../util/form/TextFieldArray";
import { formatSongs } from "../../core/formatting/songFormatting";
import { formatScripture } from "../../core/formatting/scriptureFormatting";

type FormInput = {
    naamOverledene: string
    inleidendOrgelspel: string
    inleidendOrgelspelPosition: TextPosition
    zingen: TextArrayElement[]
    zingenPosition: TextPosition
    schriftlezingen : TextArrayElement[]
    schriftlezingenPosition : TextPosition
    preekBijbeltekst : string
    preekBijbeltekstPosition : TextPosition
    preekBijbelcitaat : string
    preekBijbelcitaatCheckbox : boolean
    uitleidendOrgelspel : string
    uitleidendOrgelspelPosition : TextPosition
}

function mapFormToTextStore(data: FormInput): RouwdienstTextStore {
    return {
        naamOverledene: {
            value: data.naamOverledene,
        },
        inleidendOrgelspel: {
            value: data.inleidendOrgelspel,
            position: data.inleidendOrgelspelPosition,
        },
        zingen: {
            values: mapTextArrayToStore(data.zingen),
            position: data.zingenPosition,
        },
        schriftlezingen: {
            values: mapTextArrayToStore(data.schriftlezingen),
            position: data.schriftlezingenPosition,
        },
        preekBijbeltekst: {
            value: data.preekBijbeltekst,
            position: data.preekBijbeltekstPosition,
        },
        preekBijbelcitaat: {
            value: data.preekBijbelcitaat,
            isCitaat: data.preekBijbelcitaatCheckbox,
        },
        uitleidendOrgelspel: {
            value: data.uitleidendOrgelspel,
            position: data.uitleidendOrgelspelPosition,
        },
    }
}

function mapTextStoreToForm(data: RouwdienstTextStore): FormInput {
    return {
        naamOverledene: data.naamOverledene.value,
        inleidendOrgelspel: data.inleidendOrgelspel.value,
        inleidendOrgelspelPosition: data.inleidendOrgelspel.position,
        zingen: mapTextArray(data.zingen.values),
        zingenPosition: data.zingen.position,
        schriftlezingen: mapTextArray(data.schriftlezingen.values),
        schriftlezingenPosition: data.schriftlezingen.position,
        preekBijbeltekst: data.preekBijbeltekst.value,
        preekBijbeltekstPosition: data.preekBijbeltekst.position,
        preekBijbelcitaat: data.preekBijbelcitaat.value,
        preekBijbelcitaatCheckbox: data.preekBijbelcitaat.isCitaat,
        uitleidendOrgelspel: data.uitleidendOrgelspel.value,
        uitleidendOrgelspelPosition: data.uitleidendOrgelspel.position,
    }
}

function formatTekstenForTemplates(teksten: RouwdienstTextStore): RouwdienstTextStore {
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
        preekBijbeltekst: {
            ...teksten.preekBijbeltekst,
            value: formatScripture(teksten.preekBijbeltekst.value),
        },
    }
}

type RouwdienstTekstenProps = {
    teksten: RouwdienstTextStore
    tekstTemplate: TextTemplate | undefined
    saveTeksten: (teksten: RouwdienstTextStore) => void
}

const RouwdienstTeksten = ({ teksten, tekstTemplate, saveTeksten }: RouwdienstTekstenProps) => {
    const { control, handleSubmit, register, reset } = useForm<FormInput>({ defaultValues: mapTextStoreToForm(teksten) })

    function onSubmit(data: FormInput) {
        const tekstStore = mapFormToTextStore(data)
        const tekstenVoorTemplates = formatTekstenForTemplates(tekstStore)

        reset(mapTextStoreToForm(tekstStore))
        if (!!tekstTemplate) fillTemplates(tekstTemplate, tekstenVoorTemplates)
        saveTeksten(tekstStore)
    }

    function onClear() {
        reset(mapTextStoreToForm(defaultRouwdienst))
        saveTeksten(defaultRouwdienst)
    }

    return (
        <TextForm onClear={onClear} onSubmit={handleSubmit(onSubmit)}>
            <InputGroup controlId="rouwdienstNaamOverledene" label="Overledene">
                <TextField placeholder="Naam" control={control} name="naamOverledene" />
            </InputGroup>

            <InputGroup controlId="rouwdienstInleidendOrgelspel"
                        label="Inleidend orgelspel"
                        renderPosition={() => <PositionSelect control={control} name="inleidendOrgelspelPosition" />}>
                <TextField placeholder="Lied naam" control={control} name="inleidendOrgelspel" />
            </InputGroup>

            <InputGroup controlId="rouwdienstZingen"
                        label="Zingen"
                        renderPosition={() => <PositionSelect control={control} name="zingenPosition" />}>
                <TextFieldArray placeholder="Psalm/Gezang"
                                register={register}
                                control={control}
                                name="zingen"
                                generateElement={emptyTextArrayElement} />
            </InputGroup>

            <InputGroup controlId="rouwdienstSchriftlezingen"
                        label="Schriftlezing"
                        renderPosition={() => <PositionSelect control={control} name="schriftlezingenPosition" />}>
                <TextFieldArray placeholder="Bijbelgedeelte"
                                register={register}
                                control={control}
                                name="schriftlezingen"
                                generateElement={emptyTextArrayElement} />
            </InputGroup>

            <InputGroup controlId="rouwdienstPreekBijbeltekst"
                        label="Preek - Bijbeltekst"
                        renderPosition={() => <PositionSelect control={control} name="preekBijbeltekstPosition" />}>
                <TextField placeholder="Bijbeltekst" control={control} name="preekBijbeltekst" />
            </InputGroup>

            <InputGroup controlId="rouwdienstPreekBijbelcitaat" label="Preek - Bijbelcitaat">
                <TextField placeholder="Bijbelcitaat" control={control} name="preekBijbelcitaat">
                    <CheckboxExtension controlId="rouwdienstPreekBijbelcitaat_checkbox"
                                       checkboxLabel="Citaat"
                                       control={control}
                                       name="preekBijbelcitaatCheckbox" />
                </TextField>
            </InputGroup>

            <InputGroup controlId="rouwdienstUitleidendOrgelspel"
                        label="Uitleidend orgelspel"
                        renderPosition={() => <PositionSelect control={control} name="uitleidendOrgelspelPosition" />}>
                <TextField placeholder="Lied naam" control={control} name="uitleidendOrgelspel" />
            </InputGroup>
        </TextForm>
    )
}

export default RouwdienstTeksten

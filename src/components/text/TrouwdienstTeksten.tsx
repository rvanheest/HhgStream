import React from "react"
import { TrouwdienstTextStore, TextPosition } from "../../core/text"
import TextForm from "../util/form/TextForm";
import InputGroup from "../util/form/InputGroup";
import TextField from "../util/form/TextField";
import useTextForm from "../util/form/TextFormHook"
import CheckboxExtension from "../util/form/CheckboxExtension";
import PositionSelect from "../util/form/PositionSelect";
import TextFieldArray, { emptyTextArrayElement, mapTextArray, mapTextArrayToStore, TextArrayElement } from "../util/form/TextFieldArray";
import { formatSongs } from "../../core/formatting/songFormatting";
import { formatScripture } from "../../core/formatting/scriptureFormatting";

type FormInput = {
    naamBruidegom: string
    naamBruid: string
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

function mapFormToTextStore(data: FormInput): TrouwdienstTextStore {
    return {
        naamBruidegom: {
            value: data.naamBruidegom,
        },
        naamBruid: {
            value: data.naamBruid,
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

function mapTextStoreToForm(data: TrouwdienstTextStore): FormInput {
    return {
        naamBruidegom: data.naamBruidegom.value,
        naamBruid: data.naamBruid.value,
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

function formatTekstenForTemplates(teksten: TrouwdienstTextStore): TrouwdienstTextStore {
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

const TrouwdienstTeksten = () => {
    const { onSubmit, onClear, control, register } = useTextForm({
        textFormConfigName: 'trouwdienst',
        mapTextStoreToForm,
        mapFormToTextStore,
        formatTekstenForTemplates,
    })

    return (
        <TextForm onClear={onClear} onSubmit={onSubmit}>
            <InputGroup controlId="trouwdienstNaamBruidegom" label="Bruidegom">
                <TextField placeholder="Naam" control={control} name="naamBruidegom" />
            </InputGroup>

            <InputGroup controlId="trouwdienstNaamBruid" label="Bruid">
                <TextField placeholder="Naam" control={control} name="naamBruid" />
            </InputGroup>

            <InputGroup controlId="trouwdienstInleidendOrgelspel"
                        label="Inleidend orgelspel"
                        renderPosition={() => <PositionSelect control={control} name="inleidendOrgelspelPosition" />}>
                <TextField placeholder="Lied naam" control={control} name="inleidendOrgelspel" />
            </InputGroup>

            <InputGroup controlId="trouwdienstZingen"
                        label="Zingen"
                        renderPosition={() => <PositionSelect control={control} name="zingenPosition" />}>
                <TextFieldArray placeholder="Psalm/Gezang"
                                register={register}
                                control={control}
                                name="zingen"
                                generateElement={emptyTextArrayElement} />
            </InputGroup>

            <InputGroup controlId="trouwdienstSchriftlezingen"
                        label="Schriftlezing"
                        renderPosition={() => <PositionSelect control={control} name="schriftlezingenPosition" />}>
                <TextFieldArray placeholder="Bijbelgedeelte"
                                register={register}
                                control={control}
                                name="schriftlezingen"
                                generateElement={emptyTextArrayElement} />
            </InputGroup>

            <InputGroup controlId="trouwdienstPreekBijbeltekst"
                        label="Preek - Bijbeltekst"
                        renderPosition={() => <PositionSelect control={control} name="preekBijbeltekstPosition" />}>
                <TextField placeholder="Bijbeltekst" control={control} name="preekBijbeltekst" />
            </InputGroup>

            <InputGroup controlId="trouwdienstPreekBijbelcitaat" label="Preek - Bijbelcitaat">
                <TextField placeholder="Bijbelcitaat" control={control} name="preekBijbelcitaat">
                    <CheckboxExtension controlId="trouwdienstPreekBijbelcitaat_checkbox"
                                       checkboxLabel="Citaat"
                                       control={control}
                                       name="preekBijbelcitaatCheckbox" />
                </TextField>
            </InputGroup>

            <InputGroup controlId="trouwdienstUitleidendOrgelspel"
                        label="Uitleidend orgelspel"
                        renderPosition={() => <PositionSelect control={control} name="uitleidendOrgelspelPosition" />}>
                <TextField placeholder="Lied naam" control={control} name="uitleidendOrgelspel" />
            </InputGroup>
        </TextForm>
    )
}

export default TrouwdienstTeksten

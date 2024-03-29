import React from "react"
import { TextPosition } from "../../core/template";
import { KerkdienstTextStore, schriftTypes } from "../../core/text"
import TextForm from "../util/form/TextForm";
import useTextForm from "../util/form/TextFormHook"
import InputGroup from "../util/form/InputGroup";
import TextField from "../util/form/TextField";
import CheckboxExtension from "../util/form/CheckboxExtension";
import PositionSelect from "../util/form/PositionSelect";
import TextFieldArray, { emptyTextArrayElement, mapTextArray, mapTextArrayToStore, TextArrayElement } from "../util/form/TextFieldArray";
import TextArea, { mapTextArea, mapTextAreaToStore } from "../util/form/TextArea";
import SelectField from "../util/form/SelectField";
import { formatSong, formatSongs } from "../../core/formatting/songFormatting";
import { formatScripture } from "../../core/formatting/scriptureFormatting";

type FormInput = {
    voorzang: string
    voorzangPosition: TextPosition
    zingen: TextArrayElement[]
    zingenPosition: TextPosition
    schriftlezingen : TextArrayElement[]
    schriftlezingenPosition : TextPosition
    preekBijbeltekstType: string
    preekBijbeltekst : string
    preekBijbeltekstPosition : TextPosition
    preekBijbelcitaat : string
    preekBijbelcitaatCheckbox : boolean
    preekThema : string
    preekThemaOndertitel : string
    preekThemaPosition : TextPosition
    preekPunten : TextArrayElement[]
    doopKinderen : TextArrayElement[]
    doopKinderenPosition : TextPosition
    mededelingen : string
    mededelingenPosition : TextPosition
}

function mapFormToTextStore(data: FormInput): KerkdienstTextStore {
    return {
        voorzang: {
            value: data.voorzang,
            position: data.voorzangPosition
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
            type: data.preekBijbeltekstType,
            value: data.preekBijbeltekst,
            position: data.preekBijbeltekstPosition,
        },
        preekBijbelcitaat: {
            value: data.preekBijbelcitaat,
            isCitaat: data.preekBijbelcitaatCheckbox,
        },
        preekThema: {
            value: data.preekThema,
            position: data.preekThemaPosition,
        },
        preekThemaOndertitel: {
            value: data.preekThemaOndertitel,
        },
        preekPunten: {
            values: mapTextArrayToStore(data.preekPunten),
        },
        doopKinderen: {
            values: mapTextArrayToStore(data.doopKinderen),
            position: data.doopKinderenPosition,
        },
        mededelingen: {
            lines: mapTextAreaToStore(data.mededelingen),
            position: data.mededelingenPosition,
        },
    }
}

function mapTextStoreToForm(data: KerkdienstTextStore): FormInput {
    return {
        voorzang: data.voorzang.value,
        voorzangPosition: data.voorzang.position,
        zingen: mapTextArray(data.zingen.values),
        zingenPosition: data.zingen.position,
        schriftlezingen: mapTextArray(data.schriftlezingen.values),
        schriftlezingenPosition: data.schriftlezingen.position,
        preekBijbeltekstType: data.preekBijbeltekst.type,
        preekBijbeltekst: data.preekBijbeltekst.value,
        preekBijbeltekstPosition: data.preekBijbeltekst.position,
        preekBijbelcitaat: data.preekBijbelcitaat.value,
        preekBijbelcitaatCheckbox: data.preekBijbelcitaat.isCitaat,
        preekThema: data.preekThema.value,
        preekThemaPosition: data.preekThema.position,
        preekThemaOndertitel: data.preekThemaOndertitel.value,
        preekPunten: mapTextArray(data.preekPunten.values),
        doopKinderen: mapTextArray(data.doopKinderen.values),
        doopKinderenPosition: data.doopKinderen.position,
        mededelingen: mapTextArea(data.mededelingen.lines),
        mededelingenPosition: data.mededelingen.position,
    }
}

function formatTekstenForTemplates(teksten: KerkdienstTextStore): any {
    return {
        ...teksten,
        voorzang: {
            ...teksten.voorzang,
            value: formatSong(teksten.voorzang.value),
        },
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
            kortType: Object.entries(schriftTypes).find(entry => teksten.preekBijbeltekst.type === entry[1])![0]
        },
    }
}

const KerkdienstTeksten = () => {
    const { onSubmit, onClear, control, register } = useTextForm({
        textFormConfigName: 'kerkdienst',
        mapTextStoreToForm,
        mapFormToTextStore,
        formatTekstenForTemplates,
    })

    return (
        <TextForm onClear={onClear} onSubmit={onSubmit}>
            <InputGroup controlId="kerkdienstVoorzang"
                        label="Voorzang"
                        renderPosition={() => <PositionSelect control={control} name="voorzangPosition" />}>
                <TextField placeholder="Psalm/Gezang" control={control} name="voorzang" />
            </InputGroup>

            <InputGroup controlId="kerkdienstZingen"
                        label="Zingen"
                        renderPosition={() => <PositionSelect control={control} name="zingenPosition" />}>
                <TextFieldArray placeholder="Psalm/Gezang"
                                register={register}
                                control={control}
                                name="zingen"
                                generateElement={emptyTextArrayElement} />
            </InputGroup>

            <InputGroup controlId="kerkdienstSchriftlezingen"
                        label="Schriftlezing"
                        renderPosition={() => <PositionSelect control={control} name="schriftlezingenPosition" />}>
                <TextFieldArray placeholder="Bijbelgedeelte"
                                register={register}
                                control={control}
                                name="schriftlezingen"
                                generateElement={emptyTextArrayElement} />
            </InputGroup>

            <InputGroup controlId="kerkdienstPreekBijbeltekst"
                        label="Preek - Bijbeltekst"
                        renderLabelInput={() => <SelectField control={control}
                                                             name="preekBijbeltekstType"
                                                             selectOptions={Object.values(schriftTypes)} />}
                        renderPosition={() => <PositionSelect control={control} name="preekBijbeltekstPosition" />}>
                <TextField placeholder="Bijbeltekst" control={control} name="preekBijbeltekst" />
            </InputGroup>

            <InputGroup controlId="kerkdienstPreekBijbelcitaat" label="Preek - Bijbelcitaat">
                <TextField placeholder="Bijbelcitaat" control={control} name="preekBijbelcitaat">
                    <CheckboxExtension controlId="kerkdienstPreekBijbelcitaat_checkbox"
                                       checkboxLabel="Citaat"
                                       control={control}
                                       name="preekBijbelcitaatCheckbox" />
                </TextField>
            </InputGroup>

            <InputGroup controlId="kerkdienstPreekThema"
                        label="Preek - Thema"
                        renderPosition={() => <PositionSelect control={control} name="preekThemaPosition" />}>
                <TextField placeholder="Thema" control={control} name="preekThema" />
            </InputGroup>

            <InputGroup controlId="kerkdienstPreekThemaOndertitel" label="Preek - Thema ondertitel">
                <TextField placeholder="Ondertitel" control={control} name="preekThemaOndertitel" />
            </InputGroup>

            <InputGroup controlId="kerkdienstPreekPunten" label="Preek - Punten">
                <TextFieldArray placeholder=""
                                register={register}
                                control={control}
                                name="preekPunten"
                                generateElement={emptyTextArrayElement} />
            </InputGroup>

            <InputGroup controlId="kerkdienstDoopkinderen"
                        label="Doopkinderen"
                        renderPosition={() => <PositionSelect control={control} name="doopKinderenPosition" />}>
                <TextFieldArray placeholder="[Naam] ~ [Tekst]"
                                register={register}
                                control={control}
                                name="doopKinderen"
                                generateElement={emptyTextArrayElement} />
            </InputGroup>

            <InputGroup controlId="kerkdienstAlgemeneMededelingen"
                        label="Mededelingen"
                        renderPosition={() => <PositionSelect control={control} name="mededelingenPosition" />}>
                <TextArea placeholder="Mededelingen"
                          rows={3}
                          control={control}
                          name="mededelingen" />
            </InputGroup>
        </TextForm>
    )
}

export default KerkdienstTeksten

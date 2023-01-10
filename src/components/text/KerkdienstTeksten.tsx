import React from "react"
import { TextTemplate } from "../../core/config"
import { defaultKerkdienst, fillTemplates, KerkdienstTextStore, TextPosition } from "../../core/text"
import { useForm } from "react-hook-form";
import TextForm from "../util/form/TextForm";
import InputGroup from "../util/form/InputGroup";
import TextField from "../util/form/TextField";
import CheckboxExtension from "../util/form/CheckboxExtension";
import PositionSelect from "../util/form/PositionSelect";
import TextFieldArray, { emptyTextArrayElement, mapTextArray, mapTextArrayToStore, TextArrayElement } from "../util/form/TextFieldArray";
import TextArea, { mapTextArea, mapTextAreaToStore } from "../util/form/TextArea";
import { formatSong, formatSongs } from "../../core/formatting/songFormatting";
import { formatScripture } from "../../core/formatting/scriptureFormatting";

type FormInput = {
    voorzang: string
    voorzangPosition: TextPosition
    zingen: TextArrayElement[]
    zingenPosition: TextPosition
    schriftlezingen : TextArrayElement[]
    schriftlezingenPosition : TextPosition
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

function formatTekstenForTemplates(teksten: KerkdienstTextStore): KerkdienstTextStore {
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
        },
    }
}

type KerkdienstTekstenProps = {
    teksten: KerkdienstTextStore
    tekstTemplate: TextTemplate | undefined
    saveTeksten: (teksten: KerkdienstTextStore) => void
}

const KerkdienstTeksten = ({ teksten, tekstTemplate, saveTeksten }: KerkdienstTekstenProps) => {
    const { control, handleSubmit, register, reset } = useForm<FormInput>({ defaultValues: mapTextStoreToForm(teksten) })

    function onSubmit(data: FormInput) {
        const tekstStore = mapFormToTextStore(data)
        const tekstenVoorTemplates = formatTekstenForTemplates(tekstStore)

        reset(mapTextStoreToForm(tekstStore))
        if (!!tekstTemplate) fillTemplates(tekstTemplate, tekstenVoorTemplates)
        saveTeksten(tekstStore)
    }

    function onClear() {
        reset(mapTextStoreToForm(defaultKerkdienst))
        saveTeksten(defaultKerkdienst)
    }

    return (
        <TextForm onClear={onClear} onSubmit={handleSubmit(onSubmit)}>
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
import React, { useEffect, useRef } from "react"
import TextForm from "./TextForm";
import { FieldControl } from "../util/form/FieldControl";
import InputGroup from "../util/form/InputGroup";
import PositionSelect from "../util/form/PositionSelect";
import TextArea, { TextAreaOutput } from "../util/form/TextArea";
import TextField, { TextFieldOutput } from "../util/form/TextField";
import TextFieldArray, { TextFieldArrayOutput } from "../util/form/TextFieldArray";
import CheckboxExtension, { CheckboxExtensionOutput } from "../util/form/CheckboxExtension";
import { defaultKerkdienst, fillTemplates, formatSongs, KerkdienstTextStore, TextPosition } from "../../core/text";
import { TextTemplate } from "../../core/config";

type KerkdienstTekstenProps = {
    teksten: KerkdienstTextStore
    tekstTemplate: TextTemplate | undefined
    saveTeksten: (teksten: KerkdienstTextStore) => void
}

const KerkdienstTeksten = ({ teksten, tekstTemplate, saveTeksten }: KerkdienstTekstenProps) => {
    const voorzang = useRef<FieldControl<TextFieldOutput>>(null)
    const voorzangPosition = useRef<FieldControl<TextPosition>>(null)
    const zingen = useRef<FieldControl<TextFieldArrayOutput>>(null)
    const zingenPosition = useRef<FieldControl<TextPosition>>(null)
    const schriftlezingen = useRef<FieldControl<TextFieldArrayOutput>>(null)
    const schriftlezingenPosition = useRef<FieldControl<TextPosition>>(null)
    const preekBijbeltekst = useRef<FieldControl<TextFieldOutput>>(null)
    const preekBijbeltekstPosition = useRef<FieldControl<TextPosition>>(null)
    const preekBijbelcitaat = useRef<FieldControl<TextFieldOutput>>(null)
    const preekBijbelcitaatCheckbox = useRef<FieldControl<CheckboxExtensionOutput>>(null)
    const preekThema = useRef<FieldControl<TextFieldOutput>>(null)
    const preekThemaOndertitel = useRef<FieldControl<TextFieldOutput>>(null)
    const preekThemaPosition = useRef<FieldControl<TextPosition>>(null)
    const preekPunten = useRef<FieldControl<TextFieldArrayOutput>>(null)
    const doopKinderen = useRef<FieldControl<TextFieldArrayOutput>>(null)
    const doopKinderenPosition = useRef<FieldControl<TextPosition>>(null)
    const mededelingen = useRef<FieldControl<TextAreaOutput>>(null)
    const mededelingenPosition = useRef<FieldControl<TextPosition>>(null)

    useEffect(() => {
        voorzang.current?.setOutput(teksten.voorzang.value)
        voorzangPosition.current?.setOutput(teksten.voorzang.position)
        zingen.current?.setOutput(teksten.zingen.values)
        zingenPosition.current?.setOutput(teksten.zingen.position)
        schriftlezingen.current?.setOutput(teksten.schriftlezingen.values)
        schriftlezingenPosition.current?.setOutput(teksten.schriftlezingen.position)
        preekBijbeltekst.current?.setOutput(teksten.preekBijbeltekst.value)
        preekBijbeltekstPosition.current?.setOutput(teksten.preekBijbeltekst.position)
        preekBijbelcitaat.current?.setOutput(teksten.preekBijbelcitaat.value)
        preekBijbelcitaatCheckbox.current?.setOutput(teksten.preekBijbelcitaat.isCitaat)
        preekThema.current?.setOutput(teksten.preekThema.value)
        preekThemaOndertitel.current?.setOutput(teksten.preekThemaOndertitel.value)
        preekThemaPosition.current?.setOutput(teksten.preekThema.position)
        preekPunten.current?.setOutput(teksten.preekPunten.values)
        doopKinderen.current?.setOutput(teksten.doopKinderen.values)
        doopKinderenPosition.current?.setOutput(teksten.doopKinderen.position)
        mededelingen.current?.setOutput(teksten.mededelingen.lines)
        mededelingenPosition.current?.setOutput(teksten.mededelingen.position)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teksten])

    function onSubmit() {
        const teksten = {
            voorzang: {
                value: voorzang.current?.getOutput() ?? defaultKerkdienst.voorzang.value,
                position: voorzangPosition.current?.getOutput() ?? defaultKerkdienst.voorzang.position,
            },
            zingen: {
                values: zingen.current?.getOutput() ?? defaultKerkdienst.zingen.values,
                position: zingenPosition.current?.getOutput() ?? defaultKerkdienst.zingen.position,
            },
            schriftlezingen: {
                values: schriftlezingen.current?.getOutput() ?? defaultKerkdienst.schriftlezingen.values,
                position: schriftlezingenPosition.current?.getOutput() ?? defaultKerkdienst.schriftlezingen.position,
            },
            preekBijbeltekst: {
                value: preekBijbeltekst.current?.getOutput() ?? defaultKerkdienst.preekBijbeltekst.value,
                position: preekBijbeltekstPosition.current?.getOutput() ?? defaultKerkdienst.preekBijbeltekst.position,
            },
            preekBijbelcitaat: {
                value: preekBijbelcitaat.current?.getOutput() ?? defaultKerkdienst.preekBijbelcitaat.value,
                isCitaat: preekBijbelcitaatCheckbox.current?.getOutput() ?? defaultKerkdienst.preekBijbelcitaat.isCitaat,
            },
            preekThema: {
                value: preekThema.current?.getOutput() ?? defaultKerkdienst.preekThema.value,
                position: preekThemaPosition.current?.getOutput() ?? defaultKerkdienst.preekThema.position,
            },
            preekThemaOndertitel: {
                value: preekThemaOndertitel.current?.getOutput() ?? defaultKerkdienst.preekThemaOndertitel.value,
            },
            preekPunten: {
                values: preekPunten.current?.getOutput() ?? defaultKerkdienst.preekPunten.values,
            },
            doopKinderen: {
                values: doopKinderen.current?.getOutput() ?? defaultKerkdienst.doopKinderen.values,
                position: doopKinderenPosition.current?.getOutput() ?? defaultKerkdienst.doopKinderen.position,
            },
            mededelingen: {
                lines: mededelingen.current?.getOutput() ?? defaultKerkdienst.mededelingen.lines,
                position: mededelingenPosition.current?.getOutput() ?? defaultKerkdienst.mededelingen.position,
            },
        }

        const tekstenVoorTemplates = {
            ...teksten,
            zingen: {
                ...teksten.zingen,
                values: formatSongs(teksten.zingen.values),
            },
        }

        if (!!tekstTemplate) fillTemplates(tekstTemplate, tekstenVoorTemplates)
        saveTeksten(teksten)
    }

    return (
        <TextForm onClear={() => saveTeksten(defaultKerkdienst)} onSubmit={onSubmit}>
            <InputGroup controlId="formVoorzang" label="Voorzang" position={<PositionSelect ref={voorzangPosition} />}>
                <TextField ref={voorzang} placeholder="Psalm/Gezang" />
            </InputGroup>

            <InputGroup controlId="formZingen" label="Zingen" position={<PositionSelect ref={zingenPosition} />}>
                <TextFieldArray ref={zingen} placeholder="Psalm/Gezang" />
            </InputGroup>

            <InputGroup controlId="formSchriftlezingen" label="Schriftlezing" position={<PositionSelect ref={schriftlezingenPosition} />}>
                <TextFieldArray ref={schriftlezingen} placeholder="Bijbelgedeelte" />
            </InputGroup>

            <InputGroup controlId="formPreekBijbeltekst" label="Preek - Bijbeltekst" position={<PositionSelect ref={preekBijbeltekstPosition} />}>
                <TextField ref={preekBijbeltekst} placeholder="Bijbeltekst" />
            </InputGroup>

            <InputGroup controlId="formPreekBijbelcitaat" label="Preek - Bijbelcitaat">
                <TextField ref={preekBijbelcitaat} placeholder="Bijbelcitaat">
                    <CheckboxExtension ref={preekBijbelcitaatCheckbox} controlId="formPreekBijbelcitaat_checkbox" checkboxLabel="Citaat" />
                </TextField>
            </InputGroup>

            <InputGroup controlId="formPreekThema" label="Preek - Thema" position={<PositionSelect ref={preekThemaPosition} />}>
                <TextField ref={preekThema} placeholder="Thema" />
            </InputGroup>

            <InputGroup controlId="formPreekThemaOndertitel" label="Preek - Thema ondertitel">
                <TextField ref={preekThemaOndertitel} placeholder="Ondertitel" />
            </InputGroup>

            <InputGroup controlId="formPreekPunten" label="Preek - Punten">
                <TextFieldArray ref={preekPunten} placeholder="" />
            </InputGroup>

            <InputGroup controlId="formDoopkinderen" label="Doopkinderen" position={<PositionSelect ref={doopKinderenPosition} />}>
                <TextFieldArray ref={doopKinderen} placeholder="[Naam] ~ [Tekst]" />
            </InputGroup>

            <InputGroup controlId="formAlgemeneMededelingen" label="Mededelingen" position={<PositionSelect ref={mededelingenPosition} />}>
                <TextArea ref={mededelingen} placeholder="Mededelingen" rows={3} />
            </InputGroup>
        </TextForm>
    )
}

export default KerkdienstTeksten

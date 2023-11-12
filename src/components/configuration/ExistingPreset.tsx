import React, { useState } from "react"
import { Button, Col, Form, Modal, Row } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFloppyDisk, faXmark } from "@fortawesome/free-solid-svg-icons"
import styling from "./ExistingPreset.module.css"
import UpDownFormComponent from "../util/form/UpDownFormComponent"
import { Preset, useDeletePreset, useUpsertPreset } from "../../core/config"

type ExistingPresetProps = {
    cameraId: string
    preset: Preset
}

type ExistingPresetForm = {
    title: string
    red: number
    blue: number
}

function presetEquals(a: Preset, b: Preset): boolean {
    return a.index === b.index
        && a.title === b.title
        && a.adjustedWhiteBalance.blue === b.adjustedWhiteBalance.blue
        && a.adjustedWhiteBalance.red === b.adjustedWhiteBalance.red
}

const ExistingPreset = ({ cameraId, preset }: ExistingPresetProps) => {
    const { register, handleSubmit, control, setValue, formState: { isDirty } } = useForm<ExistingPresetForm>({
        defaultValues: {
            title: preset.title,
            blue: preset.adjustedWhiteBalance.blue,
            red: preset.adjustedWhiteBalance.red,
        },
    })
    const onSubmit = handleSubmit(onSave)
    const upsertPreset = useUpsertPreset()
    const deletePreset = useDeletePreset()
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    function onSave({ title, blue, red }: ExistingPresetForm): void {
        const newPreset = {
            index: preset.index,
            title: title,
            adjustedWhiteBalance: {
                blue: blue,
                red: red,
            },
        }
        if (isDirty && !presetEquals(preset, newPreset)) {
            upsertPreset(cameraId, newPreset)
        }
    }

    function onDelete(): void {
        setShowDeleteModal(true)
    }

    function onCancelDelete(): void {
        setShowDeleteModal(false)
    }

    function onDeleteConfirmed(): void {
        deletePreset(cameraId, preset.index)
        setShowDeleteModal(false)
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <Form.Group as={Row} className="align-items-center pb-1">
                    <Form.Label column sm={{span: 1, offset: 2}} className="text-end">{preset.index}.</Form.Label>
                    <Col sm={2}>
                        <Form.Control {...register("title")}/>
                    </Col>
                    <Col sm={2} className="d-flex justify-content-between">
                        <UpDownFormComponent control={control}
                                             name="red"
                                             buttonVariant="danger"
                                             setValue={setValue}
                                             calculateNewValue={(v, d) => v + d} />
                        <UpDownFormComponent control={control}
                                             name="blue"
                                             buttonVariant="primary"
                                             setValue={setValue}
                                             calculateNewValue={(v, d) => v + d} />
                    </Col>
                    <Col sm={1} className="text-center">
                        <Button type="submit"
                                variant="outline-dark"
                                disabled={!isDirty}
                                className={`border-0 bg-transparent px-1 py-0 ${styling.hoverDark}`}>
                            <FontAwesomeIcon icon={faFloppyDisk} />
                        </Button>
                        <Button type="button"
                                variant="outline-danger"
                                className={`border-0 bg-transparent px-1 py-0 ${styling.hoverDanger}`}
                                onClick={onDelete}>
                            <FontAwesomeIcon icon={faXmark} />
                        </Button>
                    </Col>
                </Form.Group>
            </Form>
    
            <Modal show={showDeleteModal} onHide={onCancelDelete} animation={false} centered>
                <Modal.Header closeButton />
                <Modal.Body>Weet u zeker dat u preset {preset.index} wilt verwijderen?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onCancelDelete}>
                        Nee
                    </Button>
                    <Button variant="primary" onClick={onDeleteConfirmed}>
                        Ja
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ExistingPreset

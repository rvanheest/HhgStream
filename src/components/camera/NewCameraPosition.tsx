import React, { useState } from "react"
import { Form, Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useForm, useWatch } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styling from "./NewCameraPosition.module.css"
import { NewPosition, usePresets } from "../../core/config";
import { useAddCameraPosition, useCameraId } from "../../core/cameraStore";

type NewCameraPositionModalProps = {
    show: boolean
    onCancel: () => void
    onAdd: (newPreset: NewPosition) => void
}

type NewCameraPositionForm = {
    presetNumber: string
    title: string
}

const NewCameraPositionModal = ({ show, onCancel, onAdd }: NewCameraPositionModalProps) => {
    const cameraId = useCameraId()
    const availablePresets = usePresets(cameraId)

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<NewCameraPositionForm>({
        defaultValues: {
            presetNumber: "",
            title: "",
        }
    })

    const selectedPresetString = useWatch({ control: control, name: "presetNumber" })
    const selectedPreset = availablePresets.find(p => p.index === Number(selectedPresetString))!
    const defaultPresetTitle = selectedPresetString.length > 0
        ? selectedPreset.title
        : ""

    const onSubmit = handleSubmit(onAddFromModal)

    function onCancelFromModal() {
        onCancel()
        reset()
    }

    function onAddFromModal(data: NewCameraPositionForm) {
        if (data.title === "") data = { ...data, title: defaultPresetTitle }
        const newPreset: NewPosition = {
            index: Number(data.presetNumber),
            title: data.title === "" ? defaultPresetTitle : data.title,
            adjustedWhiteBalance: selectedPreset.adjustedWhiteBalance,
        }
        
        onAdd(newPreset)
        reset()
    }

    return (
        <Modal show={show} onHide={onCancelFromModal} animation={false} centered>
            <Modal.Header closeButton>
                <Modal.Title>Nieuwe camera positie</Modal.Title>
            </Modal.Header>
            <Form onSubmit={onSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Preset</Form.Label>
                        <Form.Select {...register("presetNumber", { required: true })}
                                     className={`${errors.presetNumber?.type === "required" ? "border border-danger" : ""}`}>
                            <option value=""></option>
                            {availablePresets.map(preset => (<option value={preset.index} key={`index-${preset.index}`}>{preset.title}</option>))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Preset naam</Form.Label>
                        <Form.Control {...register("title")} placeholder={defaultPresetTitle} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" variant="secondary" onClick={onCancelFromModal}>
                        Annuleren
                    </Button>
                    <Button type="submit" variant="primary">
                        Toevoegen
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

type NewCameraPositionProps = {
    groupId: string
}

const NewCameraPosition = ({ groupId }: NewCameraPositionProps) => {
    const [showModal, setShowModal] = useState(false)
    const addCameraPosition = useAddCameraPosition()

    function onCancel(): void {
        setShowModal(false)
    }

    function onAdd(newPosition: NewPosition): void {
        addCameraPosition(groupId, newPosition)
        setShowModal(false)
    }

    function openModal(): void {
        setShowModal(true)
    }
    
    return (
        <>
            <div className={`py-2 border border-success border-3 rounded-3 bg-light text-center user-select-none ${styling.newPosition}`}
                 onClick={openModal}>
                <FontAwesomeIcon icon={faPlus} color="rgb(25,135,84)" />
            </div>
        
            <NewCameraPositionModal show={showModal} onCancel={onCancel} onAdd={onAdd} />
        </>
    )
}

export default NewCameraPosition

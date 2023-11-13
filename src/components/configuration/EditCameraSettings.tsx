import React from "react"
import { Form } from "react-bootstrap"
import { Col, Row } from "react-bootstrap"
import { CameraSettings, useCameraSettings } from "../../core/config"
import { useForm } from "react-hook-form"

type CameraSettingsProps = {
    cameraId: string
    className?: string | undefined
}

type CameraSettingsForm = {
    title: string
    baseUrl: string
    sessionId: string
}

function settingEquals(a: CameraSettings, b: CameraSettings): boolean {
    return a.title === b.title
        && a.baseUrl === b.baseUrl
        && a.sessionId === b.sessionId
}

const EditCameraSettings = ({ cameraId, className }: CameraSettingsProps) => {
    const [settings, setSettings] = useCameraSettings(cameraId)
    const { register, handleSubmit } = useForm<CameraSettingsForm>({ defaultValues: settings, mode: "onBlur" })

    const onSubmit = handleSubmit(onSave)

    function onSave(newSettings: CameraSettingsForm): void {
        if (!settingEquals(settings, newSettings)) {
            setSettings(newSettings)
        }
    }

    return (
        <Form className={className} onBlur={onSubmit}>
            <Row>
                <Col sm={{span: 2, offset: 3}}>
                    <h5>Camera instellingen</h5>
                </Col>
            </Row>
            <Form.Group as={Row} className="pb-1">
                <Form.Label column sm={{span: 1, offset:2}} className="text-end">Naam</Form.Label>
                <Col sm={3}>
                    <Form.Control {...register("title")} />
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="pb-1">
                <Form.Label column sm={{span: 1, offset:2}} className="text-end">URL</Form.Label>
                <Col sm={3}>
                    <Form.Control {...register("baseUrl")} />
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="pb-1">
                <Form.Label column sm={{span: 1, offset:2}} className="text-end">SessionId</Form.Label>
                <Col sm={3}>
                    <Form.Control {...register("sessionId")} />
                </Col>
            </Form.Group>
        </Form>
    )
}

export default EditCameraSettings

import React from "react"
import { useCameraConfigMode, useCameraTitle } from "../../core/cameraStore"
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

const ViewModeCameraTitle = () => {
    const [{ title, baseUrl }] = useCameraTitle()

    return (
        <div className="ms-1 me-1">
            <h1 className="m-0 mb-1 fs-4" style={{ paddingTop: 0.8, paddingBottom: 0.8 }}>{title}</h1>
            <div className="fst-italic" style={{ fontSize: 12, paddingTop: 0.8, paddingBottom: 0.8 }}>{baseUrl}</div>
        </div>
    )
}

type CameraTitleForm = {
    title: string
    baseUrl: string
}

const ConfigModeCameraTitle = () => {
    const [{ title, baseUrl }, setData] = useCameraTitle()
    const { register, handleSubmit } = useForm<CameraTitleForm>({ defaultValues: { title, baseUrl }, mode: "onBlur"})
    const onSubmit = handleSubmit(onChange)

    function onChange({title: newTitle, baseUrl: newBaseUrl}: CameraTitleForm): void {
        if (newTitle !== title || newBaseUrl !== baseUrl) {
            setData(newTitle, newBaseUrl)
        }
    }

    return (
        <form className="ms-1 me-1" onBlur={onSubmit} onSubmit={onSubmit}>
            <Form.Control className="p-0 mb-1 fs-4 text-center" style={{ fontWeight: 500, lineHeight: 1.2 }} {...register("title")} />
            <Form.Control className="p-0 fst-italic text-center" style={{ fontSize: 12 }} {...register("baseUrl")} />
        </form>
    )
}

const CameraTitle = () => {
    const [configMode] = useCameraConfigMode()

    return (
        configMode
            ? <ConfigModeCameraTitle />
            : <ViewModeCameraTitle />
    )
}

export default CameraTitle

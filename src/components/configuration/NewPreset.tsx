import React from "react"
import { useForm } from "react-hook-form"
import { Button, Col, Form, Row } from "react-bootstrap"
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styling from "./NewPreset.module.css"
import UpDownFormComponent from "../util/form/UpDownFormComponent"
import { useUpsertPreset } from "../../core/config"

type NewPresetProps = {
    cameraId: string
    possibleIndexes: number[]
}

type NewPresetForm = {
    index: string
    title: string
    red: number
    blue: number
}

const NewPreset = ({ cameraId, possibleIndexes }: NewPresetProps) => {
    const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm<NewPresetForm>({
        defaultValues: {
            index: "",
            title: "",
            blue: 0,
            red: 0,
        },
    })
    const onSubmit = handleSubmit(onAdd)
    const upsertPreset = useUpsertPreset()

    function onAdd({ index, title, blue, red }: NewPresetForm): void {
        const newPreset = {
            index: Number(index),
            title: title,
            adjustedWhiteBalance: {
                blue: blue,
                red: red,
            },
        }
        upsertPreset(cameraId, newPreset)
        reset()
    }

    return (
        <Form onSubmit={onSubmit}>
            <Row className="align-items-center pb-1">
                <Col sm={{span: 1, offset: 2}} className="text-end">
                    <Form.Select {...register("index", { required: true })}
                                 className={`text-end ${errors.index?.type === "required" ? "border border-danger" : ""}`}>
                        <option value=""></option>
                        {possibleIndexes.map(i => (<option value={i} key={`index-${i}`}>{i}</option>))}
                    </Form.Select>
                </Col>
                <Col sm={2}>
                    <Form.Control {...register("title", { required: true })}
                                  placeholder="preset naam"
                                  className={`${errors.title?.type === "required" && "border border-danger"}`}/>
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
                            variant="outline-success"
                            className={`border-0 bg-transparent px-1 py-0 ${styling.hoverSuccess}`}>
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                    <Button type="reset"
                            variant="outline-danger"
                            className={`border-0 bg-transparent px-1 py-0 ${styling.hoverDanger}`}
                            onClick={() => reset()}>
                        <FontAwesomeIcon icon={faXmark} />
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}

export default NewPreset

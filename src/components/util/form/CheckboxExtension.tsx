import React from "react"
import { Form } from "react-bootstrap"
import { FieldValues, useController, UseControllerProps } from "react-hook-form"

export type CheckboxExtensionProps<TFieldValues extends FieldValues> = UseControllerProps<TFieldValues> & {
    checkboxLabel: string
    controlId: string
}

const CheckboxExtension = <TFieldValues extends FieldValues>({ checkboxLabel, controlId, ...rest }: CheckboxExtensionProps<TFieldValues>) => {
    const { field } = useController(rest)

    return (
        <div className="input-group-text">
            <Form.Check reverse id={controlId} label={checkboxLabel} type="checkbox" { ...field } />
        </div>
    )
}

export default CheckboxExtension

import React, { ReactNode } from "react"
import { Form } from "react-bootstrap"
import { FieldValues, useController, UseControllerProps } from "react-hook-form"

export type TextFieldProps<TFieldValues extends FieldValues> = UseControllerProps<TFieldValues> & {
    type?: string
    placeholder: string
    children?: ReactNode
}

const TextField = <TFieldValues extends FieldValues>({ type = "input", placeholder, children, ...rest }: TextFieldProps<TFieldValues>) => {
    const { field } = useController(rest)

    return (
        <div className="input-group">
            <Form.Control type={type} placeholder={placeholder} { ...field } />
            {children}
        </div>
    )
}

export default TextField

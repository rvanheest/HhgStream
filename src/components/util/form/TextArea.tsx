import React from "react"
import { Form } from "react-bootstrap"
import { FieldValues, useController, UseControllerProps } from "react-hook-form"

export function mapTextArea(lines: string[]): string {
    return lines.join("\n")
}

export function mapTextAreaToStore(lines: string): string[] {
    const split = lines.split("\n")
    return !!split.filter(s => s).length ? split : []
}

export type TextAreaProps<TFieldValues extends FieldValues> = UseControllerProps<TFieldValues> & {
    placeholder: string
    rows: number
}

const TextArea = <TFieldValues extends FieldValues>({ rows, placeholder, ...rest }: TextAreaProps<TFieldValues>) => {
    const { field } = useController(rest)

    return (
        <div className="input-group">
            <Form.Control as="textarea" rows={rows} placeholder={placeholder} { ...field } />
        </div>
    )
}

export default TextArea

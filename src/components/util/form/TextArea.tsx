import React, { ForwardedRef, forwardRef, useImperativeHandle, useRef } from "react"
import { Form } from "react-bootstrap"
import { FieldControl } from "./FieldControl"

type TextAreaProps = {
    placeholder: string
    rows: number
}

export type TextAreaOutput = string[]

const TextArea = ({rows, placeholder}: TextAreaProps, ref: ForwardedRef<FieldControl<TextAreaOutput>>) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    useImperativeHandle(ref, () => ({
        getOutput: () => {
            const array = textareaRef.current?.value.split("\n") ?? []
            return !array.filter(s => s).length ? [] : array
        },
        setOutput(value: TextAreaOutput) {
            if (textareaRef.current) textareaRef.current.value = value.join("\n")
        }
    }))

    return (
        <div className="input-group">
            <Form.Control ref={textareaRef}
                          as="textarea"
                          rows={rows}
                          placeholder={placeholder} />
        </div>
    )
}

export default forwardRef(TextArea)

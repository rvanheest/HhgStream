import React, { ForwardedRef, forwardRef, ReactNode, useImperativeHandle, useRef } from "react";
import { Form } from "react-bootstrap";
import { FieldControl } from "./FieldControl";

export type TextFieldProps = {
    placeholder: string
    type?: string
}

export type TextFieldOutput = string | undefined

type Props = TextFieldProps & { children?: ReactNode }

const TextField = ({ placeholder, type = "input", children }: Props, ref: ForwardedRef<FieldControl<TextFieldOutput>>) => {
    const textfieldRef = useRef<HTMLInputElement>(null)
    useImperativeHandle(ref, () => ({
        getOutput: () => !!textfieldRef.current?.value ? textfieldRef.current.value : undefined,
        setOutput(value: TextFieldOutput) {
            if (textfieldRef.current) textfieldRef.current.value = value ?? ""
        }
    }))

    return (
        <div className="input-group">
            <Form.Control ref={textfieldRef} type={type} placeholder={placeholder} />
            {children}
        </div>
    )
}

export default forwardRef(TextField)

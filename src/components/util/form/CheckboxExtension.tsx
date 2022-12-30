import React, { ForwardedRef, forwardRef, useImperativeHandle, useRef } from "react";
import { Form } from "react-bootstrap";
import { FieldControl } from "./FieldControl";

type CheckboxExtensionProps = {
    checkboxLabel: string
    controlId: string
}

export type CheckboxExtensionOutput = boolean | undefined

const CheckboxExtension = ({ checkboxLabel, controlId }: CheckboxExtensionProps, ref: ForwardedRef<FieldControl<CheckboxExtensionOutput>>) => {
    const checkboxFieldRef = useRef<HTMLInputElement>(null)
    useImperativeHandle(ref, () => ({
        getOutput: () => checkboxFieldRef.current?.checked,
        setOutput(value: CheckboxExtensionOutput) {
            if (checkboxFieldRef.current) checkboxFieldRef.current.checked = value ?? false
        }
    }))

    return (
        <div className="input-group-text">
            <Form.Check ref={checkboxFieldRef} reverse id={controlId} label={checkboxLabel} type="checkbox" />
        </div>
    )
}

export default forwardRef(CheckboxExtension)

import React, { ForwardedRef, forwardRef, useImperativeHandle, useRef } from "react"
import { Form } from "react-bootstrap"
import { TextPosition } from "../../../core/text"
import { FieldControl } from "./FieldControl"

type PositionSelectProps = {

}

const PositionSelect = ({}: PositionSelectProps, ref: ForwardedRef<FieldControl<TextPosition>>) => {
    const textPositionRef = useRef<HTMLSelectElement>(null)
    useImperativeHandle(ref, () => ({
        getOutput: () => {
            const value = textPositionRef.current?.value ?? "";
            return TextPosition[value as keyof typeof TextPosition];
        },
        setOutput(position: TextPosition) {
            if (textPositionRef.current) textPositionRef.current.selectedIndex = Object.values(TextPosition).indexOf(position)
        }
    }))

    return (
        <Form.Select ref={textPositionRef}>
            {
                Object.entries(TextPosition)
                    .map(p => (<option key={p[0]} value={p[0]}>{p[1]}</option>))
            }
        </Form.Select>
    )
}

export default forwardRef(PositionSelect)

import React from "react"
import { Form } from "react-bootstrap"
import { FieldValues, useController, UseControllerProps } from "react-hook-form"
import { TextPosition } from "../../../core/text"

export type PositionSelectProps<TFieldValues extends FieldValues> = UseControllerProps<TFieldValues>

const PositionSelect = <TFieldValues extends FieldValues>(props: PositionSelectProps<TFieldValues>) => {
    const { field: { onChange, value, ...rest } } = useController(props)

    function onSelect(e: React.ChangeEvent<HTMLSelectElement>): void {
        onChange({
            ...e,
            target: {
                ...e.target,
                value: TextPosition[e.target.value as keyof typeof TextPosition]
            }
        })
    }

    function toEnumValue(v: string): string | undefined {
        const enumValue = Object.entries(TextPosition).find(e => e[1] === v)
        return enumValue && enumValue[0]
    }

    return (
        <Form.Select {...rest} value={toEnumValue(value)} onChange={onSelect}>{
            Object.entries(TextPosition).map(p => (<option key={p[0]} value={p[0]}>{p[1]}</option>))
        }</Form.Select>
    )
}

export default PositionSelect
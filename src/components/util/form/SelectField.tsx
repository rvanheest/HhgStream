import React, { useEffect } from "react"
import { Form } from "react-bootstrap"
import { FieldValues, useController, UseControllerProps } from "react-hook-form"

export type SelectFieldProps<TFieldValues extends FieldValues> = UseControllerProps<TFieldValues> & {
    selectOptions: string[]
    defaultSelectedIndex?: number | undefined
}

const SelectField = <TFieldValues extends FieldValues>({ selectOptions, defaultSelectedIndex, ...props }: SelectFieldProps<TFieldValues>) => {
    const { field: { value, onChange, ...rest } } = useController(props)

    useEffect(() => {
        if (value === undefined) {
            const index = defaultSelectedIndex ?? 0
            if (index < selectOptions.length) {
                onChange(selectOptions[index])
            }
        }
    }, [defaultSelectedIndex, selectOptions, value, onChange])

    return (
        <Form.Select {...rest} value={value} onChange={onChange}>
            {selectOptions.map(s => (<option key={s} value={s}>{s}</option>))}
        </Form.Select>
    )
}

export default SelectField

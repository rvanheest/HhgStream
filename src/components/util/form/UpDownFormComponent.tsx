import React from "react"
import { Control, FieldPath, FieldPathValue, FieldValues, UseFormSetValue, useWatch } from "react-hook-form"
import UpDownButtonGroup from "../UpDownButtonGroup"

type UpDownFormComponentProps<TFieldValues extends FieldValues, TFieldName extends FieldPath<TFieldValues>> = {
    control: Control<TFieldValues>
    name: TFieldName
    buttonVariant: "primary" | "secondary" | "danger"
    setValue: UseFormSetValue<TFieldValues>
    calculateNewValue: (oldValue: FieldPathValue<TFieldValues, TFieldName>, delta: number) => FieldPathValue<TFieldValues, TFieldName>
}

const UpDownFormComponent = <TFieldValues extends FieldValues, TFieldName extends FieldPath<TFieldValues>>({ control, name, buttonVariant, setValue, calculateNewValue }: UpDownFormComponentProps<TFieldValues, TFieldName>) => {
    const value = useWatch<TFieldValues, TFieldName>({ control: control, name: name })

    return (
        // eslint-disable-next-line react/jsx-no-undef
        <UpDownButtonGroup whbValue={value}
                           buttonVariant={buttonVariant}
                           onChange={delta => setValue(name, calculateNewValue(value, delta), { shouldDirty: true, shouldTouch: true })} />
    )
}

export default UpDownFormComponent
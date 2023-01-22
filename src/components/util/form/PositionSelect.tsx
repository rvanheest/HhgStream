import React from "react"
import { FieldValues, UseControllerProps } from "react-hook-form"
import { TextPosition } from "../../../core/text"
import SelectField from "./SelectField"

const PositionSelect = <TFieldValues extends FieldValues>(props: UseControllerProps<TFieldValues>) => (
    <SelectField {...props} selectOptions={Object.values(TextPosition)}/>
)

export default PositionSelect
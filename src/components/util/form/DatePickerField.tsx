import React from "react"
import { FieldValues, useController, UseControllerProps } from "react-hook-form"
import { faCalendar } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import DatePicker from "react-date-picker"
import "./DatePickerField.css"

type DatePickerFieldProps<TFieldValues extends FieldValues> = UseControllerProps<TFieldValues> & {
    placeholder: string
}

const DatePickerField = <TFieldValues extends FieldValues>({ placeholder, ...rest }: DatePickerFieldProps<TFieldValues>) => {
    const { field } = useController(rest)

    return (
        <div className="input-group">
            <DatePicker format="dd MMMM yyyy"
                        clearIcon={null}
                        dayPlaceholder="dag"
                        monthPlaceholder="maand"
                        yearPlaceholder="jaar"
                        showWeekNumbers={false}
                        className="noBorder form-control"
                        calendarIcon={<FontAwesomeIcon icon={faCalendar} />}
                        calendarClassName="custom-calendar"
                        { ...field } />
        </div>
    )
}

export default DatePickerField

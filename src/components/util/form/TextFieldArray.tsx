import React from "react"
import { Button, Form } from "react-bootstrap"
import { faCircleMinus, faCirclePlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FieldValues, useFieldArray, UseFieldArrayProps, FieldArrayPath, Path, UseFormRegister, FieldArray } from "react-hook-form"

export type TextFieldArrayProps<TFieldValues extends FieldValues, TFieldArrayName extends FieldArrayPath<TFieldValues>> = UseFieldArrayProps<TFieldValues, TFieldArrayName> & {
    placeholder: string
    type?: string
    register: UseFormRegister<TFieldValues>
    valueName?: string
    generateElement: () => FieldArray<TFieldValues, TFieldArrayName>
}

const TextFieldArray = <TFieldValues extends FieldValues, TFieldArrayName extends FieldArrayPath<TFieldValues>>({ type = "input", placeholder, register, valueName = 'value', generateElement, ...rest }: TextFieldArrayProps<TFieldValues, TFieldArrayName>) => {
    const { fields, append, remove, update } = useFieldArray({ ...rest })

    function fieldName(index: number): Path<TFieldValues> {
        return `${rest.name}.${index}.${valueName}` as Path<TFieldValues>
    }

    function appendField(shouldFocus: boolean = true) {
        append(generateElement(), { shouldFocus })
    }

    function deleteField(index: number) {
        if (fields.length === 1) update(0, generateElement())
        else remove(index)
    }

    function onKeyPress(e: React.KeyboardEvent<any>, index: number) {
        if (e.repeat) return

        if (e.ctrlKey && e.key === 'Enter') {
            appendField()
            e.preventDefault()
        }
        else if (e.ctrlKey && e.key === 'Delete') {
            deleteField(index)
        }
    }

    return (
        <>{
            fields.map((field, index, array) => {
                const lastElement = index === array.length - 1
                return (
                    <div key={field.id} className={`input-group ${!lastElement ? "mb-1" : ""}`.trim()}>
                        <Form.Control type={type} placeholder={placeholder} onKeyDown={e => onKeyPress(e, index)} {...register(fieldName(index))} />
                        {!lastElement ? undefined :
                            <Button variant="dark"
                                className="bg-gradient"
                                type="button"
                                tabIndex={-1}
                                onClick={() => appendField()}>
                                <FontAwesomeIcon icon={faCirclePlus} />
                            </Button>}
                        <Button variant="dark"
                            className="bg-gradient"
                            type="button"
                            tabIndex={-1}
                            onClick={() => deleteField(index)}>
                            <FontAwesomeIcon icon={faCircleMinus} />
                        </Button>
                    </div>
                )
            })
        }</>
    )
}

export default TextFieldArray

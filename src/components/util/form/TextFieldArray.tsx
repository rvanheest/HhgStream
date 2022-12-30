import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePlus, faCircleMinus } from "@fortawesome/free-solid-svg-icons"
import { FieldControl } from "./FieldControl";

type TextFieldArrayProps = {
    placeholder: string
    type?: string
}

export type TextFieldArrayOutput = string[]

const TextFieldArray = ({ placeholder, type = "input" }: TextFieldArrayProps, ref: ForwardedRef<FieldControl<TextFieldArrayOutput>>) => {
    const [fields, setFields] = useState<string[]>([""])
    const inputRefs = useRef<HTMLInputElement[]>([])
    const [focusElement, setFocusElement] = useState<HTMLInputElement>()

    useImperativeHandle(ref, () => ({
        getOutput: () => !fields.filter(s => s).length ? [] : fields,
        setOutput(values: TextFieldArrayOutput) {
            setFields(!values.filter(s => s).length ? [""] : values)
        }
    }), [fields])

    useEffect(() => {
        focusElement && focusElement.focus()
    }, [focusElement])

    function setFocus(index: number) {
        setFocusElement(inputRefs.current[index])
    }

    function addElement() {
        setFields(prevState => [...prevState, ""])
    }

    function removeElement(index: number) {
        setFields(prevState => {
            const result = prevState.filter((v, i) => i !== index)
            return !result.length ? [""] : result
        })
    }

    function onKeyPress(e: React.KeyboardEvent<any>, index: number) {
        if (e.repeat) return

        if (((e.key === 'Tab' || e.key === 'Enter') && e.shiftKey) || e.key === 'ArrowUp') {
            if (index > 0) setFocus(index - 1)
            else if (e.key === 'Tab' && e.shiftKey) return
            e.preventDefault()
        }
        else if (e.key === 'Tab' || e.key === 'Enter' || e.key === 'ArrowDown') {
            if (index < fields.length - 1) setFocus(index + 1)
            else if (e.key === 'Tab' && !e.ctrlKey) return
            else addElement()
            e.preventDefault()
        }
        else if (e.key === 'Delete' && e.shiftKey) {
            if (fields.length > 1) {
                const isLastElement = index === fields.length - 1
                removeElement(index)
                if (isLastElement) setFocus(index - 1)
            }
            e.preventDefault()
        }
    }

    return (
        <>{
            fields.map((field, index, array) => {
                const lastElement = index === array.length - 1
                return (
                    <div key={`array-element-${index}`} className={`input-group ${!lastElement ? "mb-1" : ""}`.trim()}>
                        <Form.Control value={field}
                                      onChange={(event) => setFields(oldFields => [...oldFields.slice(0, index), event.target.value, ...oldFields.slice(index + 1)])}
                                      ref={(el: HTMLInputElement) => inputRefs.current[index] = el}
                                      type={type}
                                      placeholder={placeholder}
                                      onKeyDown={e => onKeyPress(e, index)}/>
                        {!lastElement ? undefined :
                            <Button variant="dark"
                                    className="bg-gradient"
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() => addElement()}>
                                <FontAwesomeIcon icon={faCirclePlus} />
                            </Button>}
                        <Button variant="dark"
                                className="bg-gradient"
                                type="button"
                                tabIndex={-1}
                                onClick={() => removeElement(index)}>
                            <FontAwesomeIcon icon={faCircleMinus} />
                        </Button>
                    </div>
                )
            })
        }</>
    )
}

export default forwardRef(TextFieldArray)

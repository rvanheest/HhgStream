import React, { ReactNode } from "react"
import styling from "./TextForm.module.css"
import { Button, Form } from "react-bootstrap"

type TextFormProps = {
    children: ReactNode
    onClear: () => void
    onSubmit: () => void
}

const TextForm = ({ children, onClear, onSubmit }: TextFormProps) => {
    return (
        <Form>
            <div className={`pt-2 ${styling.scrollable}`}>
                { children }
            </div>
            <div className="py-1 d-flex flex-row flex-wrap" style={{ borderTop: "var(--bs-card-border-width) solid var(--bs-card-border-color)" }}>
                <div style={{ marginLeft: "25%" }}>
                    <Button variant="primary" onClick={onSubmit}>Opslaan</Button>
                </div>
                <div style={{ marginLeft: "35px" }}>
                    <Button variant="secondary" onClick={onClear}>Leeg maken</Button>
                </div>
            </div>
        </Form>
    )
}

export default TextForm

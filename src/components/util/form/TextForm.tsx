import React, { ReactNode } from "react"
import styling from "./TextForm.module.css"
import { Button, Col, Container, Form, Row } from "react-bootstrap"

type TextFormProps = {
    children: ReactNode
    onClear: () => void
    onSubmit: () => void
}

const TextForm = ({ children, onClear, onSubmit }: TextFormProps) => {
    return (
        <Container fluid className="ps-0 pe-0">
            <Form>
                <div className="pb-1">
                    <div className={`${styling.scrollable}`}>
                        { children }
                    </div>
                </div>

                <Row className="pt-1 mb-1" style={{borderTop: "var(--bs-card-border-width) solid var(--bs-card-border-color)"}}>
                    <Col sm={{offset: 3, span: 1}}>
                        <Button variant="primary" onClick={onSubmit}>Opslaan</Button>
                    </Col>
                    <Col sm={{span: 2}}>
                        <Button variant="secondary" onClick={onClear}>Leeg maken</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}

export default TextForm

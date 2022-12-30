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
        <Container fluid className={`${styling.scrollable}`}>
            <Form>
                { children }

                <Row className="mb-2">
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

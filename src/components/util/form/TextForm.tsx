import React, { ReactNode } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"

type TextFormProps = {
    children: ReactNode
    onClear: () => void
    onSubmit: () => void
}

const TextForm = ({ children, onClear, onSubmit }: TextFormProps) => {
    return (
        <Form className="h-100">
            <Container fluid className="gx-0 d-flex flex-column h-100">
                <Row className="gx-0 h-100 flex-grow-1">
                    <Col sm={12} className="overflow-auto position-relative h-100">
                        <div className="pt-2 position-absolute w-100 overflow-hidden">
                            {children}
                        </div>
                    </Col>
                </Row>
                <Row className="gx-0 py-1" style={{ borderTop: "var(--bs-card-border-width) solid var(--bs-card-border-color)" }}>
                    <Col sm={{offset: 3, span: 1}}>
                        <Button variant="primary" onClick={onSubmit}>Opslaan</Button>
                    </Col>
                    <Col sm={{span: 2}}>
                        <Button variant="secondary" onClick={onClear}>Leeg maken</Button>
                    </Col>
                </Row>
            </Container>
        </Form>
    )
}

export default TextForm

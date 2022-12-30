import React, { ReactNode } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Label from "./Label";

type InputGroupProps = {
    controlId: string
    label: string
    position?: ReactNode | undefined
    children: ReactNode
}

const InputGroup = ({ controlId, label, position, children }: InputGroupProps) => {
    return (
        <Form.Group controlId={controlId}>
            <Row className="mb-2">
                <Col sm={{offset: 1, span: 2}}>
                    <Label>{label}</Label>
                </Col>
                <Col sm={{span: 5}}>
                    {children}
                </Col>
                {position && <Col sm={{span: 2}}>{position}</Col>}
            </Row>
        </Form.Group>
    )
}

export default InputGroup

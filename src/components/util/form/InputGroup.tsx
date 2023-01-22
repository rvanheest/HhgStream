import React, { ReactNode } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Label from "./Label";

type InputGroupProps = {
    controlId: string
    label: string
    renderLabelInput?: () => JSX.Element
    renderPosition?: () => JSX.Element
    children: ReactNode
}

const InputGroup = ({ controlId, label, renderLabelInput, renderPosition, children }: InputGroupProps) => {
    return (
        <Form.Group controlId={controlId}>
            <Row className="mb-2">
                <Col sm={{offset: 1, span: 2}}>
                    {!!renderLabelInput ? renderLabelInput() : <Label>{label}</Label>}
                </Col>
                <Col sm={{span: 5}}>
                    {children}
                </Col>
                {renderPosition && <Col sm={{span: 2}}>{renderPosition()}</Col>}
            </Row>
        </Form.Group>
    )
}

export default InputGroup

import React, { ReactNode } from "react";
import { Form } from "react-bootstrap";

type LabelProps = {
    children: ReactNode
}

const Label = ({ children }: LabelProps) => (
    <Form.Label style={{marginTop: 6}}>{children}</Form.Label>
)

export default Label

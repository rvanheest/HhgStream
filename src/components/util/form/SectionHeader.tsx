import React from "react"
import { Col } from "react-bootstrap"
import { Row } from "react-bootstrap"

type SectionHeaderProps = {
    label: string
}

const SectionHeader = ({ label }: SectionHeaderProps) => {
    return (
        <Row className="mb-2">
            <Col sm={{offset: 1, span: 2}}>
                <h4>{label}</h4>
            </Col>
        </Row>
    )
}

export default SectionHeader

import React from "react"
import { Col, Row } from "react-bootstrap"
import { Position } from "../../core/config"
import CameraPosition from "./CameraPosition"

type CameraPositionGroupProps = {
    positions: Position[]
}

const CameraPositionGroup = ({ positions }: CameraPositionGroupProps) => (
    <Row className="row-cols-4 p-1 g-2 align-items-center">
        {positions.map((position, index) => (
            <Col key={`${position.title}-${index}`}>
                <CameraPosition position={position} />
            </Col>
        ))}
    </Row>
)

export default CameraPositionGroup

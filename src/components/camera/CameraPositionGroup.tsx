import React from "react"
import { Col, Row } from "react-bootstrap"
import { Position } from "../../core/config"
import CameraPosition from "./CameraPosition"

type CameraPositionGroupProps = {
    positions: Position[]
    onPositionClick: (p: Position) => Promise<void>
}

const CameraPositionGroup = ({ positions, onPositionClick }: CameraPositionGroupProps) => (
    <Row className="row-cols-4 p-1 g-2 align-items-center">
        {positions.map((position, index) => (
            <Col key={`${position.title}-${index}`}>
                <CameraPosition position={position} onSelect={p => onPositionClick(p)} />
            </Col>
        ))}
    </Row>
)

export default CameraPositionGroup

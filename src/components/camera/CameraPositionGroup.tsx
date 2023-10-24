import React from "react"
import { Col, Row } from "react-bootstrap"
import { Position } from "../../core/config"
import CameraPosition from "./CameraPosition"

type CameraPositionGroupProps = {
    groupId: string
    positions: Position[]
}

const CameraPositionGroup = ({ groupId, positions }: CameraPositionGroupProps) => (
    <Row className="row-cols-4 p-1 g-1 align-items-center">
        {positions.map(position => (
            <Col key={position.id}>
                <CameraPosition groupId={groupId} position={position} />
            </Col>
        ))}
    </Row>
)

export default CameraPositionGroup

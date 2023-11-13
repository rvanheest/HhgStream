import React from "react"
import { Col, Row } from "react-bootstrap"
import { useCameraConfigMode } from "../../core/cameraStore"
import { Position } from "../../core/config"
import CameraPosition from "./CameraPosition"
import NewCameraPosition from "./NewCameraPosition"

type CameraPositionGroupProps = {
    groupId: string
    positions: Position[]
}

const CameraPositionGroup = ({ groupId, positions }: CameraPositionGroupProps) => {
    const [configMode] = useCameraConfigMode()

    return (
        <Row className="row-cols-4 p-1 g-1 align-items-center">
            {positions.map(position => (
                <Col key={position.id}>
                    <CameraPosition groupId={groupId} position={position} />
                </Col>
                ))}
            {configMode
                ? <Col>
                    <NewCameraPosition groupId={groupId} />
                </Col>
                : undefined
            }
        </Row>
    )
}

export default CameraPositionGroup

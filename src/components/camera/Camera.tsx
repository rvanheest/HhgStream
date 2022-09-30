import React from "react"
import { Col, Row } from 'react-bootstrap';
import CameraPosition from "./CameraPosition"
import { Camera, Position } from "../../core/config"
import { moveCamera } from "../../core/camera"

type CameraProps = {
    camera: Camera
}

const CameraComponent = ({ camera }: CameraProps) => {
    async function onPositionClick(position: Position) {
        await moveCamera(camera, position)
    }

    return (
        <>
            <Row>
                <h1 className="m-0 px-2 py-1 fs-5 fw-bold">{camera.title}</h1>
            </Row>
            <Row>
                <p className="fst-italic" style={{fontSize: "12px"}}>{camera.baseUrl}</p>
            </Row>
            <Row className="row-cols-3 align-items-center px-2 py-1 g-2">
                {camera.positions.map(position => (
                    <Col key={`${camera.title}-${position.index}`}>
                        <CameraPosition position={position} onSelect={p => onPositionClick(p)} />
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default CameraComponent;

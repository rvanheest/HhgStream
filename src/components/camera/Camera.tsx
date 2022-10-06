import React, { useEffect, useState } from "react"
import { Col, Row } from 'react-bootstrap';
import CameraAeLevels from "./CameraAeLevels";
import CameraPositionTabPane from "./CameraPositionTabPane";
import CameraWhiteBalance from "./CameraWhiteBalance";
import { Camera, Position } from "../../core/config"
import { CameraStatus, ICameraInteraction } from "../../core/camera";

type CameraProps = {
    camera: Camera
    cameraInteraction: ICameraInteraction
}

const CameraComponent = ({ camera, cameraInteraction }: CameraProps) => {
    const [latestPosition, setLatestPosition] = useState<Position>()
    const [cameraStatus, setCameraStatus] = useState<CameraStatus>()

    useEffect(() => {
        const interval = setInterval(async () => {
            if (cameraInteraction) {
                const status = await cameraInteraction?.getCameraStatus()
                setCameraStatus(status)
            }
        }, 1000)

        return function cleanUp() {
            clearInterval(interval)
        }
    }, [cameraInteraction])

    async function onPositionClick(position: Position): Promise<void> {
        await cameraInteraction?.moveCamera(position)
        setLatestPosition(position)
    }

    return (
        <>
            <Row className="align-items-center">
                <Col sm={5}>
                    <h1 className="m-0 px-1 py-1 fs-4">{camera.title}</h1>
                    <div className="fst-italic" style={{fontSize: "12px"}}>{camera.baseUrl}</div>
                    <div className="fw-bold fs-6">Huidig: <span className="fw-normal fst-italic">{latestPosition?.title ?? "Onbekend"}</span></div>    
                </Col>
                <Col sm={2}>{
                    cameraStatus?.aeLevels.changeAllowed
                        ? <CameraAeLevels aeLevels={cameraStatus.aeLevels} cameraInteraction={cameraInteraction} />
                        : undefined
                }</Col>
                <Col sm={5}>{
                    cameraStatus?.whiteBalance.changeAllowed
                        ? <CameraWhiteBalance whiteBalance={cameraStatus.whiteBalance} whiteBalanceOverride={latestPosition?.adjustedWhiteBalance} cameraInteraction={cameraInteraction} />
                        : undefined
                }</Col>
            </Row>
            <Row>
                <Col>
                    <CameraPositionTabPane groups={camera.positionGroups} onPositionClick={p => onPositionClick(p)} cameraInteraction={cameraInteraction} />
                </Col>
            </Row>
        </>
    )
}

export default CameraComponent;

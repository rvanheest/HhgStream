import React from "react"
import { Col, Row } from "react-bootstrap"
import * as Electron from "electron"
import { getCameraInteraction } from "../../core/camera"
import { Camera as CameraConfig } from "../../core/config"
import Camera from "./Camera"

const { app: { isPackaged } }: typeof Electron = window.require('@electron/remote')

type CameraTabProps = {
    cameras: CameraConfig[]
}

const CameraTab = ({ cameras }: CameraTabProps) => (
    <Row>
        {cameras.map((camera, index) => (
            // px-1 py-1 
            <Col key={camera.title} className={`${index === 0 ? "mx-2" : "me-2"} px-0 border border-dark border-3 rounded-3`}>
                <Camera camera={camera} cameraInteraction={getCameraInteraction(camera, !isPackaged)} />
            </Col>
        ))}
    </Row>
)

export default CameraTab
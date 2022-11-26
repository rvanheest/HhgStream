import React from "react"
import {Col, Row} from "react-bootstrap"
import * as Electron from "electron"
import { getCameraInteraction } from "../../core/camera"
import { Camera as CameraConfig } from "../../core/config"
import Camera from "./Camera"

const { app: { isPackaged } }: typeof Electron = window.require('@electron/remote')

type CameraTabProps = {
    cameras: CameraConfig[]
}

const CameraTab = ({ cameras }: CameraTabProps) => (
    <Row className="row-cols-2 g-2">
        {cameras.map(camera => (
            <Col key={camera.title}>
                <Camera camera={camera} cameraInteraction={getCameraInteraction(camera, !isPackaged)} />
            </Col>
        ))}
    </Row>
)

export default CameraTab
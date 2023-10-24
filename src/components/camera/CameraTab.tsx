import React, { memo, useEffect, useRef } from "react"
import { Col, Row } from "react-bootstrap"
import { bind, Subscribe } from "@react-rxjs/core"
import * as Electron from "electron"
import { ICameraInteraction } from "../../core/camera"
import { Camera as CameraConfig } from "../../core/config"
import Camera from "./Camera"
import { useCamerasConfig } from "../../core/config"
import { CameraContextProvider, createCameraStore, useCameraInteraction, useSetCameraStatus } from "../../core/cameraStore";

const { app: { isPackaged } }: typeof Electron = window.require('@electron/remote')

const [useLiveCameraStatus] = bind((cameraInteraction: ICameraInteraction) => cameraInteraction.getLiveCameraStatus$())

const CameraPane = memo(() => (
    <div className="border border-dark border-3 rounded-3">
        <Camera />
    </div>
))

const CameraStatus = () => {
    const cameraInteraction = useCameraInteraction()
    const cameraStatus = useLiveCameraStatus(cameraInteraction)
    const setCameraStatus = useSetCameraStatus()

    useEffect(() => {
        setCameraStatus(cameraStatus)
    }, [cameraStatus, setCameraStatus])

    return !cameraStatus ? (<div>Loading...</div>) : <CameraPane/>
}

type CameraInteractionProps = {
    camera: CameraConfig
}

const CameraStore = ({ camera }: CameraInteractionProps) => {
    const store = useRef(createCameraStore(camera, !isPackaged))

    return (
        <CameraContextProvider value={store.current}>
            <Subscribe>
                <CameraStatus />
            </Subscribe>
        </CameraContextProvider>
    )
}

const CameraTab = () => {
    const cameras = useCamerasConfig()

    return (
        <Row className="row-cols-2 g-2">
            {cameras.map(camera => (
                <Col key={camera.id}>
                    <CameraStore camera={camera}/>
                </Col>
            ))}
        </Row>
    )
}

export default CameraTab

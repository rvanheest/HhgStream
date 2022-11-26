import React, { memo, useCallback, useEffect, useState } from "react"
import { Col, Container, Row } from 'react-bootstrap';
import CameraAeLevels from "./CameraAeLevels";
import CameraTitle from "./CameraTitle";
import CameraPositionTabPane from "./CameraPositionTabPane";
import CameraWhiteBalance from "./CameraWhiteBalance";
import { Camera, Position } from "../../core/config"
import { CameraStatus, ICameraInteraction } from "../../core/camera";

const MemoedCameraAeLevels = memo(CameraAeLevels, (prevProps, nextProps) => {
    return prevProps.aeLevels.changeAllowed === nextProps.aeLevels.changeAllowed &&
        prevProps.aeLevels.value === nextProps.aeLevels.value
})
const MemoedCameraPositionTabPane = memo(CameraPositionTabPane)
const MemoedCameraTitle = memo(CameraTitle)
const MemoedCameraWhiteBalance = memo(CameraWhiteBalance, (prevProps, nextProps) => {
    return prevProps.whiteBalance.changeAllowed === nextProps.whiteBalance.changeAllowed &&
        prevProps.whiteBalance.blue === nextProps.whiteBalance.blue &&
        prevProps.whiteBalance.red === nextProps.whiteBalance.red
})

type CameraProps = CameraStatusWrapperProps & {
    cameraStatus: CameraStatus
}

const CameraComponent = ({ camera, cameraInteraction, cameraStatus: { aeLevels, whiteBalance } }: CameraProps) => {
    const [latestPosition, setLatestPosition] = useState<Position>()
    const memoedOnPositionClick = useCallback(onPositionClick, [cameraInteraction])

    async function onPositionClick(position: Position): Promise<void> {
        await cameraInteraction?.moveCamera(position)
        setLatestPosition(position)
    }

    return (
        <Container fluid>
            <Row className="text-center align-items-center py-1">
                <Col sm={4} className="px-0">
                    <MemoedCameraTitle title={camera.title}
                                       baseUrl={camera.baseUrl}
                                       latestPosition={latestPosition?.title} />
                </Col>
                <Col sm={2} className="px-0">
                    <MemoedCameraAeLevels aeLevels={aeLevels}
                                          cameraInteraction={cameraInteraction} />
                </Col>
                <Col sm={6} className="px-0">
                    <MemoedCameraWhiteBalance whiteBalance={whiteBalance}
                                              whiteBalanceOverride={latestPosition?.adjustedWhiteBalance}
                                              cameraInteraction={cameraInteraction} />
                </Col>
            </Row>
            <Row className="pt-1">
                <Col className="px-0">
                    <MemoedCameraPositionTabPane groups={camera.positionGroups}
                                                 onPositionClick={memoedOnPositionClick}
                                                 cameraInteraction={cameraInteraction} />
                </Col>
            </Row>
        </Container>
    )
}

const MemoedCameraComponent = memo(CameraComponent, (prevProps, nextProps) => {
    return prevProps.cameraStatus.name === nextProps.cameraStatus.name &&
        prevProps.cameraStatus.aeLevels.changeAllowed === nextProps.cameraStatus.aeLevels.changeAllowed &&
        prevProps.cameraStatus.aeLevels.value === nextProps.cameraStatus.aeLevels.value &&
        prevProps.cameraStatus.whiteBalance.changeAllowed === nextProps.cameraStatus.whiteBalance.changeAllowed &&
        prevProps.cameraStatus.whiteBalance.blue === nextProps.cameraStatus.whiteBalance.blue &&
        prevProps.cameraStatus.whiteBalance.red === nextProps.cameraStatus.whiteBalance.red
})

type CameraStatusWrapperProps = {
    camera: Camera
cameraInteraction: ICameraInteraction
}

const CameraStatusWrapper = ({ camera, cameraInteraction }: CameraStatusWrapperProps) => {
    const [cameraStatus, setCameraStatus] = useState<CameraStatus>()

    useEffect(() => {
        async function loadStatus(): Promise<void> {
            if (cameraInteraction) {
                const status = await cameraInteraction?.getCameraStatus()
                setCameraStatus(status)
            }
        }

        (loadStatus)()
        const interval = setInterval(loadStatus, 1000)
        return () => clearInterval(interval)
    }, [cameraInteraction])

    if (!cameraStatus) return (<div>Loading...</div>)

    return (
        <div className="border border-dark border-3 rounded-3">
            <MemoedCameraComponent camera={camera} cameraInteraction={cameraInteraction} cameraStatus={cameraStatus} />
        </div>
    )
}

export default CameraStatusWrapper;

import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import { Col, Container, Row } from 'react-bootstrap';
import CameraAeLevels from "./CameraAeLevels";
import CameraTitle from "./CameraTitle";
import CameraPositionTabPane from "./CameraPositionTabPane";
import CameraWhiteBalance from "./CameraWhiteBalance";
import { Camera, Position } from "../../core/config"
import { CameraStatus, ICameraInteraction } from "../../core/camera";

const MemoedCameraAeLevels = memo(CameraAeLevels)
const MemoedCameraPositionTabPane = memo(CameraPositionTabPane)
const MemoedCameraTitle = memo(CameraTitle)
const MemoedCameraWhiteBalance = memo(CameraWhiteBalance)

type CameraProps = CameraStatusWrapperProps & {
    cameraStatus: CameraStatus
}

const CameraComponent = ({ camera, cameraInteraction, cameraStatus: { aeLevels, whiteBalance } }: CameraProps) => {
    const [latestPosition, setLatestPosition] = useState<Position>()
    const memoedOnPositionClick = useCallback(onPositionClick, [cameraInteraction])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const memoedWhiteBalance = useMemo(() => whiteBalance, [whiteBalance.changeAllowed, whiteBalance.blue, whiteBalance.red])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const memoedAeLevels = useMemo(() => aeLevels, [aeLevels.changeAllowed, aeLevels.value])

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
                    <MemoedCameraAeLevels aeLevels={memoedAeLevels}
                                          cameraInteraction={cameraInteraction} />
                </Col>
                <Col sm={6} className="px-0">
                    <MemoedCameraWhiteBalance whiteBalance={memoedWhiteBalance}
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

const MemoedCameraComponent = memo(CameraComponent)

type CameraStatusWrapperProps = {
    camera: Camera
cameraInteraction: ICameraInteraction
}

const CameraStatusWrapper = ({ camera, cameraInteraction }: CameraStatusWrapperProps) => {
    const [cameraStatus, setCameraStatus] = useState<CameraStatus>()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const memoedCameraStatus = useMemo(() => cameraStatus, [
        cameraStatus?.name,
        cameraStatus?.aeLevels.changeAllowed,
        cameraStatus?.aeLevels.value,
        cameraStatus?.whiteBalance.changeAllowed,
        cameraStatus?.whiteBalance.blue,
        cameraStatus?.whiteBalance.red,
    ])

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

    if (!memoedCameraStatus) return (<div>Loading...</div>)

    return (
        <MemoedCameraComponent camera={camera} cameraInteraction={cameraInteraction} cameraStatus={memoedCameraStatus} />
    )
}

export default CameraStatusWrapper;

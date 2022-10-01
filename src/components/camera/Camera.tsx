import React, { useEffect, useState } from "react"
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import * as Electron from "electron"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleUp, faChevronCircleDown } from "@fortawesome/free-solid-svg-icons"
import CameraPosition from "./CameraPosition"
import { Camera, Position } from "../../core/config"
import { CameraStatus, getCameraInteraction, ICameraInteraction } from "../../core/camera";

const { app: { isPackaged } }: typeof Electron = window.require('@electron/remote')

type CameraProps = {
    camera: Camera
}

const CameraComponent = ({ camera }: CameraProps) => {
    const [cameraInteraction, setCameraInteraction] = useState<ICameraInteraction>()
    const [latestPosition, setLatestPosition] = useState<Position>()
    const [cameraStatus, setCameraStatus] = useState<CameraStatus>()
    const [whbDisabled, setWhbDisabled] = useState<boolean>(false)

    useEffect(() => {
        setCameraInteraction(getCameraInteraction(camera, !isPackaged))
    }, [])

    useEffect(() => {
        const interval = setInterval(async () => {
            if (cameraInteraction) {
                const status = await cameraInteraction?.getCameraStatus()
                setCameraStatus(status)
            }
        }, 1000)

        return function cleanUp() {
            console.log(`clear interval for camera ${camera.title}`)
            clearInterval(interval)
        }
    }, [cameraInteraction])

    async function sleep(timeMs: number): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, timeMs))
    }

    async function onAeLevelClick(levelChange: number) {
        await cameraInteraction?.changeAeLevel(levelChange)
    }

    async function onWhiteBalanceClick() {
        await cameraInteraction?.correctWhiteBalence()
        setWhbDisabled(true)
        await sleep(5000)
        if (latestPosition?.adjustedWhiteBalance) await cameraInteraction?.changeWhiteBalence(latestPosition.adjustedWhiteBalance)
        setWhbDisabled(false)
    }

    async function onWhiteBalanceBlueClick(levelChange: number) {
        await cameraInteraction?.changeWhiteBalanceLevelBlue(levelChange)
    }

    async function onWhiteBalanceRedClick(levelChange: number) {
        await cameraInteraction?.changeWhiteBalanceLevelRed(levelChange)
    }

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
                        ? <>
                            <div className="fst-italic" style={{fontSize: "12px"}}>AE Level: {cameraStatus?.aeLevels.value}</div>
                            <ButtonGroup>
                                <Button variant="secondary"
                                        className="border-end"
                                        onClick={() => onAeLevelClick(-1)}>
                                    <FontAwesomeIcon icon={faChevronCircleDown} />
                                </Button>
                                <Button variant="secondary"
                                        onClick={() => onAeLevelClick(1)}>
                                    <FontAwesomeIcon icon={faChevronCircleUp} />
                                </Button>
                            </ButtonGroup>
                        </>
                        : undefined
                }</Col>
                <Col sm={5}>{
                    cameraStatus?.whiteBalance.changeAllowed
                        ? <>
                            <div className="fst-italic" style={{fontSize: "12px"}}>Witbalans (R, B): ({cameraStatus?.whiteBalance.red}, {cameraStatus?.whiteBalance.blue})</div>
                            <ButtonGroup className="me-2">
                                <Button variant="danger"
                                        className="border-end"
                                        disabled={whbDisabled}
                                        onClick={() => onWhiteBalanceRedClick(-1)}>
                                    <FontAwesomeIcon icon={faChevronCircleDown} />
                                </Button>
                                <Button variant="danger"
                                        disabled={whbDisabled}
                                        onClick={() => onWhiteBalanceRedClick(1)}>
                                    <FontAwesomeIcon icon={faChevronCircleUp} />
                                </Button>
                            </ButtonGroup>
                            <ButtonGroup className="me-2">
                                <Button variant="secondary"
                                        disabled={whbDisabled}
                                        onClick={() => onWhiteBalanceClick()}>
                                    W
                                </Button>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button variant="primary"
                                        className="border-end"
                                        disabled={whbDisabled}
                                        onClick={() => onWhiteBalanceBlueClick(-1)}>
                                    <FontAwesomeIcon icon={faChevronCircleDown} />
                                </Button>
                                <Button variant="primary"
                                        disabled={whbDisabled}
                                        onClick={() => onWhiteBalanceBlueClick(1)}>
                                    <FontAwesomeIcon icon={faChevronCircleUp} />
                                </Button>
                            </ButtonGroup>
                        </>
                        : undefined
                }</Col>
            </Row>
            <Row className="row-cols-4 p-1 g-2">
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

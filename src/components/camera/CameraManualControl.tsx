import React, { useState } from "react"
import { Button, ButtonGroup, Col, Form, Row } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowUp, faArrowDown, faArrowLeft, faArrowRight, faHome, faAnglesRight, faAngleRight, faAnglesLeft, faAngleLeft, IconDefinition } from "@fortawesome/free-solid-svg-icons"
import styling from "./CameraManualControl.module.css"
import { ICameraInteraction } from "../../core/camera"
import { Position } from "../../core/config"

type ControlButtonProps = {
    children: JSX.Element | string
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    onPress?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    onRelease?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ControlButton = ({ children, onClick, onPress, onRelease }: ControlButtonProps) => (
    <Button variant="dark"
            className="d-flex align-items-center justify-content-center border border-light border-1 rounded-0 bg-gradient"
            style={{width: 45, height: 45}}
            onClick={e => onClick && onClick(e)}
            onMouseDown={e => onPress && onPress(e) }
            onMouseUp={e => onRelease && onRelease(e) }>
        {children}
    </Button>
)

type ManualControlProps = {
    cameraInteraction: ICameraInteraction
}

const ManualControl = ({ cameraInteraction }: ManualControlProps) => (
    <div className="d-flex flex-column">
        <ButtonGroup className={`${styling.motionGroup}`}>
            <ControlButton onPress={() => cameraInteraction.startCameraMove("Left", "Up")}
                           onRelease={() => cameraInteraction.stopCameraMove()}>
                <FontAwesomeIcon icon={faArrowUp} style={{transform: "rotate(-45deg)"}} />
            </ControlButton>
            <ControlButton onPress={() => cameraInteraction.startCameraMove("Stop", "Up")}
                           onRelease={() => cameraInteraction.stopCameraMove()}>
                <FontAwesomeIcon icon={faArrowUp} />
            </ControlButton>
            <ControlButton onPress={() => cameraInteraction.startCameraMove("Right", "Up")}
                           onRelease={() => cameraInteraction.stopCameraMove()}>
                <FontAwesomeIcon icon={faArrowUp} style={{transform: "rotate(45deg)"}} />
            </ControlButton>
        </ButtonGroup>
        <ButtonGroup className={`${styling.motionGroup}`}>
            <ControlButton onPress={() => cameraInteraction.startCameraMove("Left", "Stop")}
                           onRelease={() => cameraInteraction.stopCameraMove()}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </ControlButton>
            <ControlButton onClick={() => cameraInteraction.moveCameraHome()}>
                <FontAwesomeIcon icon={faHome} />
            </ControlButton>
            <ControlButton onPress={() => cameraInteraction.startCameraMove("Right", "Stop")}
                           onRelease={() => cameraInteraction.stopCameraMove()}>
                <FontAwesomeIcon icon={faArrowRight} />
            </ControlButton>
        </ButtonGroup>
        <ButtonGroup className={`${styling.motionGroup}`}>
            <ControlButton onPress={() => cameraInteraction.startCameraMove("Left", "Down")}
                           onRelease={() => cameraInteraction.stopCameraMove()}>
                <FontAwesomeIcon icon={faArrowDown} style={{transform: "rotate(45deg)"}} />
            </ControlButton>
            <ControlButton onPress={() => cameraInteraction.startCameraMove("Stop", "Down")}
                           onRelease={() => cameraInteraction.stopCameraMove()}>
                <FontAwesomeIcon icon={faArrowDown} />
            </ControlButton>
            <ControlButton onPress={() => cameraInteraction.startCameraMove("Right", "Down")}
                           onRelease={() => cameraInteraction.stopCameraMove()}>
                <FontAwesomeIcon icon={faArrowDown} style={{transform: "rotate(-45deg)"}} />
            </ControlButton>
        </ButtonGroup>
    </div>
)

const faAngles3Right: IconDefinition = {
    prefix: 'fas',
    iconName: 'angles-right',
    icon: [704, 512, ["171", "angle-triple-left"], "f100", "M 662.6 278.6 c 12.5 -12.5 12.5 -32.8 0 -45.3 l -160 -160 c -12.5 -12.5 -32.8 -12.5 -45.3 0 s -12.5 32.8 0 45.3 L 594.7 256 L 457.4 393.4 c -12.5 12.5 -12.5 32.8 0 45.3 s 32.8 12.5 45.3 0 l 160 -160 z M 470.6 278.6 c 12.5 -12.5 12.5 -32.8 0 -45.3 l -160 -160 c -12.5 -12.5 -32.8 -12.5 -45.3 0 s -12.5 32.8 0 45.3 L 402.7 256 L 265.4 393.4 c -12.5 12.5 -12.5 32.8 0 45.3 s 32.8 12.5 45.3 0 l 160 -160 z m -352 160 l 160 -160 c 12.5 -12.5 12.5 -32.8 0 -45.3 l -160 -160 c -12.5 -12.5 -32.8 -12.5 -45.3 0 s -12.5 32.8 0 45.3 L 210.7 256 L 73.4 393.4 c -12.5 12.5 -12.5 32.8 0 45.3 s 32.8 12.5 45.3 0 z"]
}

type ZoomControlProps = {
    cameraInteraction: ICameraInteraction
}

const ZoomControl = ({ cameraInteraction }: ZoomControlProps) => (
    <div className="d-flex flex-column">
        <ButtonGroup className={`${styling.zoomGroup}`}>
            <ControlButton onPress={() => cameraInteraction.startCameraZoom(1)}
                           onRelease={() => cameraInteraction.stopCameraZoom()}>
                <FontAwesomeIcon icon={faAngleRight} />
            </ControlButton>
            <ControlButton onPress={() => cameraInteraction.startCameraZoom(2)}
                           onRelease={() => cameraInteraction.stopCameraZoom()}>
                <FontAwesomeIcon icon={faAnglesRight} />
            </ControlButton>
            <ControlButton onPress={() => cameraInteraction.startCameraZoom(3)}
                           onRelease={() => cameraInteraction.stopCameraZoom()}>
                <FontAwesomeIcon icon={faAngles3Right} />
            </ControlButton>
        </ButtonGroup>
        <ButtonGroup className={`${styling.zoomGroup}`}>
            <ControlButton onPress={() => cameraInteraction.startCameraZoom(-1)}
                           onRelease={() => cameraInteraction.stopCameraZoom()}>
                <FontAwesomeIcon icon={faAngleLeft} />
            </ControlButton>
            <ControlButton onPress={() => cameraInteraction.startCameraZoom(-2)}
                           onRelease={() => cameraInteraction.stopCameraZoom()}>
                <FontAwesomeIcon icon={faAnglesLeft} />
            </ControlButton>
            <ControlButton onPress={() => cameraInteraction.startCameraZoom(-3)}
                           onRelease={() => cameraInteraction.stopCameraZoom()}>
                <FontAwesomeIcon icon={faAngles3Right} style={{transform: "scale(-1, 1)"}} />
            </ControlButton>
        </ButtonGroup>
    </div>
)

type PresetControlProps = {
    onNumberClick: (x: string) => void
    onClean: () => void
}

const PresetControl = ({ onNumberClick, onClean } : PresetControlProps) => (
    <div className="d-flex flex-column">
        <ButtonGroup className={`${styling.presetGroup}`}>
            <ControlButton onClick={e => onNumberClick(e.currentTarget.innerText)}>1</ControlButton>
            <ControlButton onClick={e => onNumberClick(e.currentTarget.innerText)}>2</ControlButton>
            <ControlButton onClick={e => onNumberClick(e.currentTarget.innerText)}>3</ControlButton>
        </ButtonGroup>
        <ButtonGroup className={`${styling.presetGroup}`}>
            <ControlButton onClick={e => onNumberClick(e.currentTarget.innerText)}>4</ControlButton>
            <ControlButton onClick={e => onNumberClick(e.currentTarget.innerText)}>5</ControlButton>
            <ControlButton onClick={e => onNumberClick(e.currentTarget.innerText)}>6</ControlButton>
        </ButtonGroup>
        <ButtonGroup className={`${styling.presetGroup}`}>
            <ControlButton onClick={e => onNumberClick(e.currentTarget.innerText)}>7</ControlButton>
            <ControlButton onClick={e => onNumberClick(e.currentTarget.innerText)}>8</ControlButton>
            <ControlButton onClick={e => onNumberClick(e.currentTarget.innerText)}>9</ControlButton>
        </ButtonGroup>
        <ButtonGroup className={`${styling.presetGroup}`}>
            <ControlButton onClick={e => onNumberClick(e.currentTarget.innerText)}>0</ControlButton>
            <Button variant="dark"
                    className="border border-light border-1 bg-transparent"
                    style={{width: 45, height: 45}}
                    disabled={true}>
            </Button>
            <ControlButton onClick={() => onClean()}>C</ControlButton>
        </ButtonGroup>
    </div>
)

type PresetActionButtonsProps = {
    preset: string
    onMove: () => void
}

const PresetActionButtons = ({ preset, onMove }: PresetActionButtonsProps) => (
    <div className="d-flex flex-column">
        <Form.Control type="text"
                      value={preset}
                      className={`${styling.presetNumber}`}
                      disabled />
        <Button variant="dark"
                className="border border-light border-1 rounded-0 bg-gradient"
                style={{height: 45}}
                onClick={() => onMove()}>
            Move
        </Button>
    </div>
)

type CameraManualControlProps = {
    cameraInteraction: ICameraInteraction
    onPositionClick: (p: Position) => Promise<void>
}

const CameraManualControl = ({ cameraInteraction, onPositionClick }: CameraManualControlProps) => {
    const [preset, setPreset] = useState("")
    const [moved, setMoved] = useState(true)

    function appendPreset(x: string): void {
        setPreset(s => {
            if (moved) return x
            if (s.length > 0 && s[0] === "0") return x
            if (s.length < 3) return `${s}${x}`
            return `${s.slice(0, 2)}${x}`
        })
        setMoved(false)
    }

    function cleanPreset(): void {
        setPreset("")
        setMoved(true)
    }

    function moveToPreset(): void {
        onPositionClick({ index: Number.parseInt(preset), title: "handmatig" })
        setMoved(true)
    }

    return (
        <div className="p-2">
            <Row>
                <Col className="d-flex justify-content-center">
                    <ManualControl cameraInteraction={cameraInteraction} />
                </Col>

                <Col className="d-flex justify-content-center">
                    <ZoomControl cameraInteraction={cameraInteraction} />
                </Col>

                <Col className="d-flex justify-content-center">
                    <PresetControl onNumberClick={x => appendPreset(x)} onClean={() => cleanPreset()} />
                </Col>

                <Col>
                    <PresetActionButtons preset={preset} onMove={() => moveToPreset()} />
                </Col>
            </Row>
        </div>
    )
}

export default CameraManualControl

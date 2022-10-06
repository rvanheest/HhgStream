import React from "react"
import { Button, ButtonGroup } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronCircleUp, faChevronCircleDown } from "@fortawesome/free-solid-svg-icons"
import { AeLevels, ICameraInteraction } from "../../core/camera"

type CameraAeLevelsProps = {
    aeLevels: AeLevels
    cameraInteraction: ICameraInteraction
}

const CameraAeLevels = ({ aeLevels, cameraInteraction }: CameraAeLevelsProps) => (
    <>
        <div className="fst-italic" style={{ fontSize: "12px" }}>AE Level: {aeLevels.value}</div>
        <ButtonGroup>
            <Button variant="secondary" className="border-end" onClick={() => cameraInteraction.changeAeLevel(-1)}>
                <FontAwesomeIcon icon={faChevronCircleDown} />
            </Button>
            <Button variant="secondary" onClick={() => cameraInteraction.changeAeLevel(1)}>
                <FontAwesomeIcon icon={faChevronCircleUp} />
            </Button>
        </ButtonGroup>
    </>
)

export default CameraAeLevels

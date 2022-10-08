import React, { useEffect, useState } from "react"
import { Button, ButtonGroup } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronCircleUp, faChevronCircleDown } from "@fortawesome/free-solid-svg-icons"
import { ICameraInteraction } from "../../core/camera"
import CircleValueIndicator from "../util/CircleValueIndicator"

type CameraAeLevelsProps = {
    aeLevels: number
    cameraInteraction: ICameraInteraction
}

const CameraAeLevels = ({ aeLevels, cameraInteraction }: CameraAeLevelsProps) => {
    const [value, setValue] = useState<number>(aeLevels)

    useEffect(() => {
        setValue(aeLevels)
    }, [aeLevels])

    function onButtonClick(change: number) {
        setValue(v => v + change)
        cameraInteraction.changeAeLevel(change)
    }

    return (
        <>
            <div className="fst-italic" style={{ fontSize: "12px" }}>AE Level</div>
            <ButtonGroup>
                <Button variant="secondary" className="border-end border-2 bg-gradient" onClick={() => onButtonClick(-1)}>
                    <FontAwesomeIcon icon={faChevronCircleDown} />
                </Button>
                <CircleValueIndicator value={value} xOffset={34} yOffset={11} />
                <Button variant="secondary" className="bg-gradient" onClick={() => onButtonClick(1)}>
                    <FontAwesomeIcon icon={faChevronCircleUp} />
                </Button>
            </ButtonGroup>
        </>
    )
}

export default CameraAeLevels

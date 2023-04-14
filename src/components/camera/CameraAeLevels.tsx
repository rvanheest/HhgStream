import React from "react"
import { Button, ButtonGroup } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronCircleDown, faChevronCircleUp } from "@fortawesome/free-solid-svg-icons"
import CircleValueIndicator from "../util/CircleValueIndicator"
import { useCurrentAeLevels } from "../../core/cameraStore";

const CameraAeLevels = () => {
    const [aeLevels, setAeLevels] = useCurrentAeLevels()

    async function onButtonClick(change: number) {
        await setAeLevels(change)
    }

    if (!aeLevels || !aeLevels.changeAllowed) return (<div />)
    const { value } = aeLevels

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

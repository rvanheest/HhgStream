import React, { useState } from "react"
import { Button, ButtonGroup } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronCircleUp, faChevronCircleDown } from "@fortawesome/free-solid-svg-icons"
import { ICameraInteraction, WhiteBalance } from "../../core/camera"
import { WhiteBalanceOverride } from "../../core/config"
import { sleep } from "../../core/utils"

type CameraWhiteBalanceProps = {
    whiteBalance: WhiteBalance
    whiteBalanceOverride: WhiteBalanceOverride | undefined
    cameraInteraction: ICameraInteraction
}

const CameraWhiteBalance = ({ whiteBalance, whiteBalanceOverride, cameraInteraction }: CameraWhiteBalanceProps) => {
    const [whbDisabled, setWhbDisabled] = useState<boolean>(false)

    async function onWhiteBalanceClick() {
        await cameraInteraction.correctWhiteBalence()
        setWhbDisabled(true)
        await sleep(5000)
        if (whiteBalanceOverride) await cameraInteraction.changeWhiteBalence(whiteBalanceOverride)
        setWhbDisabled(false)
    }

    return (
        <>
            <div className="fst-italic" style={{fontSize: "12px"}}>Witbalans (R, B): ({whiteBalance.red}, {whiteBalance.blue})</div>
            <ButtonGroup className="me-2">
                <Button variant="danger" className="border-end" disabled={whbDisabled} onClick={() => cameraInteraction.changeWhiteBalanceLevelRed(-1)}>
                    <FontAwesomeIcon icon={faChevronCircleDown} />
                </Button>
                <Button variant="danger" disabled={whbDisabled} onClick={() => cameraInteraction.changeWhiteBalanceLevelRed(1)}>
                    <FontAwesomeIcon icon={faChevronCircleUp} />
                </Button>
            </ButtonGroup>
            <ButtonGroup className="me-2">
                <Button variant="secondary" disabled={whbDisabled} onClick={() => onWhiteBalanceClick()}>
                    W
                </Button>
            </ButtonGroup>
            <ButtonGroup>
                <Button variant="primary" className="border-end" disabled={whbDisabled} onClick={() => cameraInteraction.changeWhiteBalanceLevelBlue(-1)}>
                    <FontAwesomeIcon icon={faChevronCircleDown} />
                </Button>
                <Button variant="primary" disabled={whbDisabled} onClick={() => cameraInteraction.changeWhiteBalanceLevelBlue(1)}>
                    <FontAwesomeIcon icon={faChevronCircleUp} />
                </Button>
            </ButtonGroup>
        </>
    )
}

export default CameraWhiteBalance

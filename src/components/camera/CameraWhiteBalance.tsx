import React, { useEffect, useState } from "react"
import { Button, ButtonGroup } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronCircleUp, faChevronCircleDown } from "@fortawesome/free-solid-svg-icons"
import { ICameraInteraction, WhiteBalance } from "../../core/camera"
import { WhiteBalanceOverride } from "../../core/config"
import { sleep } from "../../core/utils"
import CircleValueIndicator from "../util/CircleValueIndicator"

type WhiteBalanceControlProps = {
    whbValue: number
    disabled: boolean
    buttonVariant: string
    buttonGroupClassName?: string
    onChange: (change: number) => void
}

const WhiteBalanceControl = ({ whbValue, disabled, buttonVariant, buttonGroupClassName = "", onChange }: WhiteBalanceControlProps) => {
    const [value, setValue] = useState<number>(whbValue)

    useEffect(() => {
        setValue(whbValue)
    }, [whbValue])

    function onButtonClick(change: number) {
        setValue(v => (v ?? 0) + change)
        onChange(change)
    }

    return (
        <ButtonGroup className={buttonGroupClassName}>
            <Button variant={buttonVariant} className="border-end border-2 bg-gradient" disabled={disabled} onClick={() => onButtonClick(-1)}>
                <FontAwesomeIcon icon={faChevronCircleDown} />
            </Button>
            <CircleValueIndicator value={value} xOffset={34} yOffset={11} />
            <Button variant={buttonVariant} className="bg-gradient" disabled={disabled} onClick={() => onButtonClick(1)}>
                <FontAwesomeIcon icon={faChevronCircleUp} />
            </Button>
        </ButtonGroup>
    )
}

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

    if (!whiteBalance.changeAllowed) return (<div />)

    return (
        <>
            <div className="fst-italic" style={{fontSize: "12px"}}>Witbalans</div>
            <WhiteBalanceControl whbValue={whiteBalance.red}
                                 disabled={whbDisabled}
                                 buttonVariant="danger"
                                 buttonGroupClassName="me-2"
                                 onChange={c => cameraInteraction.changeWhiteBalanceLevelRed(c)} />
            <ButtonGroup className="me-2">
                <Button variant="secondary" className="bg-gradient" disabled={whbDisabled} onClick={() => onWhiteBalanceClick()}>
                    WB
                </Button>
            </ButtonGroup>
            <WhiteBalanceControl whbValue={whiteBalance.blue}
                                 disabled={whbDisabled}
                                 buttonVariant="primary"
                                 buttonGroupClassName="me-0"
                                 onChange={c => cameraInteraction.changeWhiteBalanceLevelBlue(c)} />
        </>
    )
}

export default CameraWhiteBalance

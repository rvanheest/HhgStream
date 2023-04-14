import React, { memo, useState } from "react"
import { Button, ButtonGroup } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronCircleUp, faChevronCircleDown } from "@fortawesome/free-solid-svg-icons"
import CircleValueIndicator from "../util/CircleValueIndicator"
import { useCurrentWhiteBalance } from "../../core/cameraStore"

type WhiteBalanceControlProps = {
    whbValue: number
    disabled: boolean
    buttonVariant: string
    buttonGroupClassName?: string
    onChange: (change: number) => void
}

const WhiteBalanceControl = memo(({ whbValue, disabled, buttonVariant, buttonGroupClassName = "", onChange }: WhiteBalanceControlProps) => {
    function onButtonClick(change: number) {
        onChange(change)
    }

    return (
        <ButtonGroup className={buttonGroupClassName}>
            <Button variant={buttonVariant} className="border-end border-2 bg-gradient" disabled={disabled} onClick={() => onButtonClick(-1)}>
                <FontAwesomeIcon icon={faChevronCircleDown} />
            </Button>
            <CircleValueIndicator value={whbValue} xOffset={34} yOffset={11} />
            <Button variant={buttonVariant} className="bg-gradient" disabled={disabled} onClick={() => onButtonClick(1)}>
                <FontAwesomeIcon icon={faChevronCircleUp} />
            </Button>
        </ButtonGroup>
    )
})

const CameraWhiteBalance = () => {
    const [whbDisabled, setWhbDisabled] = useState<boolean>(false)
    const { whiteBalance, correctWhiteBalance, setWhiteBalanceRed, setWhiteBalanceBlue } = useCurrentWhiteBalance()

    async function onWhiteBalanceClick() {
        setWhbDisabled(true)
        await correctWhiteBalance()
        setWhbDisabled(false)
    }

    if (!whiteBalance || !whiteBalance.changeAllowed) return (<div />)

    return (
        <>
            <div className="fst-italic" style={{fontSize: "12px"}}>Witbalans</div>
            <WhiteBalanceControl whbValue={whiteBalance.red}
                                 disabled={whbDisabled}
                                 buttonVariant="danger"
                                 buttonGroupClassName="me-2"
                                 onChange={setWhiteBalanceRed} />
            <ButtonGroup className="me-2">
                <Button variant="secondary" className="bg-gradient" disabled={whbDisabled} onClick={() => onWhiteBalanceClick()}>
                    WB
                </Button>
            </ButtonGroup>
            <WhiteBalanceControl whbValue={whiteBalance.blue}
                                 disabled={whbDisabled}
                                 buttonVariant="primary"
                                 buttonGroupClassName="me-0"
                                 onChange={setWhiteBalanceBlue} />
        </>
    )
}

export default CameraWhiteBalance

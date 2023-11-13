import React, { memo, useState } from "react"
import { Button, ButtonGroup } from "react-bootstrap"
import { useCurrentWhiteBalance } from "../../core/cameraStore"
import UpDownButtonGroup from "../util/UpDownButtonGroup"

const MemoedUpDownButtonGroup = memo(UpDownButtonGroup)

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
            <MemoedUpDownButtonGroup whbValue={whiteBalance.red}
                                     disabled={whbDisabled}
                                     buttonVariant="danger"
                                     onChange={setWhiteBalanceRed} />
            <ButtonGroup className="mx-2">
                <Button variant="secondary" className="bg-gradient" disabled={whbDisabled} onClick={() => onWhiteBalanceClick()}>
                    WB
                </Button>
            </ButtonGroup>
            <MemoedUpDownButtonGroup whbValue={whiteBalance.blue}
                                     disabled={whbDisabled}
                                     buttonVariant="primary"
                                     onChange={setWhiteBalanceBlue} />
        </>
    )
}

export default CameraWhiteBalance

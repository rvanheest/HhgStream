import React from "react"
import { faChevronCircleDown, faChevronCircleUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, ButtonGroup } from "react-bootstrap"
import styling from "./UpDownButtonGroup.module.css"
import CircleValueIndicator from "./CircleValueIndicator"

type UpDownButtonGroupProps = {
    whbValue: number
    disabled?: boolean
    buttonVariant: "primary" | "secondary" | "danger"
    onChange: (change: number) => void
}

const UpDownButtonGroup = ({ whbValue, disabled = false, buttonVariant, onChange }: UpDownButtonGroupProps) => (
    <ButtonGroup>
        <Button variant={buttonVariant} className={`bg-gradient ${styling.whiteRightBorder}`} disabled={disabled} onClick={() => onChange(-1)}>
            <FontAwesomeIcon icon={faChevronCircleDown}/>
        </Button>
        <CircleValueIndicator value={whbValue} xOffset={34} yOffset={11}/>
        <Button variant={buttonVariant} className="bg-gradient" disabled={disabled} onClick={() => onChange(1)}>
            <FontAwesomeIcon icon={faChevronCircleUp}/>
        </Button>
    </ButtonGroup>
)

export default UpDownButtonGroup

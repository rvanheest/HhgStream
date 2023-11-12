import React from "react"
import { useCurrentAeLevels } from "../../core/cameraStore"
import UpDownButtonGroup from "../util/UpDownButtonGroup"

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
            <UpDownButtonGroup whbValue={value} buttonVariant="secondary" onChange={onButtonClick} />
        </>
    )
}

export default CameraAeLevels

import React from "react"
import CameraManualControl from "./CameraManualControl"
import CameraPositionGroup from "./CameraPositionGroup"
import CardTabPane from "../util/CardTabPane";
import {useCamera} from "../../core/cameraStore";

const CameraPositionTabPane = () => {
    const { positionGroups: groups } = useCamera()
    const tabs = {
        "Besturing": () => <CameraManualControl />,
        ...groups.reduce((obj, group) => ({ ...obj, [group.title]: () => <CameraPositionGroup positions={group.positions} /> }), {})
    }

    return (
        <CardTabPane defaultOpen={groups[0].title} tabs={tabs} />
    )
}

export default CameraPositionTabPane

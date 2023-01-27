import React from "react"
import { ICameraInteraction } from "../../core/camera"
import { Position, PositionGroup } from "../../core/config"
import CameraManualControl from "./CameraManualControl"
import CameraPositionGroup from "./CameraPositionGroup"
import CardTabPane from "../util/CardTabPane";

type CameraPositionTabPaneProps = {
    cameraInteraction: ICameraInteraction
    groups: PositionGroup[]
    onPositionClick: (p: Position) => Promise<void>
}

const CameraPositionTabPane = ({ cameraInteraction, groups, onPositionClick }: CameraPositionTabPaneProps) => {
    const tabs = {
        "Besturing": () => <CameraManualControl cameraInteraction={cameraInteraction} onPositionClick={onPositionClick} />,
        ...groups.reduce((obj, group) => ({ ...obj, [group.title]: () => <CameraPositionGroup positions={group.positions} onPositionClick={onPositionClick} /> }), {})
    }

    return (
        <CardTabPane defaultOpen={groups[0].title} tabs={tabs} />
    )
}

export default CameraPositionTabPane

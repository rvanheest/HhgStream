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
    const tabs =[
        {
            title: "Besturing",
            element: <CameraManualControl cameraInteraction={cameraInteraction} onPositionClick={onPositionClick} />
        },
        ...groups.map(group => ({
            title: group.title,
            element: <CameraPositionGroup positions={group.positions} onPositionClick={onPositionClick} />
        }))
    ]

    return (
        <CardTabPane defaultOpenIndex={1} tabs={tabs} />
    )
}

export default CameraPositionTabPane

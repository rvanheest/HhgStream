import React, { useState } from "react"
import { Nav, Tab } from "react-bootstrap"
import { ICameraInteraction } from "../../core/camera"
import { Position, PositionGroup } from "../../core/config"
import CameraManualControl from "./CameraManualControl"
import CameraPositionGroup from "./CameraPositionGroup"

const manualControlKey = "manualControl"

type CameraPositionTabPaneProps = {
    cameraInteraction: ICameraInteraction
    groups: PositionGroup[]
    onPositionClick: (p: Position) => Promise<void>
}

const CameraPositionTabPane = ({ cameraInteraction, groups, onPositionClick }: CameraPositionTabPaneProps) => {
    const [selected, setSelected] = useState<string>(() => groups.length >= 1 ? `${groups[0].title}-0` : manualControlKey)

    return (
        <div className="card">
            <Tab.Container activeKey={selected} onSelect={e => !!e && e !== selected && setSelected(e)}>
                <div className="card-header" style={{padding: "5px 5px 0 5px"}}>
                    <Nav variant="tabs" style={{borderBottom: "none"}}>
                        <Nav.Item>
                            <Nav.Link eventKey={manualControlKey} style={{color: "#777"}}>Besturing</Nav.Link>
                        </Nav.Item>

                        {groups.map(({title}, index) => (
                            <Nav.Item key={`${title}-${index}`}>
                                <Nav.Link eventKey={`${title}-${index}`} style={{color: "#777"}}>{title}</Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </div>

                <Tab.Content>
                    <Tab.Pane eventKey={manualControlKey}>
                        <CameraManualControl cameraInteraction={cameraInteraction} onPositionClick={onPositionClick} />
                    </Tab.Pane>
                    {groups.map(({title, positions}, index) => (
                        <Tab.Pane key={`${title}-${index}`} eventKey={`${title}-${index}`}>
                            <CameraPositionGroup positions={positions} onPositionClick={onPositionClick} />
                        </Tab.Pane>
                    ))}
                </Tab.Content>
            </Tab.Container>
        </div>
    )
}

export default CameraPositionTabPane

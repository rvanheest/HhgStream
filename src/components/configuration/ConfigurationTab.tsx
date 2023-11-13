import React from "react"
import { Button, Col, Container, Row, ToggleButton } from "react-bootstrap"
import CameraConfiguration from "./CameraConfiguration"
import CardTabPane from "../util/CardTabPane"
import { useCameraConfigModeEnabled, useCamerasConfig, useSetCameraConfigModeEnabled } from "../../core/config"
import { getConfigPath, openFile } from "../../core/utils"

const ConfigurationTab = () => {
    const configMode = useCameraConfigModeEnabled()
    const setConfigMode = useSetCameraConfigModeEnabled()
    const camerasConfig = useCamerasConfig()
    const [tabs, tabHeaders] = camerasConfig.reduce(([ts, hs], c) => {
        const tab = ({ ...ts, [c.id]: () => <CameraConfiguration cameraId={c.id} /> })
        const tabHeader = ({ ...hs, [c.id]: () => <span>{c.title}</span>})

        return [tab, tabHeader]
    }, [{}, {}])

    return (
        <div className="border border-dark border-3 rounded-3 h-100">
            <Container fluid className="gx-0 d-flex flex-column h-100">
                <Row className="gx-0 align-items-center">
                    <Col sm={2} className="ps-1">
                        <ToggleButton id="configMode-checkbox"
                                      type="checkbox"
                                      variant={`${configMode ? 'success' : 'danger'}`}
                                      checked={configMode}
                                      value="0"
                                      onChange={e => setConfigMode(e.currentTarget.checked)}>
                            Configuratie modus
                        </ToggleButton>
                    </Col>
                    <Col sm={8}>
                        <h3 className="text-center my-1">Configuratie</h3>
                    </Col>
                    <Col sm={2} className="d-flex justify-content-end pe-1">
                        <Button onClick={async () => await openFile(getConfigPath())}>Open configuratie</Button>
                    </Col>
                </Row>
                <Row className="gx-0 h-100 flex-grow-1">
                    <Col sm={12} className="h-100">
                        <CardTabPane tabs={tabs} tabNavLink={tabHeaders} fillHeight={true} />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default ConfigurationTab

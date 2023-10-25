import React from "react"
import { Col, Container, Row } from 'react-bootstrap';
import CameraAeLevels from "./CameraAeLevels";
import CameraTitle from "./CameraTitle";
import CameraPositionTabPane from "./CameraPositionTabPane";
import CameraWhiteBalance from "./CameraWhiteBalance";
import CameraColorScheme from "./CameraColorScheme";
import ConfigButton from "./ConfigButton";
import { useCameraConfigModeEnabled } from "../../core/config";

const CameraComponent = () => {
    const configModeEnabled = useCameraConfigModeEnabled()

    return (
        <Container fluid>
            <Row className="text-center align-items-center py-1 position-relative">
                <Col sm={3} className="px-0">
                    <CameraTitle />
                </Col>
                <Col sm={2} className="px-0">
                    <CameraColorScheme />
                </Col>
                <Col sm={2} className="px-0">
                    <CameraAeLevels />
                </Col>
                <Col sm={5} className="px-0">
                    <CameraWhiteBalance />
                </Col>
                {
                    configModeEnabled
                        ? <div className="px-0 text-end position-absolute top-0 end-0" style={{ maxWidth: "fit-content" }}>
                              <ConfigButton />
                          </div>
                        : undefined
                }
            </Row>
            <Row className="pt-1">
                <Col className="px-0">
                    <CameraPositionTabPane />
                </Col>
            </Row>
        </Container>
    )
}

export default CameraComponent;

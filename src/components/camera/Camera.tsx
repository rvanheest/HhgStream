import React from "react"
import { Col, Container, Row } from 'react-bootstrap';
import CameraAeLevels from "./CameraAeLevels";
import CameraTitle from "./CameraTitle";
import CameraPositionTabPane from "./CameraPositionTabPane";
import CameraWhiteBalance from "./CameraWhiteBalance";
import CameraColorScheme from "./CameraColorScheme";

const CameraComponent = () => {
    return (
        <Container fluid>
            <Row className="text-center align-items-center py-1">
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

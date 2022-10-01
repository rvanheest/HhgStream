import React from "react"
import { Col, Nav, Row, Tab } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faVideoCamera, faGear, faFileLines } from "@fortawesome/free-solid-svg-icons"
import * as Electron from "electron"
import styles from "./TabPane.module.css"
import { getCameraInteraction } from "../core/camera";
import { AppConfig } from "../core/config";
import Camera from "./camera/Camera"
import WIP from "./configuration/WIP";

const { app: { isPackaged } }: typeof Electron = window.require('@electron/remote')

const tabs = {
    cameras: {
        link: <FontAwesomeIcon icon={faVideoCamera} />,
        body: ({cameras}: AppConfig) => (
            <Row>
                {cameras.map(camera => (
                    <Col key={camera.title} className="mx-2 px-1 py-1 border border-dark border-3 rounded-3 text-center">
                        <Camera camera={camera} cameraInteraction={getCameraInteraction(camera, !isPackaged)} />
                    </Col>
                ))}
            </Row>
        ),
    },
    text: {
        link: <FontAwesomeIcon icon={faFileLines} />,
        body: (config: AppConfig) => (
            <div className="text-center">
                <h3>WORK IN PROGRESS</h3>
                <p className="fst-italic">Hier kunnen de teksten worden ingesteld</p>
            </div>
        )
    },
    configuration: {
        link: <FontAwesomeIcon icon={faGear} />,
        body: (config: AppConfig) => <WIP config={config}/>,
    },
}

type TabPaneProps = {
    config: AppConfig
}

const TabPane = ({ config }: TabPaneProps) => (
    <Tab.Container defaultActiveKey={Object.keys(tabs)[0]}>
        <Row className="vh-100">
            <Col sm={1} className="pe-0 bg-dark">
                <Nav variant="pills" className="flex-column">
                    {Object.entries(tabs).map(([key, tab]) => (
                        <Nav.Item key={key} className={`text-center fs-2 ${styles.navItem}`}>
                            <Nav.Link eventKey={key} className="border-bottom">{tab.link}</Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
            </Col>
            <Col sm={11} className="bg-light">
                <Tab.Content>
                    {Object.entries(tabs).map(([key, tab]) => (
                        <Tab.Pane key={key} eventKey={key}>{tab.body(config)}</Tab.Pane>
                    ))}
                </Tab.Content>
            </Col>
        </Row>
    </Tab.Container>
)

export default TabPane;
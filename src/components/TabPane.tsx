import React from "react"
import { Col, Nav, Row, Tab } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faVideoCamera, faGear, faFileLines } from "@fortawesome/free-solid-svg-icons"
import styles from "./TabPane.module.css"
import { AppConfig } from "../core/config";
import Camera from "./camera/Camera"

const tabs = {
    cameras: {
        link: <FontAwesomeIcon icon={faVideoCamera} />,
        body: ({cameras}: AppConfig) => (
            <Row>
                {cameras.map(camera => (
                    <Col key={camera.title} className="mx-2 py-1 border border-dark border-3 rounded-4 text-center">
                        <Camera camera={camera} />
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
        body: (config: AppConfig) => (
            <div>
                <h3 className="text-center">WORK IN PROGRESS</h3>
                <p className="text-center fst-italic">Hier kan de configuratie worden ingesteld.</p>
                <pre className="mb-0" style={{maxHeight: "calc(100vh - 90px)"}}>{JSON.stringify(config, null, 2)}</pre>
            </div>
        ),
    },
}

type TabPaneProps = {
    config: AppConfig
}

const TabPane = ({ config }: TabPaneProps) => (
    <Tab.Container defaultActiveKey={Object.keys(tabs)[0]}>
        <Row>
            <Col sm={1}>
                <Nav variant="pills" className="flex-column">
                    {Object.entries(tabs).map(([key, tab]) => (
                        <Nav.Item key={key} className={`text-center fs-2 ${styles.navItem}`}>
                            <Nav.Link eventKey={key}>{tab.link}</Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
            </Col>
            <Col sm={11}>
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
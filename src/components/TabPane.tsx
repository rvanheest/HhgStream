import React from "react"
import { Col, Nav, Row, Tab } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faVideoCamera, faGear, faFileLines, IconDefinition } from "@fortawesome/free-solid-svg-icons"
import styles from "./TabPane.module.css"
import { AppConfig } from "../core/config";
import WIP from "./configuration/WIP";
import CameraTab from "./camera/CameraTab";

const camerasKey = "cameras"
const textKey = "text"
const configurationKey = "configuration"

type NavItemProps = {
    eventKey: string
    icon: IconDefinition
}

const NavItem = ({ eventKey: key, icon }: NavItemProps) => (
    <Nav.Item className={`text-center fs-2 ${styles.navItem}`}>
        <Nav.Link eventKey={key} className="border-bottom">
            <FontAwesomeIcon icon={icon} />
        </Nav.Link>
    </Nav.Item>
)

type TabPaneProps = {
    config: AppConfig
}

const TabPane = ({ config }: TabPaneProps) => (
    <Tab.Container defaultActiveKey={camerasKey}>
        <Row className="vh-100">
            <Col sm={1} className="pe-0 bg-dark">
                <Nav variant="pills" className="flex-column">
                    <NavItem eventKey={camerasKey} icon={faVideoCamera} />
                    <NavItem eventKey={textKey} icon={faFileLines} />
                    <NavItem eventKey={configurationKey} icon={faGear} />
                </Nav>
            </Col>
            <Col sm={11} className="bg-light">
                <Tab.Content>
                    <Tab.Pane eventKey={camerasKey}>
                        <CameraTab cameras={config.cameras} />
                    </Tab.Pane>
                    <Tab.Pane eventKey={textKey}>
                        <div className="text-center">
                            <h3>WORK IN PROGRESS</h3>
                            <p className="fst-italic">Hier kunnen de teksten worden ingesteld</p>
                        </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey={configurationKey}>
                        <WIP config={config}/>
                    </Tab.Pane>
                </Tab.Content>
            </Col>
        </Row>
    </Tab.Container>
)

export default TabPane;
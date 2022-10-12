import React, { useState } from "react"
import { Col, Row } from "react-bootstrap";
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
    icon: IconDefinition
    active?: boolean
    onClick: () => void
}

const NavItem = ({ icon, active, onClick }: NavItemProps) => (
    <div className={`text-center fs-2 ${styles.navItem}`}>
        <a className={`border-bottom ${active ? styles.active : ''}`} onClick={onClick}>
            <FontAwesomeIcon icon={icon} />
        </a>
    </div>
)

type TabPaneProps = {
    config: AppConfig
}

const TabPane = ({ config }: TabPaneProps) => {
    const [activeTab, setActiveTab] = useState<string>(camerasKey);

    function isActive(key: string): boolean {
        return activeTab === key;
    }

    function renderTab(): JSX.Element | undefined {
        switch (activeTab) {
            case camerasKey: return <CameraTab cameras={config.cameras} />
            case textKey: return (
                <div className="text-center">
                    <h3>WORK IN PROGRESS</h3>
                    <p className="fst-italic">Hier kunnen de teksten worden ingesteld</p>
                </div>
            )
            case configurationKey: return <WIP config={config} />
            default: return undefined
        }
    }

    return (
        <Row className="vh-100">
            <Col sm={1} className="pe-0 bg-dark">
                <div className="d-flex flex-column ps-0 m-0">
                    <NavItem icon={faVideoCamera} active={isActive(camerasKey)} onClick={() => setActiveTab(camerasKey)} />
                    <NavItem icon={faFileLines} active={isActive(textKey)} onClick={() => setActiveTab(textKey)} />
                    <NavItem icon={faGear} active={isActive(configurationKey)} onClick={() => setActiveTab(configurationKey)} />
                </div>
            </Col>
            <Col sm={11} className="bg-light">
                {renderTab()}
            </Col>
        </Row>
    )
}

export default TabPane;
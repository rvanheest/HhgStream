import React, {memo, useCallback, useState} from "react"
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
        <div className={`border-bottom ${active ? styles.active : ''}`} onClick={onClick}>
            <FontAwesomeIcon icon={icon} />
        </div>
    </div>
)

const MemoedNavItem = memo(NavItem)

type TabPaneProps = {
    config: AppConfig
}

const TabPane = ({ config }: TabPaneProps) => {
    const [activeTab, setActiveTab] = useState<string>(camerasKey);
    const cameraActiveOnClick = useCallback(() => setActiveTab(camerasKey), [])
    const textActiveOnClick = useCallback(() => setActiveTab(textKey), [])
    const configurationActiveOnClick = useCallback(() => setActiveTab(configurationKey), [])

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
                    <MemoedNavItem icon={faVideoCamera} active={isActive(camerasKey)} onClick={cameraActiveOnClick} />
                    <MemoedNavItem icon={faFileLines} active={isActive(textKey)} onClick={textActiveOnClick} />
                    <MemoedNavItem icon={faGear} active={isActive(configurationKey)} onClick={configurationActiveOnClick} />
                </div>
            </Col>
            <Col sm={11} className="bg-light">
                {renderTab()}
            </Col>
        </Row>
    )
}

export default TabPane;
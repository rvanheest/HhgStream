import React, {memo, useCallback, useState} from "react"
import { Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faVideoCamera, faGear, faFileLines, IconDefinition } from "@fortawesome/free-solid-svg-icons"
import styles from "./TabPane.module.css"
import WIP from "./configuration/WIP";
import CameraTab from "./camera/CameraTab";
import TextTab from "./text/TextTab";
import LoadTextStore from "./text/LoadTextStore"

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

const TabPane = () => {
    const [activeTab, setActiveTab] = useState<string>(camerasKey);
    const cameraActiveOnClick = useCallback(() => setActiveTab(camerasKey), [])
    const textActiveOnClick = useCallback(() => setActiveTab(textKey), [])
    const configurationActiveOnClick = useCallback(() => setActiveTab(configurationKey), [])

    function isActive(key: string): boolean {
        return activeTab === key;
    }

    function renderTab(): JSX.Element | undefined {
        switch (activeTab) {
            case camerasKey: return <CameraTab />
            case textKey: return <LoadTextStore><TextTab /></LoadTextStore>
            case configurationKey: return <WIP />
            default: return undefined
        }
    }

    return (
        <Container fluid className="ps-0">
            <Row className="vh-100">
                <Col sm={1} className="pe-0 bg-dark">
                    <div className={`position-fixed ${styles.navItems}`}>
                        <MemoedNavItem icon={faVideoCamera} active={isActive(camerasKey)} onClick={cameraActiveOnClick} />
                        <MemoedNavItem icon={faFileLines} active={isActive(textKey)} onClick={textActiveOnClick} />
                        <MemoedNavItem icon={faGear} active={isActive(configurationKey)} onClick={configurationActiveOnClick} />
                    </div>
                </Col>
                <Col sm={11} className="gx-3 bg-light py-2">
                    {renderTab()}
                </Col>
            </Row>
        </Container>
    )
}

export default TabPane;

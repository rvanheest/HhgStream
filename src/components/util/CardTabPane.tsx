import React, { useState } from "react"
import styling from "./CardTabPane.module.css"
import { Nav, Tab } from "react-bootstrap";

type TabPaneProps = {
    tabs: {
        title: string
        element: JSX.Element
    }[]
    defaultOpenIndex: number
}

const CardTabPane = ({ tabs, defaultOpenIndex }: TabPaneProps) => {
    const [selected, setSelected] = useState<string>(`${tabs[defaultOpenIndex].title}-${defaultOpenIndex}`)

    return (
        <div className={`border-0 rounded-bottom rounded-3 bg-light ${styling.card} card`}>
            <Tab.Container activeKey={selected} onSelect={e => !!e && e !== selected && setSelected(e)}>
                <div className={`px-1 pt-1 pb-0 ${styling.cardHeader} card-header`}>
                    <Nav variant="tabs" className={`${styling.cardNav} border-bottom-0`}>
                        {tabs.map(({title}, index) => (
                            <Nav.Item key={`${title}-${index}`}>
                                <Nav.Link eventKey={`${title}-${index}`} className={styling.cardNavLink}>{title}</Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </div>

                <Tab.Content className="pt-1">
                    {tabs.map(({title, element}, index) => (
                        <Tab.Pane key={`${title}-${index}`} eventKey={`${title}-${index}`}>
                            {element}
                        </Tab.Pane>
                    ))}
                </Tab.Content>
            </Tab.Container>
        </div>
    )
}

export default CardTabPane

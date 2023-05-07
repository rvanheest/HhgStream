import React, { useState } from "react"
import styling from "./CardTabPane.module.css"
import { Nav, Tab } from "react-bootstrap";

type TabPaneProps = {
    tabs: { [title: string]: () => JSX.Element }
    defaultOpen: string
    onSelectTab?: ((title: string) => void) | undefined
}

const CardTabPane = ({ tabs, defaultOpen, onSelectTab }: TabPaneProps) => {
    const [selected, setSelected] = useState<string>(defaultOpen)

    function onSelect(newSelected: string | null) {
        if (!!newSelected && newSelected !== selected) {
            setSelected(newSelected)
            onSelectTab && onSelectTab(newSelected)
        }
    }

    return (
        <div className={`border-0 rounded-bottom rounded-3 bg-light ${styling.card} card`}>
            <Tab.Container activeKey={selected} onSelect={onSelect}>
                <div className={`px-1 pt-1 pb-0 ${styling.cardHeader} card-header`}>
                    <Nav variant="tabs" className={`${styling.cardNav} border-bottom-0`}>
                        {Object.keys(tabs).map(title => (
                            <Nav.Item key={title}>
                                <Nav.Link eventKey={title} className={styling.cardNavLink}>{title}</Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </div>

                <Tab.Content>
                    {Object.entries(tabs).map(([title, Element]) => (
                        <Tab.Pane key={title} eventKey={title}>
                            <Element />
                        </Tab.Pane>
                    ))}
                </Tab.Content>>
            </Tab.Container>
        </div>
    )
}

export default CardTabPane

import React, { useEffect, useState } from "react"
import styling from "./CardTabPane.module.css"
import { Nav, Tab } from "react-bootstrap";

type TabPaneProps = {
    tabs: {
        title: string
        element: JSX.Element
    }[]
    defaultOpenIndex: number
    onSelectTab?: ((index: number) => void) | undefined
}

const CardTabPane = ({ tabs, defaultOpenIndex, onSelectTab }: TabPaneProps) => {
    const openIndex = Math.max(0, Math.min(tabs.length - 1, defaultOpenIndex))
    const [selected, setSelected] = useState<string>(tabName(openIndex))

    useEffect(() => {
        if (onSelectTab) {
            const tabIndex = tabs.findIndex(tab => selected.startsWith(tab.title))
            if (tabIndex !== -1) onSelectTab(tabIndex)
        }
    }, [selected, onSelectTab, tabs])

    function tabName(index: number) {
        return `${tabs[index].title}-${index}`
    }

    return (
        <div className={`border-0 rounded-bottom rounded-3 bg-light ${styling.card} card`}>
            <Tab.Container activeKey={selected} onSelect={e => !!e && e !== selected && setSelected(e)}>
                <div className={`px-1 pt-1 pb-0 ${styling.cardHeader} card-header`}>
                    <Nav variant="tabs" className={`${styling.cardNav} border-bottom-0`}>
                        {tabs.map(({title}, index) => (
                            <Nav.Item key={tabName(index)}>
                                <Nav.Link eventKey={tabName(index)} className={styling.cardNavLink}>{title}</Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </div>

                <Tab.Content className="pt-1">
                    {tabs.map(({element}, index) => (
                        <Tab.Pane key={tabName(index)} eventKey={tabName(index)}>
                            {element}
                        </Tab.Pane>
                    ))}
                </Tab.Content>
            </Tab.Container>
        </div>
    )
}

export default CardTabPane

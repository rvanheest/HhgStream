import React, { ForwardedRef, forwardRef, useCallback, useImperativeHandle, useState } from "react"
import styling from "./CardTabPane.module.css"
import { Nav, Tab } from "react-bootstrap"

type TabPaneProps = {
    tabs: { [title: string]: () => JSX.Element }
    tabNavLink?: { [title: string]: () => JSX.Element } | undefined
    defaultOpen: string
    fillHeight?: boolean
    onSelectTab?: ((title: string) => void) | undefined
    rightAlignElement?: () => JSX.Element | undefined
}

export type TabPaneRef = {
    getSelectedTab: () => string,
    setSelectedTab: (tab: string | null) => void,
}

const CardTabPane = forwardRef(({ tabs, tabNavLink, defaultOpen, fillHeight, onSelectTab, rightAlignElement }: TabPaneProps, _ref: ForwardedRef<TabPaneRef>) => {
    const [selected, setSelected] = useState<string>(defaultOpen)
    const fillHeightCss = fillHeight ? 'h-100' : ''

    function onSelect(newSelected: string | null) {
        if (!!newSelected && newSelected !== selected) {
            setSelected(newSelected)
            onSelectTab && onSelectTab(newSelected)
        }
    }
    const onSelectCallback = useCallback(onSelect, [onSelectTab, selected])

    useImperativeHandle(_ref, () => ({
        getSelectedTab: () => selected,
        setSelectedTab: (tab: string | null) => onSelectCallback(tab),
    }), [onSelectCallback, selected])

    return (
        <div className={`border-0 rounded-bottom rounded-3 bg-light ${styling.card} card ${fillHeightCss}`}>
            <Tab.Container activeKey={selected} onSelect={onSelectCallback}>
                <div className={`px-1 pt-1 pb-0 ${styling.cardHeader} card-header`}>
                    <Nav variant="tabs" className={`${styling.cardNav} border-bottom-0`}>
                        {Object.keys(tabs).map(title => {
                            const TitleElement = (tabNavLink && tabNavLink[title]) ?? (() => <span>{title}</span>)
                            return(
                                <Nav.Item key={title}>
                                    <Nav.Link eventKey={title} className={styling.cardNavLink}>
                                        <TitleElement />
                                    </Nav.Link>
                                </Nav.Item>
                            )
                        })}
                        {rightAlignElement && <Nav.Item className="ms-auto">
                            {rightAlignElement()}
                        </Nav.Item>}
                    </Nav>
                </div>

                <Tab.Content className={`${fillHeightCss}`}>
                    {Object.entries(tabs).map(([title, Element]) => (
                        <Tab.Pane key={title} eventKey={title} className={`${fillHeightCss}`}>
                            <Element />
                        </Tab.Pane>
                    ))}
                </Tab.Content>
            </Tab.Container>
        </div>
    )
})

export default CardTabPane

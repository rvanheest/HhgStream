import React, { ForwardedRef, JSX, forwardRef, useCallback, useImperativeHandle, useState } from "react"
import styling from "./CardTabPane.module.css"
import { Button, Nav, Tab } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

type TabPaneProps = {
    tabs: { [id: string]: () => JSX.Element }
    tabNavLink?: { [id: string]: () => JSX.Element } | undefined
    defaultOpen?: string | undefined
    fillHeight?: boolean
    onSelectTab?: ((id: string) => void) | undefined
    onAddNewTab?: (() => void) | undefined
}

export type TabPaneRef = {
    getSelectedTab: () => string,
    setSelectedTab: (tab: string | null) => void,
}

const CardTabPane = forwardRef(({ tabs, tabNavLink, defaultOpen, fillHeight, onSelectTab, onAddNewTab }: TabPaneProps, _ref: ForwardedRef<TabPaneRef>) => {
    const [selected, setSelected] = useState<string>(defaultOpen ?? Object.keys(tabs).find(() => true) ?? "")
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
                        {Object.keys(tabs).map(id => {
                            const TitleElement = (tabNavLink && tabNavLink[id]) ?? (() => <div className="p-2">{id}</div>)
                            return(
                                <Nav.Item key={id}>
                                    <Nav.Link eventKey={id} className={`p-0 ${styling.cardNavLink}`}>
                                        <TitleElement />
                                    </Nav.Link>
                                </Nav.Item>
                            )
                        })}
                        {!!onAddNewTab
                         ? <Nav.Item>
                            <Nav.Link as={Button}
                                      className={`ms-2 px-2 py-2 btn btn-light ${styling.cardNavLink} ${styling.addButton}`}
                                      onClick={onAddNewTab}>
                                <FontAwesomeIcon icon={faPlus} />
                            </Nav.Link>
                        </Nav.Item>
                        : undefined }
                    </Nav>
                </div>

                <Tab.Content className={`${fillHeightCss}`}>
                    {Object.entries(tabs).map(([id, Element]) => (
                        <Tab.Pane key={id} eventKey={id} className={`${fillHeightCss}`}>
                            <Element />
                        </Tab.Pane>
                    ))}
                </Tab.Content>
            </Tab.Container>
        </div>
    )
})

export default CardTabPane

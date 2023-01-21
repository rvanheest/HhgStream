import React from "react"
import { Button } from "react-bootstrap";
import { useSetLastOpenedTextTab, useTextStoreLastOpenedTab, useTextStorePath } from "../../core/config"
import { openFile } from "../../core/utils";
import CardTabPane from "../util/CardTabPane"
import KerkdienstTeksten from "./KerkdienstTeksten";
import BijbellezingTeksten from "./BijbellezingTeksten";
import CursusGeestelijkeVormingTeksten from "./CursusGeestelijkeVormingTeksten";
import RouwdienstTeksten from "./RouwdienstTeksten";
import TrouwdienstTeksten from "./TrouwdienstTeksten";

const TextTab = () => {
    const textStorePath = useTextStorePath()
    const lastOpenedTab = useTextStoreLastOpenedTab()
    const setLastOpenedTextTab = useSetLastOpenedTextTab()

    function saveSelectedTab(index: number): void {
        if (lastOpenedTab !== index) { // if we update always, we get infinite render recursion
            setLastOpenedTextTab(index)
        }
    }

    const tabs = [
        {
            title: "Kerkdienst",
            element: <KerkdienstTeksten />
        },
        {
            title: "Bijbellezing",
            element: <BijbellezingTeksten />
        },
        {
            title: "Cursus Geestelijke Vorming",
            element: <CursusGeestelijkeVormingTeksten />
        },
        {
            title: "Huwelijksdienst",
            element: <TrouwdienstTeksten />
        },
        {
            title: "Begrafenisdienst",
            element: <RouwdienstTeksten />
        }
    ]

    return (
        <div className="border border-dark border-3 rounded-3 overflow-hidden">
            <div className="d-flex justify-content-center position-relative">
                <h3>Teksten</h3>
                <Button className="position-absolute translate-middle-y top-50 end-0" onClick={async () => await openFile(textStorePath)}>Open JSON</Button>
            </div>
            <CardTabPane tabs={tabs} defaultOpenIndex={lastOpenedTab} onSelectTab={saveSelectedTab} />
        </div>
    )
}

export default TextTab

import React, { useState } from "react"
import { Button } from "react-bootstrap";
import { loadTextStore, saveTextStore, TextStore, TextStoreError } from "../../core/text";
import { openFile } from "../../core/utils";
import CardTabPane from "../util/CardTabPane"
import KerkdienstTeksten from "./KerkdienstTeksten";
import BijbellezingTeksten from "./BijbellezingTeksten";
import CursusGeestelijkeVormingTeksten from "./CursusGeestelijkeVormingTeksten";
import TextErrorPage from "./TextErrorPage";
import { TextsConfig } from "../../core/config";

const WIP = () => (
    <div className="text-center">
        <h3>WORK IN PROGRESS</h3>
        <p className="fst-italic">Hier kunnen de teksten worden ingesteld</p>
    </div>
)

type TextTabProps = {
    config: TextsConfig
    updateConfig: (c: TextsConfig) => void
}

const TextTab = ({ config, updateConfig }: TextTabProps) => {
    const [textStore, setTextStore] = useState<TextStore | TextStoreError>(loadTextStore(config.textsPath))

    if (!textStore) {
        return (<div>Loading...</div>)
    }

    if (textStore.isError) {
        return (<TextErrorPage error={textStore} />)
    }

    function saveTexts(partialTextStore: Partial<TextStore>): void {
        if (!textStore.isError) {
            const newTextStore = { ...textStore, ...partialTextStore }
            setTextStore(newTextStore)
            saveTextStore(newTextStore, config.textsPath)
        }
    }

    function saveSelectedTab(index: number): void {
        if (config.lastOpenedTab !== index) {
            updateConfig({ ...config, lastOpenedTab: index })
        }
    }

    const tabs = [
        {
            title: "Kerkdienst",
            element: <KerkdienstTeksten teksten={textStore.kerkdienst}
                                        tekstTemplate={config.templates.find(t => t.name === 'kerkdienst')}
                                        saveTeksten={teksten => saveTexts({ kerkdienst: teksten })} />
        },
        {
            title: "Bijbellezing",
            element: <BijbellezingTeksten teksten={textStore.bijbellezing}
                                          tekstTemplate={config.templates.find(t => t.name === 'bijbellezing')}
                                          saveTeksten={teksten => saveTexts({ bijbellezing: teksten})} />
        },
        {
            title: "Cursus Geestelijke Vorming",
            element: <CursusGeestelijkeVormingTeksten teksten={textStore.cursusGeestelijkeVorming}
                                                      tekstTemplate={config.templates.find(t => t.name === 'cursus geestelijke vorming')}
                                                      saveTeksten={teksten => saveTexts({ cursusGeestelijkeVorming: teksten})} />
        },
        {
            title: "Huwelijksdienst",
            element: <WIP />
        },
        {
            title: "Begrafenisdienst",
            element: <WIP />
        }
    ]

    return (
        <div className="border border-dark border-3 rounded-3 overflow-hidden">
            <div className="d-flex justify-content-center position-relative">
                <h3>Teksten</h3>
                <Button className="position-absolute translate-middle-y top-50 end-0" onClick={async () => await openFile(config.textsPath)}>Open JSON</Button>
            </div>
            <CardTabPane tabs={tabs} defaultOpenIndex={config.lastOpenedTab} onSelectTab={saveSelectedTab} />
        </div>
    )
}

export default TextTab

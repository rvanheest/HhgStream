import React from "react"
import { Button, Col, Container, Row } from "react-bootstrap";
import { useSetLastOpenedTextTab, useTextStoreLastOpenedTab, useTextStorePath } from "../../core/config"
import { openFile } from "../../core/utils";
import CardTabPane from "../util/CardTabPane"
import KerkdienstTeksten from "./KerkdienstTeksten";
import BezinningsmomentTeksten from "./Bezinningsmoment";
import BijbellezingTeksten from "./BijbellezingTeksten";
import CursusGeestelijkeVormingTeksten from "./CursusGeestelijkeVormingTeksten";
import RouwdienstTeksten from "./RouwdienstTeksten";
import TrouwdienstTeksten from "./TrouwdienstTeksten";
import LoadTextStore from "./LoadTextStore";

const tabs = {
    "Kerkdienst": KerkdienstTeksten,
    "Bijbellezing": BijbellezingTeksten,
    "Cursus Geestelijke Vorming": CursusGeestelijkeVormingTeksten,
    "Huwelijksdienst": TrouwdienstTeksten,
    "Begrafenisdienst": RouwdienstTeksten,
    "Bezinningsmoment": BezinningsmomentTeksten,
}
const tabsKeys = Object.keys(tabs)

function isNumber(o: unknown): o is Number {
    return typeof o === "number"
}

const TextTab = () => {
    const textStorePath = useTextStorePath()
    const lastOpenedTab = useTextStoreLastOpenedTab()
    const lastOpenedTabString = isNumber(lastOpenedTab) ? tabsKeys[lastOpenedTab] : lastOpenedTab
    const setLastOpenedTextTab = useSetLastOpenedTextTab()

    return (
        <LoadTextStore>
            <div className="border border-dark border-3 rounded-3 h-100">
                <Container fluid className="gx-0 d-flex flex-column h-100">
                    <Row className="gx-0">
                        <Col sm={12} className="position-relative">
                            <h3 className="text-center">Teksten</h3>
                            <Button className="position-absolute translate-middle-y top-50 end-0 me-1" onClick={async () => await openFile(textStorePath)}>Open JSON</Button>
                        </Col>
                    </Row>
                    <Row className="gx-0 h-100 flex-grow-1">
                        <Col sm={12} className="h-100">
                            <CardTabPane tabs={tabs} defaultOpen={lastOpenedTabString} onSelectTab={setLastOpenedTextTab} fillHeight={true} />
                        </Col>
                    </Row>
                </Container>
            </div>
        </LoadTextStore>
    )
}

export default TextTab

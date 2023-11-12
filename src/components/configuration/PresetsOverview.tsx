import React from "react"
import NewPreset from "./NewPreset"
import ExistingPreset from "./ExistingPreset"
import { usePresets } from "../../core/config"
import { Col, Row } from "react-bootstrap"

export type PresetsProps = {
    cameraId: string
}

const PresetsOverview = ({ cameraId }: PresetsProps) => {
    const presets = usePresets(cameraId)
    const usedIndexes = new Set(presets.map(p => p.index))
    const availableIndexes = [...Array(100).keys()].map(i => i + 1).filter(i => !usedIndexes.has(i))

    return (
        <>
            <Row>
                <Col sm={{span: 1, offset: 3}}>
                    <h5>Presets</h5>
                </Col>
            </Row>
            <NewPreset cameraId={cameraId} possibleIndexes={availableIndexes} />
            {presets.map(preset => (<ExistingPreset key={`preset-${preset.index}`} cameraId={cameraId} preset={preset} />))}
        </>
    )
}

export default PresetsOverview

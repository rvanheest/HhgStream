import React from "react"
import { Container } from "react-bootstrap"
import PresetsOverview from "./PresetsOverview"
import EditCameraSettings from "./EditCameraSettings"

type CameraConfigurationProps = {
    cameraId: string
}

const CameraConfiguration = ({ cameraId }: CameraConfigurationProps) => {
    return (
        <div className="overflow-auto position-relative h-100">
            <Container fluid className="gx-0 position-absolute w-100 overflow-hidden pt-2">
                <EditCameraSettings cameraId={cameraId} className="mb-2" />
                <PresetsOverview cameraId={cameraId} />
            </Container>
        </div>
    )
}

export default CameraConfiguration

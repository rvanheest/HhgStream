import React from "react"
import { useCameraTitle } from "../../core/cameraStore"

const CameraTitle = () => {
    const { title, baseUrl } = useCameraTitle()

    return (
        <div className="ms-1 me-1">
            <h1 className="m-0 mb-1 fs-4" style={{ paddingTop: 0.8, paddingBottom: 0.8 }}>{title}</h1>
            <div className="fst-italic" style={{ fontSize: 12, paddingTop: 0.8, paddingBottom: 0.8 }}>{baseUrl}</div>
        </div>
    )
}

export default CameraTitle

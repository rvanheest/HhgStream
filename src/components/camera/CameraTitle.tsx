import React from "react"
import { useCamera, useCameraPositionTitle } from "../../core/cameraStore"

const CameraTitle = () => {
    const camera = useCamera()
    const latestPosition = useCameraPositionTitle()

    return (
        <>
            <h1 className="m-0 fs-4">{camera.title}</h1>
            <div className="fst-italic" style={{ fontSize: 12 }}>{camera.baseUrl}</div>
            <div>
                <span className="fw-bold fs-6">Huidig: </span>
                <span className="fw-normal fst-italic">{latestPosition ?? "Onbekend"}</span>
            </div>
        </>
    )
}

export default CameraTitle

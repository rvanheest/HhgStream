import React from "react"
import { useCamera } from "../../core/cameraStore"

const CameraTitle = () => {
    const camera = useCamera()

    return (
        <>
            <h1 className="m-0 fs-4">{camera.title}</h1>
            <div className="fst-italic" style={{ fontSize: 12 }}>{camera.baseUrl}</div>
        </>
    )
}

export default CameraTitle

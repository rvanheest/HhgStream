import React from "react"
import { useCameraTitle } from "../../core/cameraStore"

const CameraTitle = () => {
    const { title, baseUrl } = useCameraTitle()

    return (
        <>
            <h1 className="m-0 fs-4">{title}</h1>
            <div className="fst-italic" style={{ fontSize: 12 }}>{baseUrl}</div>
        </>
    )
}

export default CameraTitle

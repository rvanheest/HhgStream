import React from "react"

type CameraTitleProps = {
    title: string
    baseUrl: string
    latestPosition: string | undefined
}

const CameraTitle = ({ title, baseUrl, latestPosition }: CameraTitleProps) => {
    return (
        <>
            <h1 className="m-0 fs-4">{title}</h1>
            <div className="fst-italic" style={{ fontSize: 12 }}>{baseUrl}</div>
            <div>
                <span className="fw-bold fs-6">Huidig: </span>
                <span className="fw-normal fst-italic">{latestPosition ?? "Onbekend"}</span>
            </div>
        </>
    )
}

export default CameraTitle

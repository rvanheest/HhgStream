import { Camera, Position } from "./config";

export async function moveCamera(camera: Camera, position: Position) {
    console.log(`move camera ${camera.title} to position ${position.title}`)

    const body = {
        Request: {
            Command: 'SetPTZPreset',
            SessionID: camera.sessionId,
            Params: {
                No: position.index,
                Operation: 'Move'
            }
        }
    };

    const response = await fetch(
        `${camera.baseUrl}/cgi-bin/cmd.cgi`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }
    )

    if (response.status === 200) {
        console.log(`moved camera ${camera.title} to position ${position.title}`, response)
    }
    else {
        console.error(`moving camera ${camera.title} to position ${position.title} failed`, response)
    }
}
import React from "react";
import { Button } from "react-bootstrap";
import { ColorScheme } from "../../core/camera";
import { useCurrentColorScheme } from "../../core/cameraStore";

function getNextColorScheme(scheme: ColorScheme): ColorScheme {
    switch (scheme) {
        case 'Awb': return 'Faw'
        case 'Faw': return 'Awb'
        default: throw new Error(`unknown scheme type: ${scheme}`)
    }
}

function getColorSchemaName(scheme: ColorScheme): string {
    switch (scheme) {
        case "Awb": return "Handmatig"
        case "Faw": return "Automatisch"
        default: throw new Error(`unknown scheme type: ${scheme}`)
    }
}

const CameraColorScheme = () => {
    const [colorScheme, setColorScheme] = useCurrentColorScheme()
    
    async function onColorSchemeClick(scheme: ColorScheme) {
        const nextColorScheme = getNextColorScheme(scheme)
        await setColorScheme(nextColorScheme)
    }
    
    if (!colorScheme) return (<div />)
    
    return (
        <>
            <div className="fst-italic" style={{ fontSize: "12px" }}>Kleur schema</div>
            <Button variant="secondary" className="bg-gradient" onClick={() => onColorSchemeClick(colorScheme)}>
                {getColorSchemaName(colorScheme)}
            </Button>
        </>
    )
}

export default CameraColorScheme

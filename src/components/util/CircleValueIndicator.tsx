import React from "react"
import styling from "./CircleValueIndicator.module.css"

type CircleValueIndicatorProps = {
    value: number
    diameter?: number
    borderRadius?: number
    xOffset: number
    yOffset: number
}

const CircleValueIndicator = ({ value, xOffset, yOffset, diameter = 17, borderRadius = 8 }: CircleValueIndicatorProps) => {
    return (
        <div className={`${styling.value}`}
             style={{
                width: diameter,
                height: diameter,
                borderRadius: borderRadius,
                top: yOffset,
                left: xOffset,
             }}>
            {value}
        </div>
    )
}

export default CircleValueIndicator
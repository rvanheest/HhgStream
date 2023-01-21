import React, { ReactNode } from "react"
import ConfigErrorPage from "./ConfigErrorPage"
import { useLoadConfig } from "../core/config"

type LoadConfigProps = {
    children: ReactNode
}

const LoadConfig = ({ children }: LoadConfigProps) => {
    const { loaded, error } = useLoadConfig()

    if (!loaded) return <div>Loading...</div>
    if (error) return <ConfigErrorPage error={error} />
    return <>{children}</>
}

export default LoadConfig

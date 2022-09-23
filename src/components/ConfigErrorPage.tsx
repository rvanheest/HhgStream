import React from "react"
import { ConfigError as ConfigErrorInput } from "../config"

type ConfigErrorProps = {
    error: ConfigErrorInput
}

const ConfigErrorPage = ({error: { message, error }}: ConfigErrorProps) => (
    <div className="container-fluid p-4">
        <h1>ERROR!!!</h1>
        <p>{message}</p>
        {error ? <pre>{error}</pre> : undefined}
    </div>
)

export default ConfigErrorPage;
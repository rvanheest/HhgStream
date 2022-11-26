import React, { useEffect, useState } from "react"
import ConfigErrorPage from "./ConfigErrorPage"
import { AppConfig, ConfigError, loadConfig } from "../core/config"
import TabPane from "./TabPane"

const App = () => {
  const [config, setConfig] = useState<AppConfig | ConfigError>()

  useEffect(() => {
    const c = loadConfig()
    setConfig(c)
  }, [])

  if (!config) {
    return (<div>Loading...</div>)
  }

  if (config.isError) {
    return (<ConfigErrorPage error={config} />)
  }

  return (<TabPane config={config} />)
}

export default App

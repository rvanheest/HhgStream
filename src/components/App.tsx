import React, { useState } from "react"
import ConfigErrorPage from "./ConfigErrorPage"
import { AppConfig, ConfigError, loadConfig, saveConfig } from "../core/config"
import TabPane from "./TabPane"

const App = () => {
  const [config, setConfig] = useState<AppConfig | ConfigError>(loadConfig())

  if (!config) {
    return (<div>Loading...</div>)
  }

  if (config.isError) {
    return (<ConfigErrorPage error={config} />)
  }

  function updateConfig(partialConfig: Partial<AppConfig>): void {
    if (!config.isError) {
      const newConfig = { ...config, ...partialConfig }
      setConfig(newConfig)
      saveConfig(newConfig)
    }
  }

  return <TabPane config={config} updateConfig={updateConfig} />
}

export default App

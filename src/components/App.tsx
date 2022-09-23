import React from "react"
import { getConfig } from "../config"
import ConfigErrorPage from "./ConfigErrorPage"

const App = () => {
  const config = getConfig()
  if (config.isError) {
    return (<ConfigErrorPage error={config} />)
  }

  const configString = JSON.stringify(config, null, 2)

  return (
    <div className="container-fluid p-4">
      <h1>Camera bedieninig!!!</h1>
      <pre>{configString}</pre>
    </div>
  )
}

export default App

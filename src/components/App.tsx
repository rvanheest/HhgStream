import React from "react"
import Camera from "./Camera"
import ConfigErrorPage from "./ConfigErrorPage"
import { getConfig } from "../core/config"

const App = () => {
  const config = getConfig()
  if (config.isError) {
    return (<ConfigErrorPage error={config} />)
  }

  return (
    <div className="container-fluid p-4">
      <div className="row gx-6">
        {config.cameras.map(camera => (
          <div className="col">
            <Camera camera={camera} key={camera.title} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default App

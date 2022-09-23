import React, { useMemo, useState } from "react"
import FilesViewer, { File } from "./FilesViewer"

const { app } = window.require('@electron/remote')
const fs = window.require('fs')
const pathModule = window.require('path')

function formatSize(size: number): string {
  var i = Math.floor(Math.log(size) / Math.log(1024))
  return (
    (size / Math.pow(1024, i)).toFixed(2) +
    ' ' +
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  )
}

function listFiles(path: string) : File[] {
  return fs.readdirSync(path)
    .map(file => {
      const stats = fs.statSync(pathModule.join(path, file))
      return {
        name: file,
        size: stats.isFile() ? formatSize(stats.size ?? 0) : null,
        directory: stats.isDirectory(),
      }
    })
    .sort((a, b) => {
      if (a.directory === b.directory) {
        return a.name.localeCompare(b.name)
      }
      return a.directory ? -1 : 1
    })
}

const App = () => {
  const [path, setPath] = useState<string>(app.getAppPath())

  const files = useMemo(() => listFiles(path), [path])

  const onBack = () => setPath(pathModule.dirname(path))
  const onOpen = (folder: string) => setPath(pathModule.join(path, folder))

  const [searchString, setSearchString] = useState<string>('')
  const filteredFiles = files.filter(s => s.name.startsWith(searchString))

  return (
    <div className="container mt-2">
      <h4>{path}</h4>
      <div className="form-group mt-4 mb-2">
        <input
          value={searchString}
          onChange={event => setSearchString(event.target.value)}
          className="form-control form-control-sm"
          placeholder="File search"
        />
      </div>
      <FilesViewer files={filteredFiles} onBack={onBack} onOpen={onOpen} />
    </div>
  )
}

export default App

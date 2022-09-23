import React from 'react'
import { IconFile, IconFolderOpen, IconFolder } from "./icons"

export type File = {
    name: string
    directory: boolean
    size: string | null
}
type FilesViewerInput = {
    files: File[]
    onBack: () => void
    onOpen: (name: string) => void
}

const FilesViewer = ({files, onBack, onOpen}: FilesViewerInput) => (
    <table className="table">
        <tbody>
            <tr className="clickable" onClick={onBack}>
                <td className="icon-row">
                    <IconFolderOpen/>
                </td>
                <td>...</td>
                <td></td>
            </tr>
            {files.map(({name, directory, size}) => (
                <tr key={`${name}-${directory}`} className="clickable" onClick={() => directory && onOpen(name)}>
                    <td className="icon-row">{directory ? <IconFolder/> : <IconFile/>}</td>
                    <td>{name}</td>
                    <td>
                        <span className="float-end">{size}</span>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
)

export default FilesViewer
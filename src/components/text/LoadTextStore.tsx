import React, { ReactNode } from "react"
import { useLoadTextStore } from "../../core/text"
import TextErrorPage from "./TextErrorPage"

type LoadTextStoreProps = {
    children: ReactNode
}

const LoadTextStore = ({ children }: LoadTextStoreProps) => {
    const { loaded, error } = useLoadTextStore()

    if (!loaded) return <div>Loading...</div>
    if (error) return <TextErrorPage error={error} />
    return <>{children}</>
}

export default LoadTextStore

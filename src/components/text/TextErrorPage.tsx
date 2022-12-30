import React from "react"
import {TextStoreError} from "../../core/text";

type TextErrorProps = {
    error: TextStoreError
}

const TextErrorPage = ({error: { message, error }}: TextErrorProps) => (
    <div className="container-fluid p-4">
        <h1>ERROR!!!</h1>
        <p>{message}</p>
        {error ? <pre>{error}</pre> : undefined}
    </div>
)

export default TextErrorPage;

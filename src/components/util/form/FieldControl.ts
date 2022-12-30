export interface FieldControl<T> {
    getOutput: () => T
    setOutput: (t: T) => void
}

import { BaseSyntheticEvent } from "react"
import { useForm } from "react-hook-form"
import { Control, FieldPath, FieldValues, RegisterOptions, UseFormRegisterReturn } from "react-hook-form/dist/types"
import { DefaultValues } from "react-hook-form/dist/types/form"
import { useTextFormConfig } from "../../../core/config"
import { fillTemplates, TextStore, useTeksten } from "../../../core/text"

type UseTextFormInput<TFieldValues extends FieldValues, TTextStoreName extends keyof Omit<TextStore, 'isError'>> = {
    textFormConfigName: TTextStoreName
    mapTextStoreToForm: (store: TextStore[TTextStoreName]) => TFieldValues
    mapFormToTextStore: (data: TFieldValues) => TextStore[TTextStoreName]
    formatTekstenForTemplates: (store: TextStore[TTextStoreName]) => TextStore[TTextStoreName]
}

type UseTextFormReturn<TFieldValues extends FieldValues> = {
    onClear: () => void;
    onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
    control: Control<TFieldValues>;
    register: <TFieldName extends FieldPath<TFieldValues>>(name: TFieldName, options?: RegisterOptions<TFieldValues, TFieldName>) => UseFormRegisterReturn<TFieldName>
}

export default function useTextForm<TFieldValues extends FieldValues, TTextStoreName extends keyof Omit<TextStore, 'isError'>>(input: UseTextFormInput<TFieldValues, TTextStoreName>): UseTextFormReturn<TFieldValues> {
    const { teksten, setTeksten, defaultTextStore } = useTeksten(input.textFormConfigName)
    const formConfig = useTextFormConfig(input.textFormConfigName)
    const { control, handleSubmit, register, reset } = useForm<TFieldValues>({ defaultValues: input.mapTextStoreToForm(teksten) as DefaultValues<TFieldValues> })

    function onSubmit(data: TFieldValues) {
        const textStore = input.mapFormToTextStore(data)
        const textForTemplate = input.formatTekstenForTemplates(textStore)

        reset(input.mapTextStoreToForm(textStore))
        if (!!formConfig) fillTemplates(formConfig, textForTemplate)
        setTeksten(textStore)
    }

    function onClear() {
        reset(input.mapTextStoreToForm(defaultTextStore))
        setTeksten(defaultTextStore)
    }

    return {
        onSubmit: handleSubmit(onSubmit),
        onClear,
        control,
        register,
    }
}

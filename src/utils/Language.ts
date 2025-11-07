import { Locale } from 'antd/es/locale'

import enUS from 'antd/es/locale/en_US'
import esES from 'antd/es/locale/es_ES'

import enUSMessages from '../locales/en-US.json'
import esESMessages from '../locales/es-ES.json'

import StorageHelper from './StorageHelper'

export interface LanguageOption {
    label: string
    value: string
    alias?: string[]
    antdLocale: Locale
    messages: Record<string, string>
    rtl?: boolean
}

const languagesOptions: LanguageOption[] = [
    // en-US should be the first option
    {
        label: 'English',
        value: 'en-US',
        alias: ['en'],
        antdLocale: enUS,
        messages: enUSMessages,
    },
    {
        label: 'Español',
        value: 'es-ES',
        alias: ['es'],
        antdLocale: esES,
        messages: esESMessages,
    },
]

const defaultLanguageOptions = languagesOptions[0]

const savedLanguageInBrowser = StorageHelper.getLanguageFromLocalStorage()

function findLanguageOption(language: string): LanguageOption {
    return (
        languagesOptions.find((o) => {
            return o.value === language || o.alias?.includes(language)
        }) || defaultLanguageOptions
    )
}

let currentLanguageOption = findLanguageOption(savedLanguageInBrowser)

export function localize(key: string, message: string) {
    return currentLanguageOption.messages[key] || message
}

export function getCurrentLanguageOption() {
    return currentLanguageOption
}

export function setCurrentLanguageOption(
    languageAcronym: string
): LanguageOption {
    currentLanguageOption = findLanguageOption(languageAcronym)
    StorageHelper.setLanguageInLocalStorage(currentLanguageOption.value)

    return currentLanguageOption
}

setCurrentLanguageOption(savedLanguageInBrowser)

export { languagesOptions }

// Currently only enable language for dev mode or demo, until the vast majority of the content is translated
export const isLanguageEnabled = true
// !!process.env.REACT_APP_IS_DEBUG ||

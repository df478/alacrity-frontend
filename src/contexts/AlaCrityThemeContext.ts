import { createContext } from 'react'
import AlaCrityTheme from '../styles/theme/AlaCrityTheme'

const AlaCrityThemeContext = createContext({
    currentTheme: undefined as undefined | AlaCrityTheme,
    setAlaCrityThemeContext: (value: AlaCrityTheme | undefined) => {},
})

export default AlaCrityThemeContext

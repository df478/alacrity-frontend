import { Select } from 'antd'
import { useContext } from 'react'
import AlaCrityThemeContext from '../../contexts/AlaCrityThemeContext'
import AlaCrityTheme from '../../styles/theme/AlaCrityTheme'
import { ThemeProvider } from '../../styles/theme/ThemeProvider'
import Toaster from '../../utils/Toaster'

interface ThemeSelectorProps {
    themes: AlaCrityTheme[]
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ themes }) => {
    const { currentTheme, setAlaCrityThemeContext } =
        useContext(AlaCrityThemeContext)

    // const dispatch = useDispatch()

    const options = themes.map((it) => {
        return { value: it.name, label: it.name }
    })

    options.unshift({ value: 'default', label: 'Default' })

    const handleChange = (value: string) => {
        const t = themes.find((it) => it.name === value)
        setAlaCrityThemeContext(t)
        ThemeProvider.getInstance()
            .saveCurrentTheme(t ? t.name : '')
            .catch(Toaster.createCatcher())
        // dispatch(emitRootKeyChanged()) Needed?
    }

    return (
        <Select
            style={{ width: 200 }}
            options={options}
            value={currentTheme?.name || options[0].value}
            onChange={handleChange}
        />
    )
}

export default ThemeSelector

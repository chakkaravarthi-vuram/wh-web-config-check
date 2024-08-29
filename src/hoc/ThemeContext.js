/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ThemeContext = createContext();

const ThemeValue = {
    buttonColor: '#217cf5',
    buttonIconColor: '#fffff',
    primaryColor: '#217cf5',
    adminTitleColor: '#ffffff',
};

// eslint-disable-next-line prefer-const
let colorSchemeDefault = { // colorSchemeDefault applied when default theme is selected( when 'is_default_theme' is true)
    highlight: '#1A4AC8',
    widgetBg: '#FFFFFF',
    appBg: '#EEF1F3',
    activeColor: '#217CF5',
};

export function ThemeProvider(props) {
    /* Theme changes const [darkMode, setDarkMode] = useState(false);
    // const toggleDarkMode = () => {
    //     setDarkMode(!darkMode);
    // }; */
    const [colorScheme, setColorScheme] = useLocalStorage('themeColor', {
        highlight: '#1A4AC8', // initial color is first default swatch option
        widgetBg: '#FFFFFF',
        appBg: '#EEF1F3',
        activeColor: '#217CF5', // refers to button/link color
    });

    const { children } = props;
    const initialValue = { ...ThemeValue, colorScheme, setColorScheme, colorSchemeDefault };

    return <ThemeContext.Provider value={initialValue}>{children}</ThemeContext.Provider>;
}

export default ThemeContext;

import React, { createContext, useContext, useEffect, useState } from "react";
import { Theme, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { useColorScheme } from "react-native";

interface ThemeContextData {
    systemThemeSelected: boolean;
    setSystemThemeSelected: React.Dispatch<React.SetStateAction<boolean>>;
    theme: Theme | undefined;
    // themeName: string | undefined;
    toggleTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

function AppThemeProvider({children}: {children: React.ReactNode}): React.JSX.Element {
    
    const userScheme = useColorScheme();
    const [systemThemeSelected, setSystemThemeSelected] = useState<boolean>(true);
    const [theme, setTheme] = useState<Theme>();
    // const [themeName, setThemeName] = useState<string>();

    useEffect(()=>{
        if(systemThemeSelected) {
            // setThemeName(userScheme === "dark" ? "dark" : "light");
            setTheme(userScheme === "dark" ? DarkTheme : DefaultTheme);
        } else {
            return;
        }
    }, [userScheme, systemThemeSelected])

    const toggleTheme = (themeName: string): void => {
        if(themeName === "light") {
            setTheme(DefaultTheme);
            // setThemeName("light");
        } else if(themeName === "dark") {
            setTheme(DarkTheme);
            // setThemeName("dark");
        } else {
            return;
        }
    }
    
    return (
        <ThemeContext.Provider value={{ systemThemeSelected, setSystemThemeSelected, theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

function useTheme(): ThemeContextData {
    const themeContext = useContext(ThemeContext);

    if(!themeContext) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return themeContext;
}

export {AppThemeProvider, useTheme};

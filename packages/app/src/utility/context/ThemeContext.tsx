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

    const lightTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: "#D6D6D6",  // Very light gray (placeholder)
            background: "#FFFFFF", // White
            card: "#565656",       // Lighter gray than background
            text: "#000000",       // Black
            border: "#DDDDDD",     // Light gray border
            notification: "#FDFDFD",  // Lighter gray notification (placeholder)
          }
    }

    const darkTheme = {
        ...DarkTheme,
        colors: {
            ...DarkTheme.colors,
            primary: "#FFFC00",  // Bright yellow (Pantone Yellow U) - remains consistent
            background: "#000000",  // Black
            card: "#292929",       // Dark gray
            text: "#FDF4DC",       // Light yellow text
            border: "#292929",     // Dark gray border
            notification: "#FFFC00",  // Bright yellow notification
            secondary: "#FFFC00",  // Bright yellow secondary
          }
    }
    
    const userScheme = useColorScheme();
    const [systemThemeSelected, setSystemThemeSelected] = useState<boolean>(false);
    const [theme, setTheme] = useState<Theme>(lightTheme);
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

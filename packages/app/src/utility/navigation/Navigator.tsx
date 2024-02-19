import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { AppNavigationStack, AuthNavigationStack } from "./NavigationStackProvider";
import { useTheme } from "../context/ThemeContext";

function Navigator(): React.JSX.Element {

    const {authData} = useAuth();
    const {theme} = useTheme();
    

    return (
        <NavigationContainer theme={theme}>
            {authData?.token ? <AppNavigationStack/> : <AuthNavigationStack/>}
        </NavigationContainer>
    )
}

export default Navigator;

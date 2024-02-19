import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../../screens/Login";
import Register from "../../screens/Register";
import Guftgu from "../../screens/Guftgu";
import Mehfil from "../../screens/Mehfil";
import { NavStackParamList } from "./NavigationStackTypes";

const AuthStack = createNativeStackNavigator<NavStackParamList>();
const AppStack = createNativeStackNavigator<NavStackParamList>();

function AuthNavigationStack(): React.JSX.Element {
    return (
        <AuthStack.Navigator screenOptions={{headerShown: false}}>
            <AuthStack.Screen name="Login" component={Login} />
            <AuthStack.Screen name="Register" component={Register} /> 
        </AuthStack.Navigator>
    )
}

function AppNavigationStack(): React.JSX.Element {
    return (
        <AppStack.Navigator screenOptions={{headerShown: false}}>
            <AppStack.Screen name="Guftgu" component={Guftgu} />
            <AppStack.Screen name="Mehfil" component={Mehfil} />
        </AppStack.Navigator>
    )
}

export { AuthNavigationStack, AppNavigationStack };

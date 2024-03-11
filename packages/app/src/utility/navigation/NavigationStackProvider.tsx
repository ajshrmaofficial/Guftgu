import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../../screens/Login";
import Register from "../../screens/Register";
import Guftgu from "../../screens/Guftgu";
import Mehfil from "../../screens/Mehfil";
import { NavStackParamList, NavTabParamList } from "./NavigationStackTypes";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Map from "../../screens/Map";

const AuthStack = createNativeStackNavigator<NavStackParamList>();
// const AppStack = createNativeStackNavigator<NavStackParamList>();
const AppStack = createBottomTabNavigator<NavTabParamList>();

function AuthNavigationStack(): React.JSX.Element {
    return (
        <AuthStack.Navigator screenOptions={{headerShown: false}}>
            <AuthStack.Screen name="Login" component={Login} />
            <AuthStack.Screen name="Register" component={Register} /> 
        </AuthStack.Navigator>
    )
}

// function AppNavigationStack(): React.JSX.Element {
//     return (
//         <AppStack.Navigator screenOptions={{headerShown: false}}>
//             <AppStack.Screen name="Guftgu" component={Guftgu} />
//             <AppStack.Screen name="Mehfil" component={Mehfil} />
//         </AppStack.Navigator>
//     )
// }

function AppNavigationStack(): React.JSX.Element {
    return (
        <AppStack.Navigator screenOptions={{headerShown: false}}>
            <AppStack.Screen name="Guftgu" component={Guftgu} />
            <AppStack.Screen name="Mehfil" component={Mehfil} />
            <AppStack.Screen name="Map" component={Map} />
        </AppStack.Navigator>
    )
}

export { AuthNavigationStack, AppNavigationStack };

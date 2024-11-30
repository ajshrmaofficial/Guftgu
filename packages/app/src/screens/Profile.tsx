import React from "react";
import { Text, View } from "react-native";
import useUserStore from "../utility/store/userStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { version } from '../../package.json';
import getThemeColors from "../utility/theme";

function Profile(): React.JSX.Element {
    const {text} = getThemeColors();
    const name = useUserStore(state => state.name);
    const username = useUserStore(state => state.username);
    const myName = name || "User";
    const insets = useSafeAreaInsets();

    return(
        <View className="h-full w-full" style={{paddingTop: insets.top}}>
            <View className="h-20 w-20 bg-slate-800 self-center items-center justify-center rounded-3xl">
                <Text className="text-4xl font-bold text-white">{myName[0].toLocaleUpperCase()}</Text>
            </View>
            <Text className={`${text.primary.tailwind} self-center text-2xl font-bold`}>{myName}</Text>
            <Text className={`${text.secondary.tailwind} self-center text-md text-gray-700`}>@{username}</Text>
            <View className="absolute bottom-12 self-center items-center">
                <Text className={`text-xs ${text.accent.tailwind} font-semibold`}>v{version}</Text>
                <Text className={`text-xs ${text.accent.tailwind} font-semibold`}>Made with ❤️</Text>
                <Text className={`text-xs ${text.accent.tailwind} font-semibold`}>by Ajay Sharma</Text>
            </View>
        </View>
    )
}

export default Profile;

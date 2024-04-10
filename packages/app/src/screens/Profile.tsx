import React from "react";
import { Text, View } from "react-native";
import useAuth from "../utility/hooks/useAuth";
import { useTheme } from "@react-navigation/native";

function Profile(): React.JSX.Element {
    const {colors} = useTheme();
    const {username} = useAuth();
    const myUsername = username || "User";

    return(
        <View className="h-full w-full">
            <View className="h-20 w-20 bg-slate-800 self-center items-center justify-center rounded-3xl">
                <Text className="text-4xl font-bold text-white">{myUsername[0].toLocaleUpperCase()}</Text>
            </View>
            <Text style={{color: colors.text}} className="self-center text-2xl font-bold">{username}</Text>
        </View>
    )
}

export default Profile;

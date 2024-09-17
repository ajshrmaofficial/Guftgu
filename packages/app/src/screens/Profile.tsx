import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import useUserStore from "../utility/store/userStore";

function Profile(): React.JSX.Element {
    const {colors} = useTheme();
    const name = useUserStore(state => state.name);
    const myName = name || "User";

    return(
        <View className="h-full w-full">
            <View className="h-20 w-20 bg-slate-800 self-center items-center justify-center rounded-3xl">
                <Text className="text-4xl font-bold text-white">{myName[0].toLocaleUpperCase()}</Text>
            </View>
            <Text style={{color: colors.text}} className="self-center text-2xl font-bold">{myName}</Text>
        </View>
    )
}

export default Profile;

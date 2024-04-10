import React from "react";
import { ActivityIndicator, View } from "react-native";

function Loader(): React.JSX.Element {
    return(
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    )
}

export default Loader;

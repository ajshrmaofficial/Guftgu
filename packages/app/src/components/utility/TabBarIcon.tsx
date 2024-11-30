import React from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import getThemeColors from "../../utility/theme";

function TabBarIcon(props: {size: number, isFocused: boolean, name: string}): React.JSX.Element {
    const {background, icons} = getThemeColors();
    const iconName = props.name === 'Guftgu' ? 'chat' : props.name === 'Mehfil' ? 'group' : 'map';

    return (
        <View className={`py-1 px-5 rounded-3xl ${props.isFocused ? background.accent.tailwind : ''}`}>
            <Icon name={iconName} size={props.size} color={props.isFocused ? icons.accent.hex : icons.primary.hex} />  
        </View>
    )
}

export default TabBarIcon;

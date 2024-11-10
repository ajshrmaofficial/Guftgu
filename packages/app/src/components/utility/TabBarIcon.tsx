import React from "react";
import { StyleSheet } from "react-native";
import { SvgProps } from "react-native-svg";

function TabBarIcon(props: {color: string, size: number, icon: React.FC<SvgProps>}): React.JSX.Element {
    const Icon = props.icon;
    
    const styles = StyleSheet.create({
        icon: {
            color: props.color,
            width: props.size,
            height: props.size
        }
    })

    return (
        <Icon style={styles.icon}/>
    )
}

export default TabBarIcon;

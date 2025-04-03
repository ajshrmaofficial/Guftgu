import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import useUserStore from "../utility/store/userStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { version } from '../../package.json';
import getThemeColors from "../utility/theme";
import { pickMedia } from "../components/utility/MediaPicker";
import { Image as ImageType } from "react-native-image-crop-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { downloadFile, uploadFile } from "../utility/storage bucket/storageFunctions";

function Profile(): React.JSX.Element {
    const {text} = getThemeColors();
    const name = useUserStore(state => state.name);
    const username = useUserStore(state => state.username);
    const myName = name || "User";
    const insets = useSafeAreaInsets();
    const image = useUserStore(state => state.profilePic);
    const setImage = useUserStore(state => state.setProfilePic);

    const openMediaPicker = async() => {
        try {
            const result = await pickMedia({mediaType: "photo", cropping: true});
            // check type of result to be as ImageType
            if(result.length === 0) return;
            const image = result[0] as ImageType;
            const profilePic = image.path;
            setImage(profilePic);
            await AsyncStorage.setItem('profilePic', profilePic);
            const res = await uploadFile({fileData: {name: image.filename || 'profile', type: image.mime, uri: profilePic}, isProfilePicture: true});
            console.log(res);
        } catch (error) {
            console.error('Failed to pick media:', error);
        }
    }

    return(
        <View className="h-full w-full" style={{paddingTop: insets.top}}>
            <TouchableOpacity onPress={openMediaPicker} className="h-20 w-20 bg-slate-800 self-center items-center justify-center rounded-3xl">
                {!image && <Text className="text-4xl font-bold text-white">{myName[0].toLocaleUpperCase()}</Text>}
                {image && <Image source={{uri: image}} style={{height: 80, width: 80, borderRadius: 40}} />}
            </TouchableOpacity>
            <Text className={`${text.primary.tailwind} self-center text-2xl font-bold`}>{myName}</Text>
            <Text className={`self-center text-md text-gray-700`}>@{username}</Text>
            
            <View className="absolute bottom-12 self-center items-center">
                <Text className={`text-2xl ${text.accent.tailwind} font-black`}>Guftgu</Text>
                <Text className={`text-xs font-medium ${text.accent.tailwind}`}>Made with ❤️</Text>
                <Text className={`text-xs font-medium ${text.accent.tailwind}`}>Version {version}</Text>
            </View>
        </View>
    )
}

export default Profile;

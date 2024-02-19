import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import "../../global.css"
import { useAuth } from "../utility/context/AuthContext";
import { NavStackProps } from "../utility/navigation/NavigationStackTypes";

function Login({navigation}: NavStackProps<"Login">): React.JSX.Element {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const {authData, setAuthData, login, loading} = useAuth();

    const onPress = () => {
        login(username, password).then((result)=>{
            console.log(result);
            setAuthData({token: 'fsadfsf', username});
        });
    }

    return (
        <>
            {loading && <View className="justify-center items-center">
                            <Text className="text-4xl">Loading...</Text>
                        </View>
            }
            {!loading && <View className="items-center">
                <Text className="text-4xl absolute m-3 self-start">Login</Text>
                <View className="w-2/3 h-full justify-center items-center">
                    <Text className="self-start">Username</Text>
                    <TextInput className="border border-white rounded-md w-full mb-4" placeholder="Username" value={username} onChangeText={(text) => setUsername(text)} />
                    <Text className="self-start">Password</Text>
                    <TextInput className="border border-white rounded-md w-full mb-5" placeholder="Password" value={password} onChangeText={(text) => setPassword(text)} />
                    <TouchableOpacity className="border border-white rounded-md w-2/3 p-2 items-center" onPress={onPress}> 
                        <Text>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>}
        </>
    )
}

export default Login;

import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import { useAuthFunctions } from '../utility/definitionStore';
import {AuthStackProps} from '../utility/navigation/NavigationStackTypes';
import Loader from '../components/utility/Loader';
import getThemeColors from '../utility/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LoginFormData{
  username: string
  password: string
  error: string
}

function Login({navigation}: AuthStackProps<"Login">): React.JSX.Element {
  const {login} = useAuthFunctions();
  const [loginFormData, setLoginFormData] = useState<LoginFormData>({
    username: '',
    password: '',
    error: ''
  });
  const {username, password, error} = loginFormData;
  const [loading, setLoading] = useState<boolean>(false);
  const {text} = getThemeColors();
  const insets = useSafeAreaInsets();

  const submitCredentials = async () => {

    setLoading(true);
    const res = await login(username, password);
    if (res) {
      setLoginFormData({...loginFormData, error: 'Incorrect Credentials !!'});
    }
    setLoading(false);
  };

  const navigateSignup = () => {
    navigation.navigate('Register');
  };

  if (loading) return <Loader />;

  return (
    <View className="items-center flex-1" style={{paddingTop: insets.top}}>
      <Text className={`text-4xl absolute self-start ${text.primary.tailwind} mx-3 my-6`}>Login</Text>
      <View className="w-2/3 h-full justify-center items-center">
        <TextInput
          className={`border rounded-md w-full mb-4 ${text.primary.tailwind}`}
          placeholder="Username"
          placeholderTextColor={text.primary.hex}
          value={username}
          onChangeText={text => setLoginFormData({...loginFormData, username: text})}
        />
        <TextInput
          className={`border rounded-md w-full mb-5 ${text.primary.tailwind}`}
          placeholder="Password"
          placeholderTextColor={text.primary.hex}
          value={password}
          onChangeText={text => setLoginFormData({...loginFormData, password: text})}
          secureTextEntry={true}
        />
        <TouchableOpacity
          className="border rounded-md w-2/3 p-2 items-center"
          onPress={!loading && submitCredentials}>
          <Text className={`${text.primary.tailwind}`}>Submit</Text>
        </TouchableOpacity>
        <Text className={`${text.primary.tailwind}`}>
          Doesn't have an account?{' '}
        </Text>
          <TouchableOpacity onPress={navigateSignup}>
            <Text className={`${text.accent.tailwind}`}>SignUp</Text>
          </TouchableOpacity>
        <Text className="text-red-500">{error}</Text>
      </View>
    </View>
  );
}

export default Login;

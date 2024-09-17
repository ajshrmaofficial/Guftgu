import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import { useAuthFunctions } from '../utility/definitionStore';
import {AuthStackProps} from '../utility/navigation/NavigationStackTypes';
import Loader from '../components/Loader';
import { useTheme } from '@react-navigation/native';

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
  const {colors} = useTheme();

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

  return (
    <>
      {loading && (
        <Loader/>
      )}
      {!loading && (
        <View className="items-center">
          <Text style={{color: colors.text}} className="text-4xl absolute m-3 self-start">Login</Text>
          <View className="w-2/3 h-full justify-center items-center">
            <TextInput
              className="border rounded-md w-full mb-4"
              style={{color: colors.text}}
              placeholder="Username"
              placeholderTextColor={colors.text}
              value={username}
              onChangeText={text => setLoginFormData({...loginFormData, username: text})}
            />
            <TextInput
              className="border rounded-md w-full mb-5"
              style={{color: colors.text}}
              placeholder="Password"
              placeholderTextColor={colors.text}
              value={password}
              onChangeText={text => setLoginFormData({...loginFormData, password: text})}
              secureTextEntry={true}
            />
            <TouchableOpacity
              className="border rounded-md w-2/3 p-2 items-center"
              onPress={!loading && submitCredentials}>
              <Text style={{color: colors.text}}>Submit</Text>
            </TouchableOpacity>
            <Text style={{color: colors.text}}>
              Doesn't have an account?{' '}
            </Text>
              <TouchableOpacity onPress={navigateSignup}>
                <Text className='text-blue-700'>SignUp</Text>
              </TouchableOpacity>
            <Text className="text-red-500">{error}</Text>
          </View>
        </View>
      )}
    </>
  );
}

export default Login;

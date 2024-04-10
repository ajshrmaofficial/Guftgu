import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import { useAuthFunctions } from '../utility/definitionStore';
import {AuthStackProps} from '../utility/navigation/NavigationStackTypes';
import Loader from '../components/Loader';
import { useTheme } from '@react-navigation/native';

function Login({navigation}: AuthStackProps<"Login">): React.JSX.Element {
  const {login} = useAuthFunctions();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const {colors} = useTheme();

  const submitCredentials = async () => {
    setLoading(true);
    const res = await login(username, password);
    if (res) {
      setError('Incorrect Credentials !!');
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
              onChangeText={text => setUsername(text)}
            />
            <TextInput
              className="border rounded-md w-full mb-5"
              style={{color: colors.text}}
              placeholder="Password"
              placeholderTextColor={colors.text}
              value={password}
              onChangeText={text => setPassword(text)}
            />
            <TouchableOpacity
              className="border rounded-md w-2/3 p-2 items-center"
              onPress={!loading && submitCredentials}>
              <Text style={{color: colors.text}}>Submit</Text>
            </TouchableOpacity>
            <Text style={{color: colors.text}}>
              Doesn't have an account?{' '}
              <TouchableOpacity onPress={navigateSignup}>
                <Text style={{color: colors.text}}>SignUp</Text>
              </TouchableOpacity>
            </Text>
            <Text className="text-red-500">{error}</Text>
          </View>
        </View>
      )}
    </>
  );
}

export default Login;

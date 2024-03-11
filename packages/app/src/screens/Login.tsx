import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useAuth} from '../utility/context/AuthContext';
import {NavStackProps} from '../utility/navigation/NavigationStackTypes';

function Login({navigation}: NavStackProps<'Login'>): React.JSX.Element {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const {login, loading, err} = useAuth();

  const submitCredentials = () => {
    login(username, password);
  };

  const navigateSignup = () => {
    navigation.navigate('Register');
  };

  return (
    <>
      {loading && (
        <View>
          <Text className="text-4xl">Loading...</Text>
        </View>
      )}
      {!loading && (
        <View className="items-center">
          <Text className="text-4xl absolute m-3 self-start">Login</Text>
          <View className="w-2/3 h-full justify-center items-center">
            <TextInput
              className="border border-white rounded-md w-full mb-4"
              placeholder="Username"
              value={username}
              onChangeText={text => setUsername(text)}
            />
            <TextInput
              className="border border-white rounded-md w-full mb-5"
              placeholder="Password"
              value={password}
              onChangeText={text => setPassword(text)}
            />
            <TouchableOpacity
              className="border border-white rounded-md w-2/3 p-2 items-center"
              onPress={!loading && submitCredentials}>
              <Text>Submit</Text>
            </TouchableOpacity>
            <Text>
              Doesn't have an account?{' '}
              <TouchableOpacity onPress={navigateSignup}>
                <Text>SignUp</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      )}
    </>
  );
}

export default Login;

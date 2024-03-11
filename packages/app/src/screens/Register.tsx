import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useAuth} from '../utility/context/AuthContext';
import {NavStackProps} from '../utility/navigation/NavigationStackTypes';

function Register({navigation}: NavStackProps<'Register'>): React.JSX.Element {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [hasLowerCase, setHasLowerCase] = useState<boolean>(false);
  const [hasUpperCase, setHasUpperCase] = useState<boolean>(false);
  const [hasNumber, setHasNumber] = useState<boolean>(false);
  const [hasSpecialChar, setHasSpecialChar] = useState<boolean>(false);

  const {register, loading, err, setErr} = useAuth();

  const validatePassword = (text: string): void => {
    setPassword(text);
    setHasLowerCase(/[a-z]/.test(text));
    setHasUpperCase(/[A-Z]/.test(text));
    setHasNumber(/\d/.test(text));
    setHasSpecialChar(/[!@#$%^&*()_+]/.test(text));
  }

  const comparePasswords = (text: string): void => {
    setConfirmPassword(text);
    if(text!==password){
        setErr("Passwords do not match");
    }
  }

  const submitCredentials = async() => {
    if(password!==confirmPassword){
        return;
    }
    const res = await register(username, password);
    if(res===true){
        setTimeout(()=>{
            navigation.navigate("Login")
        }, 1500);
    }
  };

  const navigateLogin = () => {
    navigation.navigate("Login");
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
          <Text className="text-4xl absolute m-3 self-start">Register</Text>
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
              onChangeText={text => validatePassword(text)}
            />
            <TextInput
              className="border border-white rounded-md w-full mb-5"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={text => comparePasswords(text)}
            />
            <TouchableOpacity
              className="border border-white rounded-md w-2/3 p-2 items-center"
              onPress={!loading && submitCredentials}>
              <Text>Submit</Text>
            </TouchableOpacity>
            <Text className="flex-row justify-center m-2">
              Login Instead?{' '}
              <TouchableOpacity onPress={navigateLogin}>
                <Text>Login</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      )}
    </>
  );
}

export default Register;

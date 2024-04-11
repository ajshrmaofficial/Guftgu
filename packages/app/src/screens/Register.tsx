import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import { useAuthFunctions } from '../utility/definitionStore';
import {AuthStackProps} from '../utility/navigation/NavigationStackTypes';
import Loader from '../components/Loader';
import { useTheme } from '@react-navigation/native';

function Register({navigation}: AuthStackProps<"Register">): React.JSX.Element {
  const {register} = useAuthFunctions();
  const {colors} = useTheme();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [hasLowerCase, setHasLowerCase] = useState<boolean>(false);
  const [hasUpperCase, setHasUpperCase] = useState<boolean>(false);
  const [hasNumber, setHasNumber] = useState<boolean>(false);
  const [hasSpecialChar, setHasSpecialChar] = useState<boolean>(false);
  const [usernameIsValid, setUsernameIsValid] = useState<boolean>(false);
  const [nameIsValid, setNameIsValid] = useState<boolean>(false);

  const validatePassword = (text: string): void => {
    setPassword(text);
    setHasLowerCase(/[a-z]/.test(text));
    setHasUpperCase(/[A-Z]/.test(text));
    setHasNumber(/\d/.test(text));
    setHasSpecialChar(/[!@#$%^&*()_+]/.test(text));
  }

  const validateUsername = (text: string): void => {
    setUsername(text);
    setUsernameIsValid(/^[a-z0-9._-]{3,}$/.test(text))
  }

  const validateName = (text: string): void => {
    setName(text);
    setNameIsValid(/^[a-zA-Z-' ]*[a-zA-Z-' ][a-zA-Z-' ]*$/.test(text))
  }

  const comparePasswords = (text: string): void => {
    setConfirmPassword(text);
    if(text!==password){
        setErr("Passwords do not match");
    }
  }

  const submitCredentials = async() => {
    if(!name || !username || !password || !confirmPassword){
      setErr("Enter all details !!");
      return;
    }
    if(!hasLowerCase || !hasUpperCase || !hasNumber || !hasSpecialChar){
      setErr("Enter valid password !!!");
      return;
    }
    if(!nameIsValid || !name.trim() || name.length>20){
      setErr("Enter valid name !!!");
      return;
    }
    if(!usernameIsValid){
      setErr("Enter valid username !!!");
      return;
    }
    if(password!==confirmPassword){
        setErr("Passwords do not match !!!");
        return;
    }
    setLoading(true);
    const res = await register(username, password, name);
    if(res){
      setErr(res);
      return;
    }
    setLoading(false);
    setErr("Redirecting to Login...");
    setTimeout(()=>{
        navigation.navigate("Login")
    }, 1500);
  };

  const navigateLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <>
      {loading && (
        <Loader/>
      )}
      {!loading && (
        <View className="items-center">
          <Text style={{color: colors.text}} className="text-4xl absolute m-3 self-start">Register</Text>
          <View className="w-2/3 h-full justify-center items-center">
          <TextInput
              className="border rounded-md w-full mb-4"
              style={{color: colors.text}}
              placeholder="Name"
              placeholderTextColor={colors.text}
              value={name}
              onChangeText={text => validateName(text)}
            />
            <TextInput
              className="border rounded-md w-full mb-4"
              style={{color: colors.text}}
              placeholder="Username"
              placeholderTextColor={colors.text}
              value={username}
              onChangeText={text => validateUsername(text)}
            />
            <TextInput
              className="border rounded-md w-full mb-4"
              style={{color: colors.text}}
              placeholder="Password"
              placeholderTextColor={colors.text}
              value={password}
              onChangeText={text => validatePassword(text)}
              secureTextEntry={true}
            />
            <TextInput
              className="border rounded-md w-full mb-5"
              style={{color: colors.text}}
              placeholder="Confirm Password"
              placeholderTextColor={colors.text}
              value={confirmPassword}
              onChangeText={text => comparePasswords(text)}
              secureTextEntry={true}
            />
            <TouchableOpacity
              className="border rounded-md w-2/3 p-2 items-center"
              onPress={!loading && submitCredentials}>
              <Text style={{color: colors.text}}>Submit</Text>
            </TouchableOpacity>
            <Text style={{color: colors.text}}>
              Login Instead?{' '}
            </Text>
              <TouchableOpacity onPress={navigateLogin}>
                <Text className='text-blue-700'>Login</Text>
              </TouchableOpacity>
            <Text className="text-red-500">{err}</Text>
          </View>
        </View>
      )}
    </>
  );
}

export default Register;

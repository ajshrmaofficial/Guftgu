import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import { useAuthFunctions } from '../utility/definitionStore';
import {AuthStackProps} from '../utility/navigation/NavigationStackTypes';
import Loader from '../components/Loader';
import { useTheme } from '@react-navigation/native';

interface RegisterFormData {
  username: string
  name: string
  password: string
  confirmPassword: string
  error: string
}

interface ValidationFields{
  hasLowerCase: boolean
  hasUpperCase: boolean
  hasNumber: boolean
  hasSpecialChar: boolean
  isUsernameValid: boolean
  isNameValid: boolean
}

function Register({navigation}: AuthStackProps<"Register">): React.JSX.Element {
  const {register} = useAuthFunctions();
  const {colors} = useTheme();
  const [registerFormData, setRegisterFormData] = useState<RegisterFormData>({
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
    error: ''
  });
  const {username, name, password, confirmPassword, error} = registerFormData;
  const [validationFields, setValidationFields] = useState<ValidationFields>({
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isUsernameValid: false,
    isNameValid: false
  })
  const {hasLowerCase, hasUpperCase, hasNumber, hasSpecialChar, isUsernameValid, isNameValid} = validationFields;
  const [loading, setLoading] = useState<boolean>(false);

  const validatePassword = (text: string): void => {
    setRegisterFormData({...registerFormData, password: text});
    setValidationFields({...validationFields, 
      hasLowerCase: /[a-z]/.test(text),
      hasUpperCase: /[A-Z]/.test(text),
      hasNumber: /\d/.test(text),
      hasSpecialChar: /[!@#$%^&*()_+]/.test(text)
    });
  }

  const validateUsername = (text: string): void => {
    setRegisterFormData({...registerFormData, username: text});
    setValidationFields({...validationFields, isUsernameValid: /^[a-z0-9._-]{3,}$/.test(text)});
  }

  const validateName = (text: string): void => {
    setRegisterFormData({...registerFormData, name: text});
    setValidationFields({...validationFields, isNameValid: /^[a-zA-Z-' ]*[a-zA-Z-' ][a-zA-Z-' ]*$/.test(text)});
  }

  const comparePasswords = (text: string): void => {
    setRegisterFormData({...registerFormData, confirmPassword: text});
    if(text!==password){
        setRegisterFormData({...registerFormData, error: "Passwords do not match"});
    }
  }

  const submitCredentials = async() => {
    if(!name || !username || !password || !confirmPassword){
      setRegisterFormData({...registerFormData, error: "Enter all details"});
      return;
    }
    if(!hasLowerCase || !hasUpperCase || !hasNumber || !hasSpecialChar){
      setRegisterFormData({...registerFormData, error: "Enter valid password"});
      return;
    }
    if(!isNameValid || !name.trim() || name.length>20){
      setRegisterFormData({...registerFormData, error: "Enter a valid name"});
      return;
    }
    if(!isUsernameValid){
      setRegisterFormData({...registerFormData, error: "Enter a valid username"});
      return;
    }
    if(password!==confirmPassword){
      setRegisterFormData({...registerFormData, error: "Passwords do not match"});
      return;
    }
    setLoading(true);
    const res = await register(username, password, name);
    if(res){
      setRegisterFormData({...registerFormData, error: res});
      return;
    }
    setLoading(false);
    setRegisterFormData({...registerFormData, error: "Redirecting to login..."});
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
            <Text className="text-red-500">{error}</Text>
          </View>
        </View>
      )}
    </>
  );
}

export default Register;

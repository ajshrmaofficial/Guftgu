import React, { useState, useCallback } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuthFunctions } from '../utility/definitionStore';
import { AuthStackProps } from '../utility/navigation/NavigationStackTypes';
import Loader from '../components/utility/Loader';
import getThemeColors from '../utility/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FormData {
  username: string;
  name: string;
  password: string;
  confirmPassword: string;
}

const useForm = (initialState: FormData) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState<string>('');
  const [isValid, setIsValid] = useState({
    password: false,
    username: false,
    name: false,
  });

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  }, []);

  const validateField = useCallback((field: keyof FormData, value: string) => {
    const validations = {
      password: () => {
        const hasLower = /[a-z]/.test(value);
        const hasUpper = /[A-Z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecial = /[!@#$%^&*()_+]/.test(value);
        return hasLower && hasUpper && hasNumber && hasSpecial;
      },
      username: () => /^[a-z0-9._-]{3,}$/.test(value),
      name: () => /^[a-zA-Z-' ]*[a-zA-Z-' ][a-zA-Z-' ]*$/.test(value) && value.length <= 20,
    };

    if (field in validations) {
      setIsValid(prev => ({
        ...prev,
        [field]: validations[field as keyof typeof validations](),
      }));
    }
  }, []);

  return {
    values,
    errors,
    isValid,
    handleChange,
    setErrors,
  };
};

function Register({ navigation }: AuthStackProps<"Register">): React.JSX.Element {
  const { register } = useAuthFunctions();
  const {text} = getThemeColors();
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const {
    values,
    errors,
    isValid,
    handleChange,
    setErrors,
  } = useForm({
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = useCallback(async () => {
    const { username, name, password, confirmPassword } = values;

    if (!username || !name || !password || !confirmPassword) {
      setErrors('Enter all details');
      return;
    }

    if (!isValid.password) {
      setErrors('Enter valid password');
      return;
    }

    if (!isValid.name) {
      setErrors('Enter a valid name');
      return;
    }

    if (!isValid.username) {
      setErrors('Enter a valid username');
      return;
    }

    if (password !== confirmPassword) {
      setErrors('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const error = await register(username, password, name);
      if (error) {
        setErrors(error);
        return;
      }
      setErrors('Redirecting to login...');
      setTimeout(() => navigation.navigate("Login"), 1500);
    } finally {
      setLoading(false);
    }
  }, [values, isValid, register, navigation]);

  if (loading) return <Loader />;

  return (
    <View className="items-center" style={{paddingTop: insets.top}}>
      <Text className={`${text.primary.tailwind} text-4xl absolute self-start mx-3 my-6`}>
        Register
      </Text>
      <View className="w-2/3 h-full justify-center items-center">
        <TextInput
          className={`${text.primary.tailwind} border rounded-md w-full mb-4`}
          placeholder="Name"
          placeholderTextColor={text.primary.hex}
          value={values.name}
          onChangeText={text => handleChange('name', text)}
        />
        <TextInput
          className={`border rounded-md w-full mb-4 ${text.primary.tailwind}`}
          placeholder="Username"
          placeholderTextColor={text.primary.hex}
          value={values.username}
          onChangeText={text => handleChange('username', text)}
        />
        <TextInput
          className={`border rounded-md w-full mb-4 ${text.primary.tailwind}`}
          placeholder="Password"
          placeholderTextColor={text.primary.hex}
          value={values.password}
          onChangeText={text => handleChange('password', text)}
          secureTextEntry={true}
        />
        <TextInput
          className={`border rounded-md w-full mb-5 ${text.primary.tailwind}`}
          placeholder="Confirm Password"
          placeholderTextColor={text.primary.hex}
          value={values.confirmPassword}
          onChangeText={text => handleChange('confirmPassword', text)}
          secureTextEntry={true}
        />
        <TouchableOpacity
          className="border rounded-md w-2/3 p-2 items-center"
          onPress={handleSubmit}>
          <Text className={`${text.primary.tailwind}`}>Submit</Text>
        </TouchableOpacity>
        <Text className={`${text.primary.tailwind}`}>
          Login Instead?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text className={`${text.accent.tailwind}`}>Login</Text>
        </TouchableOpacity>
        <Text className="text-red-500">{errors}</Text>
      </View>
    </View>
  );
}

export default Register;

import React, {createContext, useContext, useEffect, useState} from 'react';
import server from '../axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthData {
  authToken: string | null;
  username: string | null;
}

interface AuthContextData {
  authData: AuthData;
  setAuthData: React.Dispatch<React.SetStateAction<AuthData>>;
  loading: boolean;
  err: string;
  setErr: React.Dispatch<React.SetStateAction<string>>;
  login: (username: string, password: string) => void;
  register: (username: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [authData, setAuthData] = useState<AuthData>({
    authToken: null,
    username: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>('');

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await server.post('/auth/login', {
        username: username,
        passwd: password,
      });
      if (response.status === 200) {
        setAuthData({authToken: response.data.authToken, username: username});
        AsyncStorage.setItem('authToken', response.data.authToken);
        AsyncStorage.setItem('username', username);
      } else {
        setErr('Incorrect Credentials !!');
      }
    } catch (error) {
      console.log(error);
      setErr('Problem while logging in !!');
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    setLoading(true);
    let res = false;
    try {
      const response = await server.post('/auth/register', {
        username: username,
        passwd: password,
      });
      if (response.status === 201) {
        res = true;
      }
    } catch (error) {
      console.log(error);
      setErr('Problem while SignUp !!');
    } finally {
      setLoading(false);
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{authData, setAuthData, loading, err, setErr, login, register}}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): AuthContextData {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const authToken = await AsyncStorage.getItem('authToken');
      const username = await AsyncStorage.getItem('username');
      if (authToken && username) {
        authContext.setAuthData({authToken: authToken, username: username});
      }
    };
    fetchData();
  }, []);

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return authContext;
}

export {AuthProvider, useAuth};

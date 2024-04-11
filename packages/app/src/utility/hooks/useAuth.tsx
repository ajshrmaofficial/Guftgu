import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useAppGetState, useAppSetState } from "../redux/useAppState";
import { setAuthName, setAuthToken, setAuthUsername } from "../redux/authSlice";


function useAuth() {
    const setState = useAppSetState();
    const authToken = useAppGetState(state => state.auth.authToken);
    const username = useAppGetState(state => state.auth.username);
    const name = useAppGetState(state => state.auth.name);

    useEffect(() => {
        if(authToken && username) {
            return;
        }

      const fetchData = async () => {
        const authToken = await AsyncStorage.getItem('authToken');
        const username = await AsyncStorage.getItem('username');
        const name = await AsyncStorage.getItem('name');
        if (authToken && username && name) {
          setState(setAuthToken(authToken));
          setState(setAuthUsername(username));
          setState(setAuthName(name));
        }
      };
      fetchData();
    }, []);
  
    return {authToken, username, name};
}

export default useAuth;

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useAppGetState, useAppSetState } from "../redux/useAppState";
import { setAuthToken, setAuthUsername } from "../redux/authSlice";


function useAuth() {
    const setState = useAppSetState();
    const authToken = useAppGetState(state => state.auth.authToken);
    const username = useAppGetState(state => state.auth.username);

    useEffect(() => {
        if(authToken && username) {
            return;
        }

      const fetchData = async () => {
        const authToken = await AsyncStorage.getItem('authToken');
        const username = await AsyncStorage.getItem('username');
        if (authToken && username) {
          setState(setAuthToken(authToken));
          setState(setAuthUsername(username));
        }
      };
      fetchData();
    }, []);
  
    return {authToken, username};
}

export default useAuth;

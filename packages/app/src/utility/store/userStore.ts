import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { MyLocation } from "../definitionStore";

interface UserState{
    authToken: string | null
    username: string | null
    name: string | null
    myLocation: MyLocation | null
    error: unknown | null
}

interface UserStateSetter{
    fetchUser: () => void
    setAuthToken: (authToken: string) => void
    setUsername: (username: string) => void
    setName: (name: string) => void
    setMyLocation: (myLocation: MyLocation) => void
}

// Trying to follow error as a value approach here, inspiration :- https://www.frontendundefined.com/posts/monthly/zustand-review/

const useUserStore = create<UserState & UserStateSetter>()((set)=>({
    authToken: null,
    error: null,
    username: null,
    name: null,
    myLocation: null,
    setAuthToken: (authToken) => set((state) => ({authToken: authToken})),
    setUsername: (username) => set((state) => ({username: username})),
    setName: (name) => set((state) => ({name: name})),
    setMyLocation: (myLocation) => set((state) => ({myLocation: myLocation})),
    fetchUser: async () => {
        try {
            const authToken = await AsyncStorage.getItem('authToken');
            const username = await AsyncStorage.getItem('username');
            const name = await AsyncStorage.getItem('name');
            set({authToken, username, name, error: null}); 
        } catch (error) {
            set({error})
        }
    }
}));

useUserStore.getState().fetchUser();

export default useUserStore

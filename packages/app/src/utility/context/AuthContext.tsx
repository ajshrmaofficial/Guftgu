import React, { createContext, useContext, useState } from "react";
import server from "../axiosConfig";
import { AxiosResponse } from "axios";

interface AuthData {
    token: string | null;
    username: string | null;
}

interface AuthContextData {
    authData: AuthData;
    setAuthData: React.Dispatch<React.SetStateAction<AuthData>>;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({children}: {children: React.ReactNode}): React.JSX.Element {
    const [authData, setAuthData] = useState<AuthData>({token: null, username: null});
    const [loading, setLoading] = useState<boolean>(false);
    console.log(server.defaults.baseURL)
    const login = async (username: string, password: string) => { // TODO: Remove/Replace string type with void in this promise
        console.log("Logging in with username:", username, "and password:", password);
        setLoading(true);
        try {
            const response = await server.post("/auth/login", {username, password});
            if(response.status === 200) {
                setAuthData({token: response.data.token, username: username});
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
        return Promise<void>(() => {
            console.log("Logged in");
        });
    }

    const register = async (username: string, password: string): Promise<void> => {
        console.log("Registering with username:", username, "and password: ", password);
    }

    return (
        <AuthContext.Provider value={{authData, setAuthData, loading, login, register}}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth(): AuthContextData {
    const authContext = useContext(AuthContext);
    
    if(!authContext) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return authContext;
}

export {AuthProvider, useAuth};

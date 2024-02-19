import React, { Dispatch, createContext, useContext, useState } from "react";

interface AuthData {
    token: string | null;
    username: string | null;
}

interface AuthContextData {
    authData: AuthData;
    setAuthData: React.Dispatch<React.SetStateAction<AuthData>>;
    loading: boolean;
    login: (username: string, password: string) => Promise<string>;
    register: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({children}: {children: React.ReactNode}): React.JSX.Element {
    const [authData, setAuthData] = useState<AuthData>({token: null, username: null});
    const [loading, setLoading] = useState<boolean>(false);
    
    const login = async (username: string, password: string): Promise<string> => { // TODO: Remove/Replace string type with void in this promise
        setLoading(true);
        console.log("Logging in with username:", username, "and password:", password);
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve("User logged in!!!")
            }, 2000)
        })
    }

    const register = async (username: string, password: string): Promise<void> => {
        setLoading(true);
        console.log("Registering with username:", username, "and password: ", password);
        setLoading(false);
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

import { Outlet } from "react-router-dom"
import authContext from "../utility/authContext"
import { useEffect, useState } from "react"
import server from "../utility/serverConfig"
import {setSocketUsername, connectChatSocket} from "../utility/socket"

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    
    useEffect(()=>{
        const isLoggedIn = async() => {
            const response = await server.get('/auth/isLoggedIn', {withCredentials: true})
            if(response.data?.isLoggedIn){
                const userData = JSON.parse(localStorage.getItem('userData'))
                setSocketUsername(userData.username)
                connectChatSocket()
                setIsAuthenticated(true)
            }
        }
        if(!isAuthenticated) isLoggedIn()
    },[])
    
    return(
        <authContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
        <h1>App file</h1>
            <Outlet/>
        </authContext.Provider>
    )
}

export default App
import { Outlet } from "react-router-dom"
import authContext from "../utility/authContext"
import { useState } from "react"

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    return(
        <authContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
        <h1>App file</h1>
            <Outlet/>
        </authContext.Provider>
    )
}

export default App
import { useContext } from "react";
import authContext from "./authContext";
import { Navigate } from "react-router-dom";

function Protected(props) {
    const {isAuthenticated, setIsAuthenticated} = useContext(authContext)

    if(!isAuthenticated){
        return <Navigate to='/login' replace />
    }
    else return <>{props.children}</>
}

export default Protected
import { Link } from "react-router-dom"

const NavBar = ({isAuthenticated}) => {
    if(!isAuthenticated){
        return(
            <nav>
                <ul>
                    <li>
                        <Link to={'/'}>Home</Link>
                    </li>
                    <li>
                        <Link to={'/login'}>Login</Link>
                    </li>
                    <li>
                        <Link to={'register'}>Register</Link>
                    </li>
                </ul>
            </nav>
        )
    }

    return(
        <div>
            <ul>
                <li>
                    <Link to={'/'}>Chat</Link>
                </li>
                <li>
                    <Link to={'guftgu'}>Guftgu</Link>
                </li>
            </ul>
        </div>
    )
}

export default NavBar
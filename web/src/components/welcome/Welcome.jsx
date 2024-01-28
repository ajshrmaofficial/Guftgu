import { Outlet, Link } from "react-router-dom"

function Welcome() {
    return(
        <>
            <nav className="loginNavbar">
                <h2>Guftgu</h2>
                <ul>
                    <li>
                        <Link to={'/login'}>Login</Link>
                    </li>
                    <li>
                        <Link to={'/register'}>Register</Link>
                    </li>
                </ul>
            </nav>
            <Outlet/>
        </>
    )
}

export default Welcome
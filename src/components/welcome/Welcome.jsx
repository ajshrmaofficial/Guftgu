import { Outlet, Link } from "react-router-dom"

function Welcome() {
    return(
        <>
        <h1>Welcome</h1>
            <nav>
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
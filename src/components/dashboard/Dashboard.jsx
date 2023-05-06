import { Link, Outlet } from "react-router-dom"

function Dashboard() {
    return(
        <>
            <h1>Dashboard</h1>
            <nav>
                <ul>
                    <li>
                        <Link to={'/mehfil'}>Mehfil</Link>
                    </li>
                    <li>
                        <Link to={'/guftgu'}>Guftgu</Link>
                    </li>
                </ul>
            </nav>
            <Outlet/>
        </>
    )
}

export default Dashboard
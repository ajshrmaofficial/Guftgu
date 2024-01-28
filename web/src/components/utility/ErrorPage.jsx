import { Link, useRouteError } from "react-router-dom"

const ErrorPage = () => {
    const error = useRouteError()
    console.log(error)
    return(
        <div className="errorPage">
            <h1>Oops! {error.status || ''}</h1>
            <h3>Sorry, an unexpected error has occured.</h3>
            <h3>
                <i>
                    {error.statusText || error.message}
                </i>
            </h3>
            <Link to={'/'}>Go to Home</Link>
        </div>
    )
}

export default ErrorPage
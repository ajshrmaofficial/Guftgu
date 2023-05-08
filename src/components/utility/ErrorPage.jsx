import { useRouteError } from "react-router-dom"

const ErrorPage = () => {
    const error = useRouteError()
    return(
        <div>
            <h1>Oops!</h1>
            <h2>{error.status}</h2>
            <h3>Sorry, an unexpected error has occured.</h3>
            <p>
                <i>
                    {error.statusText || error.message}
                </i>
            </p>
        </div>
    )
}

export default ErrorPage
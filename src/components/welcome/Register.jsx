import { useState, useEffect, useContext } from "react";
import server from "../../utility/serverConfig";
import authContext from "../../utility/authContext";
import { useNavigate } from "react-router-dom";

function Register(){
    const [username, setUsername] = useState("");
    const [passwd, setPasswd] = useState("");
    const [error, setError] = useState('')
    const {isAuthenticated, setIsAuthenticated} = useContext(authContext)
    const navigate = useNavigate()

    useEffect(()=>{
      if(isAuthenticated) navigate('/')
    }, [isAuthenticated])

    const registerUser = async(credentials)=> {
        try {
            const res = await server.post('/auth/register', credentials)
            return res
          } catch (err) {
            // console.log(err)
            setUsername("")
            setPasswd("")
            setError(err.response.statusText)
          }
        }

    const submit = async(e) => {
        setError("")
        e.preventDefault();
        const response = await registerUser({username, passwd})
        if(response?.status==200) navigate('/login')
    };

    return(
        <div className="signupPage">
        <h2>Register</h2>
        <form onSubmit={submit}>
        <h3>Username:</h3>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <h3>Password:</h3>
        <input
          type="password"
          value={passwd}
          onChange={(e) => setPasswd(e.target.value)}
          required
        />
        <br />
        <button type="submit">Submit</button>
      </form>
        {error && <p>{error}</p>}
        </div>
    )
}

export default Register
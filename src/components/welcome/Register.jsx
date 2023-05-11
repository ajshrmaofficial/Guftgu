import { useState } from "react";
import server from "../../utility/serverConfig";
import { useNavigate } from "react-router-dom";

function Register(){
    const [username, setUsername] = useState("");
    const [passwd, setPasswd] = useState("");
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const registerUser = async(credentials)=> {
        try {
            const res = await server.post('/auth/register', credentials)
            return res
          } catch (err) {
            console.log(err)
            setError(err)
          }
        }

    const submit = async(e) => {
        e.preventDefault();
        const response = await registerUser({username, passwd})
        if(response?.status==200) navigate('/login')
    };

    return(
        <>
        <h1>Register</h1>
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
        {error && <p>{error?.message}</p>}
        </>
    )
}

export default Register
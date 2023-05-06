import { useContext, useEffect, useState } from "react";
import chatSocket from "../../utility/socket";
import authContext from "../../utility/authContext";
import server from "../../utility/serverConfig"
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [passwd, setPasswd] = useState("");
  const [error, setError] = useState('')
  const {isAuthenticated, setIsAuthenticated} = useContext(authContext)
  const navigate = useNavigate()

  useEffect(()=>{
    if(isAuthenticated) navigate('/')
  }, [isAuthenticated])

  const loginUser = async(credentials)=> {
    try {
        const res = await server.post('/auth/login', credentials, {withCredentials: true})
        return res
      } catch (err) {
        console.log(err)
        setError(err?.response.data)
        setIsAuthenticated(false)
      }
    }
    
    const submit = async(e) => {
      e.preventDefault();
      const response = await loginUser({username, passwd})
      console.log(response)
      if(response?.data.isAuthenticated){
        chatSocket.auth = {username}
        chatSocket.connect()
        setIsAuthenticated(response?.data.isAuthenticated)
      }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <h3>Username:</h3>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <h3>Password:</h3>
        <input
          type="password"
          value={passwd}
          onChange={(e) => setPasswd(e.target.value)}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;

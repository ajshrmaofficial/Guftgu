import { useContext, useState } from "react";
import chatSocket from "../utility/socket";
import  {UserContext}  from "../utility/Context";

const Login = () => {
  const [username, setUsername] = useState("");
  const [passwd, setPasswd] = useState("");
  const {isAuthenticated, setIsAuthenticated} = useContext(UserContext)

  const loginUser = async(credentials)=> {
    try {
        const res = await fetch('http://localhost:3000/auth/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(credentials)
        })
        return res.json()
      } catch (error) {
        console.log(error)
      }
    }
    
    const submit = async(e) => {
      e.preventDefault();
      const response = await loginUser({username, passwd})
      console.log(response)
      if(response?.isAuthenticated){
        chatSocket.auth = {username}
        chatSocket.connect()
      }
      setIsAuthenticated(response?.isAuthenticated)
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
    </div>
  );
};

export default Login;

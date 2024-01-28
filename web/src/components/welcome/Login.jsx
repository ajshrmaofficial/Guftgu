import { useContext, useEffect, useState } from "react";
import { setSocketUsername, connectChatSocket } from "../../utility/socket";
import authContext from "../../utility/authContext";
import server from "../../utility/serverConfig";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [passwd, setPasswd] = useState("");
  const [error, setError] = useState("");
  const { isAuthenticated, setIsAuthenticated } = useContext(authContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  const loginUser = async (credentials) => {
    try {
      const res = await server.post("/auth/login", credentials, {
        withCredentials: true,
      });
      return res;
    } catch (err) {
      console.log(err);
      setPasswd("");
      setUsername("");
      setError(err?.response.data);
      setIsAuthenticated(false);
    }
  };

  const submit = async (e) => {
    setError("");
    e.preventDefault();
    const response = await loginUser({ username, passwd });
    if (response?.status==200) {
      localStorage.setItem("userData", JSON.stringify({ username }));
      setSocketUsername(username);
      connectChatSocket();
      setIsAuthenticated(true);
    }
  };

  return (
    <div className="loginPage">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <h3>Username</h3>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <h3>Password</h3>
        <input
          type="password"
          value={passwd}
          onChange={(e) => setPasswd(e.target.value)}
          required
        />
        <br />
        {error && <p>{error}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;

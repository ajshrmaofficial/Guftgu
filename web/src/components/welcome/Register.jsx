import { useState, useEffect, useContext } from "react";
import server from "../../utility/serverConfig";
import authContext from "../../utility/authContext";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [passwd, setPasswd] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { isAuthenticated, setIsAuthenticated } = useContext(authContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  const registerUser = async (credentials) => {
    try {
      const res = await server.post("/auth/register", credentials);
      return res;
    } catch (err) {
      // console.log(err)
      setUsername("");
      setPasswd("");
      setError(err.response.data);
    }
  };

  const submit = async (e) => {
    setError("");
    e.preventDefault();
    const response = await registerUser({ username, passwd });
    if (response?.status == 201) {
      setUsername("");
      setPasswd("");
      setMessage(
        response.data +
          "\n" +
          "You are being redirected to login page in 3 seconds."
      );
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  return (
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
        {error && <p id="error">{error}</p>}
        {!error && message && <p id="registerMessage">{message}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Register;

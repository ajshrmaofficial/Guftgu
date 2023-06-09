import { Outlet, Link } from "react-router-dom";
import authContext from "../utility/authContext";
import { useEffect, useState } from "react";
import server from "../utility/serverConfig";
import { setSocketUsername, connectChatSocket } from "../utility/socket";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        const response = await server.get("/auth/isLoggedIn", {
          withCredentials: true,
        });
        if (response.data?.isLoggedIn) {
          const userData = JSON.parse(localStorage.getItem("userData"));
          setSocketUsername(userData.username);
          connectChatSocket();
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("userData");
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (!isAuthenticated) isLoggedIn();
  }, []);

  return (
    <authContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {/* <h1>App file</h1> */}
      
      <Outlet />
    </authContext.Provider>
  );
}

export default App;

import { useEffect, useState } from "react";
import { Outlet, redirect, useNavigate } from "react-router-dom";
import chatSocket from "../utility/socket";
import NavBar from "./NavBar";
import {UserContext} from "../utility/Context";
import Login from "./Login";

const App = () => {
  const navigate = useNavigate()
  const [isConnected, setIsConnected] = useState(chatSocket.connected);
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
			console.log("Connected to socket server")
    }

    function onDisconnect() {
      setIsConnected(false);
			console.log("Disconnected to socket server")
    }

    function onError(err) {
      setIsConnected(false);
      console.log(`Username error Log: ${err.message}`);
    }

    chatSocket.on("connect", onConnect);
    chatSocket.on("disconnect", onDisconnect);
    chatSocket.on("connect_error", (err) => {
      onError(err);
    });

    return () => {
      chatSocket.off("connect", onConnect);
      chatSocket.off("disconnect", onDisconnect);
      chatSocket.off("connect_error", onError);
    };
  }, []);

  if(!isAuthenticated){
    return <Login/>
  }

  return (
    <UserContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
    <NavBar isAuthenticated={isAuthenticated}/>
    <Outlet/>
    </UserContext.Provider>
  );
};

export default App;

import { useContext, useEffect, useState } from "react";
import { UserData } from "./Context";
import chatSocket from "../socket";
import Broadcaster from "./Broadcaster";

const App = () => {
  const [username, setUsername] = useState("");
  const [usernameSelected, setUsernameSelected] = useState(false);
  const [isConnected, setIsConnected] = useState(chatSocket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
			setUsernameSelected(true);
			console.log("Connected to socket server")
    }

    function onDisconnect() {
      setIsConnected(false);
			setUsernameSelected(false);
			console.log("Disconnected to socket server")
    }

    function onUsernameError(err) {
      setUsernameSelected(false);
      setIsConnected(false);
      console.log(`Username error Log: ${err.message}`);
    }

    chatSocket.on("connect", onConnect);
    chatSocket.on("disconnect", onDisconnect);
    chatSocket.on("connect_error", (err) => {
      onUsernameError(err);
    });

    return () => {
      chatSocket.off("connect", onConnect);
      chatSocket.off("disconnect", onDisconnect);
      chatSocket.off("connect_error", onUsernameError);
    };
  }, []);

  return (
    <UserData.Provider value={{ username, setUsername }}>
      {(isConnected && usernameSelected) ? <Broadcaster /> : <Login />}
    </UserData.Provider>
  );
};

const Login = () => {
  const user = useContext(UserData);

  const submit = (e) => {
    e.preventDefault();
		const username = user.username
    chatSocket.auth = { username };
    chatSocket.connect();
  };

  return (
    <>
       <h3>Login</h3>
      <input
        type="text"
        placeholder="Enter username"
        onChange={(e) => {
          user.setUsername(e.target.value);
        }}
      />
      <button onClick={submit}>Enter</button>
    </>
  );
};

export default App;

import { useContext, useEffect, useState } from "react";
import authContext from "../../utility/authContext";
import chatSocket from "../../utility/socket";
import "../../css/App.css"

const Mehfil = () => {
  const {isAuthenticated, setIsAuthenticated} = useContext(authContext)
  const [message, setMessage] = useState("");

  useEffect(() => {
    const onChat = ({message, fromID, fromUsername}) => {
      const messageList = document.querySelector("#messageList");
      const li = document.createElement("li");
      li.textContent = `#${fromUsername}: ` + message;
      messageList.appendChild(li);                         
    };

    chatSocket.on("chat message", onChat);
  
    return () => {
      chatSocket.off('chat message', onChat)
    }
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    chatSocket.emit("chat message", {message, fromID:chatSocket.id, fromUsername:chatSocket.auth.username});
    setMessage("")
  };

  return (
    <div>
      <h1>Guftgu</h1>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type Message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button type="submit">Send</button>
      </form>
      <ul id="messageList"></ul>
    </div>
  );
};

export default Mehfil;

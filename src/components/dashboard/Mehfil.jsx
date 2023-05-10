import { useContext, useEffect, useState } from "react";
import authContext from "../../utility/authContext";
import {chatSocket} from "../../utility/socket";
import "../../css/App.css"

const Mehfil = () => {
  const {isAuthenticated, setIsAuthenticated} = useContext(authContext)
  const [message, setMessage] = useState("");

  const assignMessage = ({fromUsername, recievedMessage}) => {
    const messageList = document.querySelector("#messageList");
      const li = document.createElement("li");
      li.textContent = `#${fromUsername}: ` + recievedMessage;
      messageList.appendChild(li);
  }

  useEffect(() => {
    const onChat = ({message, fromID, fromUsername}) => {
      if(fromID===chatSocket.id) return
      assignMessage({fromUsername, recievedMessage: message})
    };

    chatSocket.on("chat message", onChat);
  
    return () => {
      chatSocket.off('chat message', onChat)
    }
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    chatSocket.emit("chat message", message);
    assignMessage({fromUsername: chatSocket.auth.username, recievedMessage: message})
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

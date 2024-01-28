import { useContext, useEffect, useState } from "react";
import { chatSocket } from "../../utility/socket";
import "../../css/App.css";

const Mehfil = () => {
  const [message, setMessage] = useState("");

  const assignMessage = ({ fromUsername, recievedMessage }) => {
    const messageList = document.querySelector(".messagesContainer");
    const chat = document.createElement("div");
    chat.classList.add("chatMessage");

    const chatContent = document.createElement("span");
    const messageContent = document.createElement("p");

    if (fromUsername === chatSocket.auth.username)
      chatContent.classList.add("sentMessage");
    else {
      chatContent.classList.add("recievedMessage");
      const username = document.createElement("p");
      username.classList.add("username");
      username.textContent = fromUsername;
      chatContent.appendChild(username);
    }
    messageContent.textContent = recievedMessage;
    chatContent.appendChild(messageContent);
    chat.appendChild(chatContent);
    messageList.appendChild(chat);
    messageList.scrollTop = messageList.scrollHeight;
  };

  useEffect(() => {
    const onChat = ({ message, fromID, fromUsername }) => {
      assignMessage({ fromUsername, recievedMessage: message });
    };

    chatSocket.on("chat message", onChat);

    return () => {
      chatSocket.off("chat message", onChat);
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message) return;
    chatSocket.emit("chat message", message);
    setMessage("");
  };

  return (
    <div className="chatContainer">
      {/* <h1>Guftgu</h1> */}
      <div className="messagesContainer"></div>
      <div className="chatInput">
        <form onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type Message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          {/* <input type="submit" value=''/> */}
          <button type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Mehfil;

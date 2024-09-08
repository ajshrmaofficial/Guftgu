const { userModel } = require("../schema");
const { firebase } = require("../utils");
const socketAuth = require("./socketAuth");

const onlineUsers = new Map();

const sendNotification = async (
  messageBody,
  screen,
  toUsername,
  myUsername
) => {
  if (screen === "Mehfil") {
    //   const users = await userModel.find();
    const users = await userModel.find({ fcmToken: { $exists: true } });
    const tokens = users.map((user) => user.fcmToken);
    const message = {
      // notification: {
      //   title: 'New message in Mehfil',
      //   body: messageBody
      // },
      data: {
        screen: screen,
        message: messageBody,
      },
    };
    const messages = tokens.map((token) => ({
      ...message,
      token: token,
    }));
    const response = await firebase
      .messaging()
      .sendEachForMulticast({ messages });
    console.log(`${response.successCount} messages were sent successfully`);
    console.log(`${response.failureCount} messages failed to send`);
  } else if (screen === "Guftgu") {
    const findUser = await userModel.findOne({ username: toUsername });
    if (findUser && findUser.fcmToken) {
      console.log("sending fcm notification to ", toUsername);
      const messageData = {
        token: findUser.fcmToken,
        data: {
          screen: screen,
          message: messageBody,
          fromUsername: myUsername,
        },
      };
      firebase
        .messaging()
        .send(messageData)
        .then((response) => {
          console.log("Successfully sent message:", response);
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });
    }
  }
};

function reegisterEventHandlers(socket) {
  const socketDisconnected = () => {
    onlineUsers.delete(socket.username);
  };

  const socketIsOnline = (username) => {
    console.log(`Checking if ${username} is online`);
    if (users[username]) {
      socket.to(socket.username).emit("isOnline", { username, isOnline: true });
    } else {
      socket
        .to(socket.username)
        .emit("isOnline", { username, isOnline: false });
    }
  };

  const mehfilMessageReceived = (message) => {
    console.log(`Recieved message from ${socket.username}: `, message);
    //   sendNotification(message, 'Mehfil', '', myUsername); //TODO: Have to fix notifications at frontend...
    socket.broadcast.emit("mehfil", {
      message,
      fromID: socket.id,
      fromUsername: socket.username,
    });
  };

  const guftguMessageReceived = async (messageData, callback) => {
    const { message, toUsername } = messageData;

    console.log(
      `Recieved guftgu from ${socket.username} to ${toUsername}: `,
      message
    );
    //   sendNotification(message, 'Guftgu', toUsername, myUsername); //TODO: Have to fix notifications at frontend...
    if (users[toUsername]) {
      chatNamespace
        .to(toUsername)
        .emit("guftgu", { message, fromUsername: socket.username });
      callback({
        status: "received",
      });
    } else {
      const msg = new messageModel({
        sender: socket.username,
        receiver: toUsername,
        message,
      });
      await msg.save();
    }
  };

  const receivedSocketLocation = (location) => {
    console.log(`Location recieved from ${socket.username}: `, location);
    socket.broadcast.emit("location", {
      location,
      fromUsername: socket.username,
    });
  };

  return {
    socketDisconnected,
    socketIsOnline,
    mehfilMessageReceived,
    guftguMessageReceived,
    receivedSocketLocation,
  };
}

module.exports = (io) => {
  const chatNamespace = io.of("/chat");

  chatNamespace.use(socketAuth);

  chatNamespace.on("connection", (socket) => {
    const {
      socketDisconnected,
      socketIsOnline,
      mehfilMessageReceived,
      guftguMessageReceived,
      receivedSocketLocation,
    } = reegisterEventHandlers(socket);

    console.log(
      `A user connected to chat namespace: ${socket.id} ${socket.username}`
    );

    socket.use((packet, next) => {
      socketAuth(socket, next);
    });

    socket.join(socket.username);
    onlineUsers.set(socket.username, socket.username);

    socket.on("disconnect", socketDisconnected);

    socket.on("isOnline", socketIsOnline);

    socket.on("mehfil", mehfilMessageReceived);

    socket.on("guftgu", guftguMessageReceived);

    socket.on("location", receivedSocketLocation);

    socket.on("friendRequest:sent")
  });
};

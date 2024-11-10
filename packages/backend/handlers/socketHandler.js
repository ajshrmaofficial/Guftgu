// const { userModel } = require("../schema");
const { messageModel } = require("../schema");
// const { firebase } = require("../utils");
const socketAuth = require("./socketAuth");

const onlineUsers = new Set();

// const sendNotification = async (
//   messageBody,
//   screen,
//   toUsername,
//   myUsername
// ) => {
//   if (screen === "Mehfil") {
//     //   const users = await userModel.find();
//     const users = await userModel.find({ fcmToken: { $exists: true } });
//     const tokens = users.map((user) => user.fcmToken);
//     const message = {
//       // notification: {
//       //   title: 'New message in Mehfil',
//       //   body: messageBody
//       // },
//       data: {
//         screen: screen,
//         message: messageBody,
//       },
//     };
//     const messages = tokens.map((token) => ({
//       ...message,
//       token: token,
//     }));
//     const response = await firebase
//       .messaging()
//       .sendEachForMulticast({ messages });
//     console.log(`${response.successCount} messages were sent successfully`);
//     console.log(`${response.failureCount} messages failed to send`);
//   } else if (screen === "Guftgu") {
//     const findUser = await userModel.findOne({ username: toUsername });
//     if (findUser && findUser.fcmToken) {
//       console.log("sending fcm notification to ", toUsername);
//       const messageData = {
//         token: findUser.fcmToken,
//         data: {
//           screen: screen,
//           message: messageBody,
//           fromUsername: myUsername,
//         },
//       };
//       firebase
//         .messaging()
//         .send(messageData)
//         .then((response) => {
//           console.log("Successfully sent message:", response);
//         })
//         .catch((error) => {
//           console.log("Error sending message:", error);
//         });
//     }
//   }
// };

function registerEventHandlers(socket, chatNamespace) {
  const socketDisconnected = () => {
    console.log(`${socket.username} disconnected!!`);
    onlineUsers.delete(socket.username);
  };

  const socketIsOnline = (username) => {
    console.log(`Checking if ${username} is online`);
    if (onlineUsers.has(username)) {
      socket.to(socket.username).emit("isOnline", { username, isOnline: true });
    } else {
      socket
        .to(socket.username)
        .emit("isOnline", { username, isOnline: false });
    }
  };

  const groupChatMessageReceived = (message) => {
    console.log(`Received message from ${socket.username}: `, message);
    //   sendNotification(message, 'Mehfil', '', myUsername); //TODO: Have to fix notifications at frontend...
    socket.broadcast.emit("chat:group", {
      message,
      fromID: socket.id,
      fromUsername: socket.username,
    });
  };

  const personalChatMessageReceived = async (messageData, callback) => {
    const { message, toUsername } = messageData;

    console.log(
      `Recieved chat:personal from ${socket.username} to ${toUsername}: `,
      message
    );
    //   sendNotification(message, 'Guftgu', toUsername, myUsername); //TODO: Have to fix notifications at frontend...
    if (onlineUsers.has(toUsername)) {
      chatNamespace
        .to(toUsername)
        .emit("chat:personal", { message, fromUsername: socket.username });
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

  const friendRequestReceived = (friendRequest) => {
    const { friendUsername } = friendRequest;
    console.log(
      `Friend request received from ${socket.username} to ${friendUsername}`
    );
    chatNamespace.to(friendRequest).emit("friendRequest:received", {
      fromUsername: socket.username,
    });
  };

  const friendRequestAccepted = (friendRequest) => {
    const { friendUsername } = friendRequest;
    console.log(
      `Friend request accepted from ${socket.username} to ${friendUsername}`
    );
    chatNamespace.to(friendRequest).emit("friendRequest:accepted", {
      fromUsername: socket.username,
    });
  }

  return {
    socketDisconnected,
    socketIsOnline,
    groupChatMessageReceived,
    personalChatMessageReceived,
    receivedSocketLocation,
    friendRequestReceived,
    friendRequestAccepted
  };
}

module.exports = (io) => {
  const chatNamespace = io.of("/chat");

  chatNamespace.use(socketAuth);

  chatNamespace.on("connection", (socket) => {
    const {
      socketDisconnected,
      socketIsOnline,
      groupChatMessageReceived,
      personalChatMessageReceived,
      receivedSocketLocation,
      friendRequestReceived,
      friendRequestAccepted
    } = registerEventHandlers(socket, chatNamespace);

    console.log(
      `A user connected to chat namespace: ${socket.id} ${socket.username}`
    );

    socket.use((packet, next) => {
      socketAuth(socket, next);
    });

    socket.join(socket.username);

    onlineUsers.add(socket.username);

    socket.on("disconnect", socketDisconnected);

    socket.on("isOnline", socketIsOnline);

    socket.on("chat:group", groupChatMessageReceived);

    socket.on("chat:personal", personalChatMessageReceived);

    socket.on("location", receivedSocketLocation);

    socket.on("friendRequest:sent", friendRequestReceived);

    socket.on("friendRequest:accepted", friendRequestAccepted);
  });
};

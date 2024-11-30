const { userModel, messageModel } = require("../schema");
const socketAuth = require("./socketAuth");
const firebase = require("../utils/firebase")

// Cache FCM tokens to reduce DB queries
const tokenCache = new Map();
const CACHE_EXPIRY = 1000 * 60 * 30; // 30 minutes

// Notification queue for batching
const notificationQueue = new Map();
let notificationTimeout = null;
const NOTIFICATION_BATCH_DELAY = 1000; // 1 second
const MAX_BATCH_SIZE = 500;

const onlineUsers = new Set();

const getFCMToken = async (username) => {
  const cached = tokenCache.get(username);
  if (cached && cached.timestamp > Date.now() - CACHE_EXPIRY) {
    return cached.token;
  }

  const user = await userModel.findOne({ username }, { fcmToken: 1 });
  if (user?.fcmToken) {
    console.log('setting token in cache', username, user.fcmToken);
    tokenCache.set(username, { token: user.fcmToken, timestamp: Date.now() });
    return user.fcmToken;
  }
  return null;
};

const processBatchNotifications = async () => {
  const messages = Array.from(notificationQueue.values());
  notificationQueue.clear();
  notificationTimeout = null;

  if(messages.length === 0) return;

  const chunks = [];
  for (let i = 0; i < messages.length; i += MAX_BATCH_SIZE) {
    chunks.push(messages.slice(i, i + MAX_BATCH_SIZE));
  }

  try {
    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(async (msg) => {
          try {
            await firebase.messaging().send(msg);
            console.log(`Notification sent to ${msg.token}`);
          } catch (error) {
            console.error(`Failed to send notification: ${error.message}`, {
              token: msg.token,
              error
            });
            
            // Handle invalid tokens
            if (error.code === 'messaging/invalid-registration-token') {
              const username = msg.data.toUsername;
              await userModel.updateOne(
                { username },
                { $unset: { fcmToken: "" } }
              );
              tokenCache.delete(username);
            }
          }
        })
      );
    }
  } catch (error) {
    console.error('Batch processing error:', error);
  }
};

const queueNotification = async (data, toUsername, fromUsername, isGroupMessage = false) => {
  if (!toUsername || !fromUsername) {
    console.error('Missing username parameters');
    return;
  }
  const userToken = await getFCMToken(toUsername);
  if (!userToken) {
    console.log(`No valid FCM token for ${toUsername}`);
    return;
  }

  const notificationData = {
    token: userToken,
    notification: {
      title: isGroupMessage ? 'Group Message' : `Message from ${fromUsername}`,
      body: data.message,
    },
    // Move data to data field
    data: {
      screen: data.screen || 'None',
      type: data.type || 'misc',
      message: data.message,
      fromUsername,
      toUsername,
      isGroupMessage: isGroupMessage.toString(),
      timestamp: Date.now().toString(),
    },
    // Add Android specific config
    android: {
      priority: 'high',
      notification: {
        channelId: data.type === 'chat' ? 'chat' : 'default',
      },
    },
  };

  const queueKey = `${toUsername}-${Date.now()}`;
  notificationQueue.set(queueKey, notificationData);
  console.log(`Notification queued for ${toUsername} from ${fromUsername}`);

  if (!notificationTimeout) {
    notificationTimeout = setTimeout(processBatchNotifications, NOTIFICATION_BATCH_DELAY);
  }
};

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

  const groupChatMessageReceived = async (message) => {
    console.log(`Received message from ${socket.username}: `, message);
    socket.broadcast.emit("chat:group", {
      message,
      fromID: socket.id,
      fromUsername: socket.username,
    });

    // Batch notifications for offline users
    const offlineUsers = await userModel.find(
      { username: { $nin: Array.from(onlineUsers), $ne: socket.username } },
      { username: 1 }
    );

    offlineUsers.forEach(user => {
      queueNotification({
        screen: 'Mehfil',
        type: 'chat',
        message,
      }, user.username, socket.username, true);
    });
  };

  const personalChatMessageReceived = async ({ message, toUsername }) => {
    if (onlineUsers.has(toUsername)) {
      chatNamespace
        .to(toUsername)
        .emit("chat:personal", { message, fromUsername: socket.username });
    } else {
      const newMessage = await messageModel.create({
        sender: socket.username,
        receiver: toUsername,
        message,
      });
      newMessage.save();
    }

    await queueNotification({
      screen: 'Guftgu',
      type: 'chat',
      message,
    }, toUsername, socket.username)
  };

  const receivedSocketLocation = (location) => {
    console.log(`Location received from ${socket.username}: `, location);
    socket.broadcast.emit("location", {
      location,
      fromUsername: socket.username,
    });
  };

  const friendRequestReceived = async (friendRequest) => {
    const { friendUsername } = friendRequest;
    console.log(
      `Friend request received from ${socket.username} to ${friendUsername}`
    );
    
    chatNamespace.to(friendUsername).emit("friendRequest:received", {
      fromUsername: socket.username,
    });

    await queueNotification({
      message: `${socket.username} sent you a friend request`,
    }, friendUsername, socket.username);
  };

  const friendRequestAccepted = async (friendRequest) => {
    const { friendUsername } = friendRequest;
    console.log(
      `Friend request accepted from ${socket.username} to ${friendUsername}`
    );
    
    chatNamespace.to(friendUsername).emit("friendRequest:accepted", {
      fromUsername: socket.username,
    });

    await queueNotification({
      message: `${socket.username} accepted your friend request`,
    }, friendUsername, socket.username);
  };

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

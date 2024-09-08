const { userModel } = require('../schema');
const { firebase } = require('../utils');
const socketAuth = require('./socketAuth');

module.exports = (io) => {

    const chatNamespace = io.of("/chat");

    chatNamespace.use(socketAuth);

    const sendNotification = async (messageBody, screen, toUsername, myUsername) => {
        if(screen === 'Mehfil'){
        //   const users = await userModel.find();
        const users = await userModel.find({fcmToken: {$exists: true}});
        const tokens = users.map(user=>user.fcmToken);
          const message = {
            // notification: {
            //   title: 'New message in Mehfil',
            //   body: messageBody
            // },
            data: {
              screen: screen,
              message: messageBody
            },
          };
          const messages = tokens.map(token=>({
            ...message,
            token: token
          }));
          const response = await firebase.messaging().sendEachForMulticast({messages});
          console.log(`${response.successCount} messages were sent successfully`);
          console.log(`${response.failureCount} messages failed to send`);
        //   users.forEach(user => {
        //     if(user.fcmToken){
        //       messageData.token = user.fcmToken;
        //       firebase.messaging().send(messageData)
        //         .then((response) => {
        //           console.log('Successfully sent message:', response);
        //         })
        //         .catch((error) => {
        //           console.log('Error sending message:', error);
        //         });
        //     }
        //   });
          // firebase.messaging().sendEachForMulticast(messageData);
        } else if(screen === 'Guftgu'){
          const findUser = await userModel.findOne({username: toUsername});
          if(findUser && findUser.fcmToken){
            console.log('sending fcm notification to ', toUsername);
            const messageData = {
              token: findUser.fcmToken,
              // notification: {
              //   title: 'New message from ' + myUsername,
              //   body: messageBody
              // },
              data: {
                screen: screen,
                message: messageBody,
                fromUsername: myUsername
              },
            }
            firebase.messaging().send(messageData)
              .then((response) => {
                console.log('Successfully sent message:', response);
              })
              .catch((error) => {
                console.log('Error sending message:', error);
              });
          }
        }
      }
      
      const users = {};

      chatNamespace.on("connection", (socket) => {
        console.log(
          "Socket.io sessionID: " + JSON.stringify(socket.request.sessionID),
        );
        console.log(
          `A user connected to chat namespace: ${socket.id} ${socket.username}`,
        );

        socket.use((packet, next)=>{
            socketAuth(socket,next);
        })

        const myUsername = socket.username;
        socket.join(socket.username);
        users[socket.username] = socket.username;
      
        socket.on("disconnect", () => {
          console.log(`User ${socket.username} disconnected`);
          delete users[socket.username];
        });
      
        socket.on("isOnline", (username) =>{
          console.log(`Checking if ${username} is online`);
          if(users[username]){
            socket.to(socket.username).emit("isOnline", {username, isOnline: true});
          }
          else{
            socket.to(socket.username).emit("isOnline", {username, isOnline: false});
          }
        })
      
        socket.on("mehfil", (message) => {
          console.log(`Recieved message from ${socket.username}: `, message);
        //   sendNotification(message, 'Mehfil', '', myUsername); //TODO: Have to fix notifications at frontend...
          socket.broadcast.emit("mehfil", {
            message,
            fromID: socket.id,
            fromUsername: socket.username,
          });
        });
        socket.on("guftgu", async({ message, toUsername }, callback) => {
          console.log(
            `Recieved guftgu from ${socket.username} to ${toUsername}: `,
            message,
          );
        //   sendNotification(message, 'Guftgu', toUsername, myUsername); //TODO: Have to fix notifications at frontend...
          if(users[toUsername]){
          chatNamespace
            .to(toUsername)
            .emit("guftgu", { message, fromUsername: socket.username });
            callback({
                status: "received"
            })
          } else {
            const msg = new messageModel({sender: socket.username, receiver: toUsername, message});
            await msg.save();
          }
        });
        socket.on("location", (location) => {
          console.log(`Location recieved from ${socket.username}: `, location);
          socket.broadcast.emit("location", {
            location,
            fromUsername: socket.username,
          });
        });
      });
      
    //   chatNamespace.use((socket, next) => {
    //     const username = socket.handshake.auth.username;
    //     if (!username) {
    //       return next(new Error("invalid username"));
    //     }
    //     socket.username = username;
    //     next();
    //   }); // Redundant as using new socket auth logic :)
}

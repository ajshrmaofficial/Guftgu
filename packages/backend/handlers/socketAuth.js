// TODO: make a new folder middlewares and move all middlewares to middleware folder...
const jwt = require("jsonwebtoken");

module.exports = (socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.token;
  if (!token) {
    return next(new Error("Authentication error: Token is missing"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
    const {username} = decoded;
    socket.username = username;
    next();
  });
};

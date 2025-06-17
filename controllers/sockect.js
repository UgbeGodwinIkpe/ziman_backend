const onlineUsers = {};
const io = require('socket.io')(server); // Your socket.io setup

io.on('connection', (socket) => {
  socket.on('user-connected', (userId) => {
    onlineUsers[userId] = socket.id;
  });

  socket.on('disconnect', () => {
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
  });
});

module.exports = { io, onlineUsers };

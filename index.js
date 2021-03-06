const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3000;

app.use(express.static('public'));

let users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html")
});

io.on('connection', (socket) => {

    //Disconnect
    socket.on('disconnect', () => {
        socket.broadcast.emit('user disconnected', socket.nickname);
        users.splice(users.indexOf(socket.nickname), 1); //Remove from users array
        io.emit('update users', users, users.length);
    });

    //Sending chat message
    socket.on('chat message', (msg, room) => {
        let msgObject = {
            message: msg,
            user: socket.nickname,
            private: false,
        }
        if(room === ""){
            socket.broadcast.emit('chat message', msgObject);
        }else{
            msgObject.private = true;
            socket.to(room).emit('chat message', msgObject);
        }
    });

    //User nickname sent
    socket.on('choose nickname', function(nickname) {
        socket.nickname = nickname;

        users.push({username: socket.nickname, id: socket.id});
        console.log(users);

        io.emit('update users', users, users.length);
        socket.broadcast.emit('user joined', socket.nickname);
        
    });
});

server.listen(process.env.PORT || port, () => {
  console.log('listening on *:3000');
});

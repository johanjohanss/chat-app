const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('public'));

let users = [];
console.log("INIT USERS");

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html")
});

io.on('connection', (socket) => {

    console.log('a user connected');

    //Disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.broadcast.emit('user disconnected', socket.nickname);
        users.splice(users.indexOf(socket.nickname), 1); //Remove from users array
        io.emit('update users', users);
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

        //var destination = '/';
        //socket.emit('redirect', destination);
        //io.emit('update users', nickname);

        io.emit('update users', users);
        socket.broadcast.emit('user joined', socket.nickname);
        
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

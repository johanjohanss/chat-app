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
    //Check is socket.nickname != undefined
    //Then show login section on index page?
  res.sendFile(__dirname + "/index.html")
});
/*app.get('/login', (req, res) => {
    res.sendFile(__dirname + "/login.html")
});*/

io.on('connection', (socket) => {

    console.log('a user connected');
    //io.emit('update users', users);

    socket.on('disconnect', () => {
        console.log('user disconnected');
        users.splice(users.indexOf(socket.nickname), 1); //Remove from users array
        io.emit('update users', users);
    });

    socket.on('chat message', (msg) => {
        //io.emit('chat message', msg);
        let msgObject = {
            message: msg,
            user: socket.nickname
        }
        socket.broadcast.emit('chat message', msgObject);
    });

    //User nickname sent
    socket.on('choose nickname', function(nickname) {
        socket.nickname = nickname;

        users.push(socket.nickname);
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

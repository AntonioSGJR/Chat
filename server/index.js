const express = require('express');
const cors = require('cors');
const http = require('http');
const config = require('./config');
const { Server } = require('socket.io');

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: config.clientURL
    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.emit("your_id", socket.id);
    socket.on("send_message", (data) => {
        socket.to(data.actualRoom).emit("receive_message", {message: data.message, username: data.username});
        
    });

    socket.on("join_room", async (data) => {
        socket.data.username = data.username;
        socket.leave(data.previousRoom);
        socket.to(data.previousRoom).emit("user_out", data.username);
        socket.to(data.room).emit("new_user_in_room", data.username);
        socket.join(data.room);
        const sockets = await socket.in(data.room).fetchSockets()
        const socketsUsername = sockets.map((sok) => {
            if(socket.id !== sok.id) {return sok.data.username};
        });
        socket.emit("sockets_in_room", socketsUsername);
    });

    socket.on("user_in" , (data) => {
        socket.to(data.room).emit("user_out_message", {username: data.username, action: data.action});
    });

    socket.on("user_out" , (data) => {
        socket.to(data.room).emit("user_in_message", {username: data.username, action: data.action});
    });

});


server.listen(config.port, () => console.log(`Server running on ${config.hostUrl}`));
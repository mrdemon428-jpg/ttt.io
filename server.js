const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Serve your index.html file so players can load the game
app.use(express.static(__dirname));

// Listen for players connecting
io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);

    // Put players into a specific room (like 'public' or 'bot_server')
    socket.on('join-room', (roomCode) => {
        socket.join(roomCode);
        console.log(`Player ${socket.id} joined room: ${roomCode}`);
    });

    // When one player sends game data (moving, shooting), relay it to everyone else in that room
    socket.on('game-data', (data) => {
        socket.to(data.room).emit('game-data', data);
    });

    // When a player closes the tab
    socket.on('disconnect', () => {
        console.log('A player disconnected:', socket.id);
    });
});

// Start the server on port 3000
http.listen(3000, () => {
    console.log('Server is running! Open http://localhost:3000 in your browser.');
});
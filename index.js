const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
users = []
connections = []

server.listen(8000)

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})

io.sockets.on('connection', function(socket) {
    connections.push(socket)
    console.log('New connection: now %s connected', connections.length)

    // disconnection
    socket.on('disconnect', function() {
        if (socket.username) {
            users.splice(users.indexOf(socket.username), 1)
            updateUsernames()
        }
        connections.splice(connections.indexOf(socket), 1)
        console.log('Disconnection: now %s connected', connections.length)
    })

    // send message
    socket.on('send message', function (data) {
        io.sockets.emit('new message', {msg: data, username: socket.username})
    })

    // New User
    socket.on('new user', function(data, callback) {
            callback(true)
            socket.username = data
            users.push(socket.username)
            updateUsernames()
    })

    function updateUsernames() {
        io.sockets.emit('get users', users)
    }
})

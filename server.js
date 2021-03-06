const app = require("./app");
const socket = require('socket.io')

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 5005;

const server = app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});

const io = socket(server);

let onlineUsers = []

console.log(onlineUsers);

const addNewUser = (userId, userName, socketId) => {
    !onlineUsers.some(user => user.userId === userId) &&
        onlineUsers.push({ userId, userName, socketId })
}

const deleteUser = (socketId) => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socketId)
}

const logoutUser = (userId) => {
    onlineUsers = onlineUsers.filter(user => user.userId !== userId)
}

const getUser = userId => {
    return onlineUsers.find(user => user.userId === userId)
}

io.on('connection', (socket) => {

    socket.on('newUser', (userId, userName) => {
        console.log('Someone connected');
        userId && addNewUser(userId, userName, socket.id)
        console.log('onlineUsers from newUser', onlineUsers);
    })

    socket.on('sendNotification', ({
        senderId,
        senderName,
        receiverId,
        receiverName,
        type
    }) => {
        console.log('notification from ', senderName, 'to ', receiverName);
        const receiver = getUser(receiverId)
        io.to(receiver?.socketId).emit('getNotification', {
            senderId,
            senderName,
            receiverId,
            receiverName,
            type
        })
    })

    socket.on('logoutUser', (userId) => {
        console.log('user logs out');
        logoutUser(userId)
        console.log('onlineUsers from logout', onlineUsers);
    })


    socket.on('disconnect', () => {
        console.log('someone has left');
        deleteUser(socket.id)
        console.log('onlineUsers from disconnect', onlineUsers);
    })
})



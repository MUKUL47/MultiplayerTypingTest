const http = require('http').createServer(require('express')());
const io = require('socket.io')(http);
import TypeRacer from './TypeRacer';
const typeRacer = new TypeRacer();
io.on('connection', onConnection.bind(this))
http.listen(process.env.PORT || 3001)
function onConnection(socket){
    socket.on('RESET', data => {
        typeRacer = [];
        io.emit('RESET_DONE')
    })
    socket.on('CREATE_ROOM', data => {
        const roomName = data.roomName;
        const user = data.user;
        const resp = typeRacer.createRoom(roomName, user, -1, '', socket.id);
        if(typeof resp === 'string'){
            io.to(socket.id).emit('CREATE_ROOM_ERROR', { error : resp })
            return;
        }
        socket.join(roomName);
        io.to(socket.id).emit('CREATED_ROOM', { room : typeRacer.getRoom(roomName), message : 'A new room created!' })
    })

    socket.on('ENTER_ROOM', data => {
        const roomName = data.roomName;
        const user = data.user;
        const resp = typeRacer.enterRoom(roomName, user, socket.id);
        if(typeof resp === 'string'){
            io.to(socket.id).emit('ENTER_ROOM_ERROR', { error : resp })
            return
        }
        socket.to(roomName).emit('ENTERED_ROOM', { message : `${user} has joined the room!`, room : typeRacer.getRoom(roomName) })
    });

    
    socket.on('disconnect', onDisconnect.bind(this))
    socket.on('LEAVE_ROOM', onDisconnect.bind(this))
    function onDisconnect(){
        typeRacer.exitRoom()
        .emit('ENTERED_ROOM', { message : `${whoLeft} left the room!`, room : typeRacer[typeIdx] })
    }
}
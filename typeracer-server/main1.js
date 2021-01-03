const TypeRacer = require('./TypeRacer').TypeRacer;
const http = require('http').createServer(require('express')());
const io = require('socket.io')(http);
let typeRacer = new TypeRacer();
io.on('connection', onConnection.bind(this))
http.listen(process.env.PORT || 3001)
function onConnection(socket){
    socket.on('RESET', () => typeRacer = new TypeRacer())
    
    socket.on('CREATE_ROOM', data => {
        const roomName = data.roomName;
        const user = data.user;
        const max = data.maxParticipants;
        const paragraph = data.paragraph;
        const resp = typeRacer.createRoom(roomName, user, max, paragraph, socket.id);
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
        socket.join(roomName);
        const d = { message : `${user} has joined the room!`, room : typeRacer.getRoom(roomName) };
        socket.to(roomName).emit('ENTERED_ROOM', d)
        io.to(socket.id).emit('ENTERED_ROOM', d)
    });

    
    socket.on('disconnect', onDisconnect.bind(this))
    socket.on('LEAVE_ROOM', onDisconnect.bind(this))
    function onDisconnect(){
        const resp = typeRacer.exitRoom(socket.id);
        if(typeof resp === 'object'){
            socket.to(resp.room.roomName).emit('ENTERED_ROOM', resp)
        }
    }

    socket.on('READY_TOGGLE', () => {
        const resp = typeRacer.toggleRaceReady(socket.id);
        if(typeof resp === 'object'){
            socket.to(resp.room.roomName).emit('READY_TOGGLED', resp)
            io.to(socket.id).emit('READY_TOGGLED', resp)
        }
    })
    
    socket.on('ROOM_LOCK_TOGGLE', () => {
        const resp = typeRacer.toggleRoomLock(socket.id);
        if(typeof resp === 'object'){
            socket.to(resp.room.roomName).emit('ROOM_LOCK_TOGGLED', resp)
            io.to(socket.id).emit('ROOM_LOCK_TOGGLED', resp)
        }
    })

    socket.on('START_RACE', () => {
        const resp = typeRacer.startRace(socket.id);
        if(typeof resp === 'object'){
            socket.to(resp.room.roomName).emit('RACE_STARTED', resp)
            io.to(socket.id).emit('RACE_STARTED', resp)
            return
        }
        io.to(resp.room.roomName).emit('START_RACE_ERROR', resp)
    })

    socket.on('UPDATE_TYPE_PROGRESS', (data) => {
        const resp = typeRacer.updateTypeProgress(socket.id, data.percent);
        if(typeof resp === 'object'){
            socket.to(resp.room.roomName).emit('UPDATED_TYPE_PROGRESS', resp)
            io.to(socket.id).emit('UPDATED_TYPE_PROGRESS', resp)
            return
        }
        // io.to(resp.room.roomName).emit('START_RACE_ERROR', resp)
    })
}
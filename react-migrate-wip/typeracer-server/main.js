const http = require('http').createServer(require('express')());
const io = require('socket.io')(http);
let typeRacer = [];
io.on('connection', onConnection.bind(this))
http.listen(process.env.PORT || 3001)
function onConnection(socket){
    console.log(socket.id);
    socket.on('disconnect', () => {
      
    })
    socket.on('CREATE_ROOM', data => {
        const roomName = data.roomName;
        const user = data.user;
        if(typeRacer.find(racer => racer.roomName === roomName)){
            io.emit('CREATE_ROOM_ERROR', { error : 'Room exist', id : data.id, room : roomName })
            return;
        }
        typeRacer.push(
            {
                roomName : roomName,
                owner : user,
                maxParticipants : data.maxParticipants || -1,
                paragraph : data.paragraph,
                participants : [{
                    name : user,
                    isReady  : false,
                    progress : 0,
                    position : 0,
                    socketId : socket.id
                }]
            }
        )
        io.to(socket.id).emit('CREATED_ROOM', { id : data.id, room : roomName })
    })

    socket.on('ENTER_ROOM', data => {
        const roomName = data.roomName;
        const user = data.user;
        const room = typeRacer.find(racer => racer.roomName === roomName);
        if(!room){
            io.emit('ENTER_ROOM_ERROR', { error : 'Room not found', id : data.id , room : roomName})
            return;
        }
        else if(room.participants.find(participant => participant.name === user)){
            io.emit('ENTER_ROOM_ERROR', { error : 'Name already exist', id : data.id , room : roomName})
            return;
        }
        room.participants.push(
            {
                name : user, 
                isReady : false,
                progress : 0,
                position : room.participants.length
            }
        )
        io.emit('ENTERED_ROOM', { message : 'A new user joined', roomName : room.roomName, room : room })
    })

    socket.on('READY_PLAYER', data => {
        const roomName = data.roomName;
        const user = data.user;
        const room = typeRacer.find(racer => racer.roomName === roomName);
        if(!room){
            io.emit('READY_PLAYER_ERROR', { error : 'Room not found', id : data.id , room : roomName})
            return;
        }
        const currentUser = room.participants.find(p => p.name === user);
        if(currentUser){
            currentUser.isReady = true;
            io.emit('PLAYER_READY', { roomName : room.roomName, room : room })
            return
        }
    });

    socket.on('RESET', data => {
        typeRacer = [];
        io.emit('RESET_DONE')
    })
    socket.on('LOGOUT', data => {
        const roomName = data.roomName;
        const user = data.user;
        const roomIdx = typeRacer.findIndex(racer => racer.roomName === roomName);
        const room = room[roomIdx]
        if(!room){
            io.emit('LOGOUT_ERROR', { error : 'Room not found', id : data.id })
            return;
        }
        if(user === room.owner){
            if(room.participants.length === 1){
                delete room[roomIdx];
                io.emit('LOGOUT_DONE', { id : data.id, room : room })
                return;
            }
            room.owner = room.participants[1].name; //ownership moved to next guy
            room.participants.splice(0,1);
            io.emit('LOGOUT_DONE', { id : data.id, room : room })
            return;
        }
        const currentUserIdx = room.participants.findIndex(p => p.name === user);
        if(currentUserIdx > -1){
            room.participants.splice(currentUserIdx, 1);
        }
        io.emit('LOGOUT_DONE', { id : data.id, room : room })

    });

    // socket.on('UPDATE_PROGRESS', data => {
    //     const roomName = data.roomName;
    //     const user = data.user;
    //     const room = typeRacer.find(racer => racer.roomName === roomName);
    //     if(!room){
    //         io.emit('UPDATE_PROGRESS_ERROR', { error : 'Room not found', id : data.id })
    //         return;
    //     }
    // });

}
/**
 * {
    roomName : string,
    owner : string,
    maxParticipants : number,
    paragraph : string,
    
    participants : [
        {
            name : string,
            isReady : boolean,
            progress : number,
            position : number
        }
    ]
}

 */
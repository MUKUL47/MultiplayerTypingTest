const http = require('http').createServer(require('express')());
const io = require('socket.io')(http);
let typeRacer = [];
io.on('connection', onConnection.bind(this))
http.listen(process.env.PORT || 3001)
function onConnection(socket){
    console.log('connected ',socket.id);

    socket.on('RESET', data => {
        typeRacer = [];
        io.emit('RESET_DONE')
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
        io.to(socket.id).emit('CREATED_ROOM', { id : data.id, room : roomName, message : 'A new room created!' })
    })

    socket.on('ENTER_ROOM', data => {
        const roomName = data.roomName;
        const user = data.user;
        const room = typeRacer.find(racer => racer.roomName === roomName);
        if(!room){
            console.log('eroere',socket.id)
            io.to(socket.id).emit('ENTER_ROOM_ERROR', { error : 'Room not found'})
            return;
        }
        else if(room.participants.find(participant => participant.name === user)){
            io.to(socket.id).emit('ENTER_ROOM_ERROR', { error : 'Name already exist' })
            return;
        }
        room.participants.push(
            {
                name : user, 
                isReady : false,
                progress : 0,
                position : room.participants.length,
                socketId : socket.id
            }
        )
        room.participants.forEach(participant => io.to(participant.socketId).emit('ENTERED_ROOM', { message : `${user} has joined the room!`, room : room }))
    })
// assa
    socket.on('disconnect', onDisconnect.bind(this))
    socket.on('LEAVE_ROOM', onDisconnect.bind(this))
    function onDisconnect(){
        console.log('disconnect ',socket.id);
        let typeIdx, participantIdx;
        typeRacer.forEach((racer, i) => {
            const pIdx = racer.participants.findIndex(p => p.socketId === socket.id);
            if(pIdx > -1){
                typeIdx = i;
                participantIdx = pIdx
                return;
            }
        })
        if(typeIdx > -1 && participantIdx > -1){
            if(typeRacer[typeIdx].participants.length === 1){
                typeRacer.splice(typeIdx, 1)
                return;
            }
            const whoLeft = `${typeRacer[typeIdx].participants[participantIdx].name}`
            typeRacer[typeIdx].participants.splice(participantIdx, 1);
            typeRacer[typeIdx].owner = typeRacer[typeIdx].participants[0].name;
            typeRacer[typeIdx].participants.forEach(participant => {
                console.log('participant.socketId-',participant.socketId, typeRacer[typeIdx].participants.length)
                io.to(participant.socketId).emit('ENTERED_ROOM', { message : `${whoLeft} left the room!`, room : typeRacer[typeIdx] })
            })
        }
    }
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
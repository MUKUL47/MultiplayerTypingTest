class TypeRacer{
    constructor(){
        this.typeRacer = {}
    }
    //getters
    getRoom(roomName){
        return this.typeRacer[roomName]
    }

    //setters
    createRoom(roomName, owner, maxParticipant, parargraph, socketId){
        if(this.typeRacer[roomName]) return 'Room exist'
        this.typeRacer[roomName] = {
            roomName : roomName,
            owner : owner,
            maxParticipant : maxParticipant,
            parargraph : parargraph,
            started : false,
            locked : false,
            participants : [{
                name : owner,
                isReady : false,
                progress : 0,
                position : 0,
                socketId : socketId
            }]
        }
        return true
    }

    deleteRoom(roomName){
        delete this.typeRacer[roomName]
        return true
    }

    enterRoom(roomName, participant, socketId){
        if(!this.typeRacer[roomName]) return 'Room not found'
        else if(this.typeRacer[roomName].participants.find(p => p.name === participant)) return 'Name already exist'
        else if(this.typeRacer[roomName].started) return 'Type race is already running, come back later'
        else if(this.typeRacer[roomName].locked) return 'Room is locked'
        else if(this.typeRacer[roomName].maxParticipant == this.typeRacer[roomName].participants.length) return 'Room is full'
        this.typeRacer[roomName].participants.push({
            name : participant,
            isReady : false,
            progress : 0,
            position : this.typeRacer[roomName].participants.length,
            socketId : socketId
        })
        return true
    }

    exitRoom(socketId){
        const room = this.getRoomFromSocket(socketId)
        if(!room) return true
        const pIdx = room.participants.findIndex(p => p.socketId === socketId)
        if(pIdx > -1){
            if(room.participants.length === 1){
                this.deleteRoom(room.roomName)
                return true
            }
            const whoLeft = `${room.participants[pIdx].name}`
            room.participants.splice(pIdx, 1)
            room.owner = room.participants[0].name
            return { message : `${whoLeft} left the room!`, room : room }
        }
    }

    getRoomFromSocket(socketId){
        for(let room in this.typeRacer){
            if(this.typeRacer[room].participants.find(p => p.socketId === socketId)){
                return this.typeRacer[room]
            }
        }
        return null
    }

    toggleRoomLock(socketId){
        const room = this.getRoomFromSocket(socketId)
        if(!room) return 'Room not found'
        room.locked = !room.locked
        return { room : room }
    }
    
    toggleRaceReady(socketId){
        const room = this.getRoomFromSocket(socketId)
        if(!room) return 'Room not found'
        const participant = room.participants.find(p => p.socketId === socketId)
        if(!participant) return 'Participant not found'
        participant.isReady = !participant.isReady
        return { room : room }
    }

    startRace(socketId){
        const room = this.getRoomFromSocket(socketId)
        if(!room) return 'Room not found'
        const participant = room.participants.find(p => p.socketId === socketId)
        if(!participant) return 'Participant not found'
        if(participant.name !== room.owner) return 'Only admin can start the race'
        room.started = true
        return { room : room }
    }
}

exports.TypeRacer = TypeRacer

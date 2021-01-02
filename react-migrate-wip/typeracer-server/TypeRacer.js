export default class TypeRacer{
    constructor(){
        this.typeRacer = {};
    }
    //getters
    getRoom(roomName){
        return this.typeRacer[roomName]
    }

    //setters
    createRoom(roomName, owner, maxParticipant, parargraph, socketId){
        if(this.typeRacer[roomName]){
            return 'Room exist';
        }
        this.typeRacer[roomName] = {
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
        return true;
    }

    deleteRoom(roomName){
        delete this.typeRacer[roomName]
        return true;
    }

    enterRoom(roomName, participant, socketId){
        if(!this.typeRacer[roomName]){
            return 'Room not found';
        }
        else if(this.typeRacer[roomName].participants.find(p => p.name === participant)){
            return 'Name already exist';
        }
        else if(this.typeRacer[roomName].locked){
            return 'Room is locked';
        }
        else if(this.typeRacer[roomName].started){
            return 'Type race is already running, come back later';
        }
        this.typeRacer[roomName].participants.push({
            name : participant,
            isReady : false,
            progress : 0,
            position : this.typeRacer[roomName].participants.length,
            socketId : socketId
        })
        return true;
    }

    exitRoom(roomName, participantId){
        if(!this.typeRacer[roomName]){
            return 'Room not found';
        }
        const pIdx = this.typeRacer[roomName].participants.findIndex(p => p.socketId === participantId);
        if(pIdx > -1){
            if(this.typeRacer[roomName].participants.length === 1){
                this.deleteRoom(roomName)
                return;
            }
            const whoLeft = `${this.typeRacer[roomName].participants[participantId].name}`
            this.typeRacer[roomName].participants.splice(participantId, 1);
            this.typeRacer[roomName].owner = this.typeRacer[roomName].participants[0].name;
            return `${whoLeft} left the room!`;
        }
    }

    getRoomOfParticipant(roomName, type, value){
        
    }

    toggleRoomLock(roomName){
        if(!this.typeRacer[roomName]){
            return 'Room not found';
        }
        this.typeRacer[roomName].locked = !this.typeRacer[roomName].locked
    }

    startRace(roomName){
        if(!this.typeRacer[roomName]){
            return 'Room not found';
        }
        this.typeRacer[roomName].started = true
    }
}


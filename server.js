var exp = require('express')()
var http = require('http').createServer(exp);
var io = require('socket.io')(http);

let rooms = [], roomNames = [], users = [],
sampleText = "hey this is a typing app"
io.on('connection', (socket)=>{

    socket.on("createRoom", (msg)=>{
       let i = roomNames.indexOf(msg.roomName)
       if(i === -1){
        rooms.push([{ name : msg.roomName,
           users : [{ user : msg.firstUser, text : "-1", isReady : false, doneWithText : false, timeStamp : false }],
           participants : []}])
        roomNames.push(msg.roomName)
        users.push(msg.firstUser)
        io.emit('roomCreated',{ user : msg.firstUser , updatedContent : false });
       }else{
           io.emit("createRoomError",{ user : msg.firstUser})
       }
    })

    socket.on("enterRoom", (msg)=>{
        let i = roomNames.indexOf(msg.roomName),
        u = users.indexOf(msg.user)
        if( i === -1 || u > -1){
            io.emit('invalidRoom', { user : msg.user });
        }else{            
            rooms[i][0].users.push({ user : msg.user, text : "" })
            users.push(msg.user)
            io.emit('roomEntered', 
            { user : msg.user, rooms : rooms[i][0].users.length, updatedContent : rooms[i][0].users });
        }
    })

    socket.on("updateText", (msg)=>{
        let i = roomNames.indexOf(msg.roomName),
        user = rooms[i][0].users.map( v => v.user ).indexOf(msg.user)
        rooms[i][0].users[user].text = msg.text         
        if(!rooms[i][0].users[user].doneWithText){
            if(sampleText === msg.text){
                let tS = 
                (Date.now() - rooms[i][0].users[user].timeStamp)/1000   
                rooms[i][0].participants.push(msg.user+"_"+tS)
                rooms[i][0].users[user].doneWithText = true       
                io.emit('winner',{ 
                    room : msg.roomName,
                    participants : rooms[i][0].participants
               });                        
            }else{
                io.emit('updatedText',{ 
                    room : msg.roomName,
                    updatedContent : rooms[i][0].users
               });
            }
        }        
    })

    socket.on("updateTimeStamp",(msg)=>{
        let i = roomNames.indexOf(msg.roomName)
        for( let j = 0; j < rooms[i][0].users.length; j++ ){
            rooms[i][0].users[j].timeStamp = Date.now()
        }
    })

    socket.on("ready", (msg)=>{
        let i = roomNames.indexOf(msg.roomName),
        user = rooms[i][0].users.map( v => v.user ).indexOf(msg.user)
        rooms[i][0].users[user].isReady = true
         io.emit('userReady',{ 
             room : msg.roomName,
             updatedContent : rooms[i][0].users
             });
        if( rooms[i][0].users.map( v => v.isReady ).indexOf(false) === -1
        &&  rooms[i][0].users.length > 1 ){
            io.emit('started',{ room : msg.roomName });
        }
    })

    socket.on('logout', (msg)=>{
        let i = roomNames.indexOf(msg.roomName),
        user = rooms[i][0].users.map( v => v.user ).indexOf(msg.user)
        rooms[i][0].users.splice(user,1)
        users.splice(users.indexOf(msg.user),1)
        console.log(JSON.stringify(rooms))        
    });    

});
http.listen(process.env.PORT || 1000)
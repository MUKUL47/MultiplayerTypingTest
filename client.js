var socket = io("http://localhost:1000");

$("#race").hide();
$("#message").hide();
$("#logout").hide();
$("#target").hide();
let showField = false

let cU = "",
    cR = "";

$("#createRoom").click(()=>{
  let roomName = $("#createRoomName").val().trim(),
  name = $("#firstName").val().trim()
  if( roomName.length > 0 && 
    name.length > 0     
      ){
      socket.emit('createRoom', {
        roomName : roomName,
        firstUser : name
      });        
  }
})

socket.on('createRoomError',(m)=>{
  if( $("#firstName").val().trim() == m.user ){    
  alert("room exist!")
  }
});

socket.on('roomCreated',(m)=>{
  console.log(m)
  if( $("#firstName").val().trim() == m.user ){    
  alert("room created!")
  cU = m.user
  cR = $("#createRoomName").val().trim()
  $("#race").show();
  $("#roomContent").text("")  
    $("#roomContent").
    append(`YOU) NOT READY`)
    $("#login").hide();  
    $("#logout").show();
  }  
});

socket.on('invalidRoom',(m)=>{
  if( $("#name").val().trim() == m.user ){    
  alert("ROOM doesnt exist or USER exist ")
  }
});

socket.on('roomEntered',(m)=>{
  if( $("#name").val().trim() == m.user ){    
    alert(`Welcome total users : ${m.rooms}`)
    cU = m.user
    cR =  $("#roomName").val().trim()
    $("#race").show();
    $("#roomContent").text("")  
    m.updatedContent.map( v => 
    $("#roomContent").
    append(`${v.user == cU ? "YOU" : v.user}) 
    ${!v.isReady ? "NOT READY" : "READY"}<br/>` ))      
    $("#login").hide();
    $("#logout").show();  
  }
});


$("#enter").click(()=>{
  let roomName = $("#roomName").val().trim(),
  name = $("#name").val().trim()
  if( roomName.length > 0 && 
    name.length > 0     
      ){
      socket.emit('enterRoom', {
        roomName : roomName,
        user : name
      });        
  }
})

$( "#message" ).keyup(()=>{
  console.log($("#message").val())
          socket.emit('updateText', {
            roomName : cR,
            user : cU,
            text : $("#message").val().trim()
          });             
})

socket.on('updatedText',(m)=>{
  if( m.room === cR ){  
    $("#roomContent").text("")  
      m.updatedContent.map( v => 
      $("#roomContent").
      append(`${v.user}) ${v.text}<br/>` ))      
  }
});

$("#ready").click(()=>{
          socket.emit('ready', {
            roomName : cR,
            user : cU
          });             
})

socket.on('userReady',(m)=>{
  if( m.room === cR ){  
    $("#roomContent").text("")  
      m.updatedContent.map( v => 
      $("#roomContent").
      append(`${v.user == cU ? "YOU" : v.user}) 
      ${!v.isReady ? "NOT READY" : "READY"}<br/>` ))
  }
});

socket.on('started',(m)=>{
  if(m.room === cR){
    $("#ready").hide()
    timer(5)
  }
})

$("#logout").click(()=>{
  logout()
})

socket.on('winner',(m)=>{
  if( m.room === cR ){  
    $("#whoWon").text("")  
    $("#whoWon").append("WINNERS<br/>").append(
  m.participants.map((v,i) => `${i+1}) ${v.split("_")[0]} took ${v.split("_")[1]} seconds<br/>`)
      )   
  }
});


function logout(){
  socket.emit('logout', {
    roomName : cR,
    user : cU
  });
  $("#login").show();  
  $("#race").hide();
  $("#message").hide();
  $("#logout").hide();
  showField = false
  cU = "",
  cR = "";
}

function timer(n){
  setTimeout(()=>{
    if( n > -1 ){
        $("#timer").text(`Starts in ${n} seconds`);
        timer(n-1)
    }else{ 
        $("#message").show()
        $("#target").show();
        $("#timer").text("")
        $("#roomContent").text("")
        socket.emit('updateTimeStamp', {roomName : cR});   
    }
},1000)
}
// Including libraries
var express = require("express");
var app = express();
var server = app.listen(3000);
var io = require("socket.io")(server);

var UUID = require('node-uuid');
var verbose = false;

// Routing
app.use(express.static("public"));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


var clients = [];
var challenge_on = false;

// Listen for incoming connections from clients
io.sockets.on("connection", function(socket) {
  console.log("Someone connected");
  
  // Start listening for mouse move events
  socket.on("mousemove", function(data) {
    // This line sends the event (broadcasts it)
    // to everyone except the originating client.
    socket.broadcast.emit("moving", data);
  });

  //Generate a new UUID, looks something like 
  //5b2ca132-64bd-4513-99da-90e838ca47d1
  //and store this on their socket/connection
  socket.userid = UUID();
  clients.push(socket);
            
  //tell the player they connected, giving them their id
  socket.emit('onconnected', { id: socket.userid } );
            
  //Useful to know when someone connects
  console.log('\t socket.io:: player ' + socket.userid + ' connected');

  
  socket.on('start', function(){
    console.log("Creating a challenge");
    challenge_on = true;
    var data = {challenge : create_challenge(), id : clients[random_integer(clients.length)].userid};
    console.log(data.challenge.name);
    io.sockets.emit('set challenge', data);
    console.log("Emitted a challenge to " + data.id);
  })

  socket.on('end', function(newblockpositions){
    challenge_on = false;
    socket.broadcast.emit('end', newblockpositions);
  })
                   
  
  //When this client disconnects
  socket.on('disconnect', function () {
      //Useful to know when someone disconnects
      console.log('\t socket.io:: client disconnected ' + socket.userid );
  }); //client.on disconnect

});

//var shapes = ["square", "rectangle", "sphere"];
var challenges = [{name:"T", blocks:{rectangle:5}}];

var create_challenge = function(){
  var challenge = {}; 
  var c = challenges[random_integer(challenges.length)];

  var avail_pos = []; 
  for(var i = 0; i < 9; i++){
    for(var j=0; j<9; j++){
      avail_pos.push([i, j]);
    }
  }
  
  challenge.name = c.name; 
  challenge.blockpositions = [];
  for(var shape in c.blocks){
    for(var k=0; k<c.blocks[shape]; k++){
      var n = random_integer(avail_pos.length);
      var pos = avail_pos[n];
      avail_pos.splice(n, 1);
      challenge.blockpositions.push([pos[0], pos[1], 0, shape]);
    }
  }

  console.log(challenge);

  //challenge.blockpositions = {rectangle:[[1, 2], [2, 5], [1, 4], [4, 5], [7, 8]]};

  return challenge;
}

var random_integer = function(limit){
  return Math.floor(Math.random() * limit);
}
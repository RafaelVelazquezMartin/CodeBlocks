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
                    
  //When this client disconnects
  socket.on('disconnect', function () {
      //Useful to know when someone disconnects
      console.log('\t socket.io:: client disconnected ' + socket.userid );
  }); //client.on disconnect

});

// Including libraries
var express = require("express");
var app = express();
var server = app.listen(3000);
var io = require("socket.io")(server);

// Routing
app.use(express.static("public"));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// Listen for incoming connections from clients
io.sockets.on("connection", function(socket) {
  console.log("SOmeone connected");

  // Start listening for mouse move events
  socket.on("mousemove", function(data) {
    // This line sends the event (broadcasts it)
    // to everyone except the originating client.
    socket.broadcast.emit("moving", data);
  });
});

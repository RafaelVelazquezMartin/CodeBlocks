var socket = io.connect("/");
//Now we can listen for that event
socket.on("onconnected", function(data) {
  //Note that the data is the object we sent from the server, as is. So we can assume its id exists.
  console.log(
    "Connected successfully to the socket.io server. My server side ID is " +
      data.id
  );
});

var num_of_objects = 2;
var instructions = [];
for (i = 0; i < num_of_objects; i++) {
  instructions[i] = [];
}

function allowDrop(ev) {
  ev.preventDefault();
  var pos = ev.target.id.split(",");
  pos[1] = Math.min(pos[1], instructions[pos[0]].length);
  var str = pos[0] + "," + pos[1];
  document.getElementById(str).parentElement.style.border = "2px solid yellow";
}

function dragLeave(ev) {
  var pos = ev.target.id.split(",");
  pos[1] = Math.min(pos[1], instructions[pos[0]].length);
  var str = pos[0] + "," + pos[1];
  document.getElementById(str).parentElement.style.border = "2px solid black";
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var pos = ev.target.id.split(",");
  pos[1] = Math.min(pos[1], instructions[pos[0]].length);
  var str = pos[0] + "," + pos[1];
  document.getElementById(str).innerHTML = data;
  instructions[pos[0]][pos[1]] = data;
  document.getElementById(str).parentElement.style.border = "2px solid black";
}

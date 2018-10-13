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
  if (data == "rotate_right") {
    document.getElementById(str).innerHTML = "refresh";
    document.getElementById(str).style = "";
  } else if (data == "rotate_left") {
    document.getElementById(str).innerHTML = "refresh";
    document.getElementById(str).style = "transform: scale(-1, 1)";
  } else {
    document.getElementById(str).innerHTML = data;
    document.getElementById(str).style = "";
  }
  instructions[pos[0]][pos[1]] = data;
  document.getElementById(str).parentElement.style.border = "2px solid black";
}

var grid = [];

window.onload = function() {
  var canvas = document.getElementById("paper");
  var context = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;

  for (var x = 0; x < width; x += width / 9) {
    context.moveTo(x, 0);
    context.lineTo(x, height);
  }

  for (var y = 0; y < height; y += height / 9) {
    context.moveTo(0, y);
    context.lineTo(width, y);
  }

  context.strokeStyle = "black";
  context.stroke();
};

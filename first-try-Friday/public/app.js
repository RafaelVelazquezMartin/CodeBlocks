var canvas;
var context;
var width;
var height;

//window.onload = function() {
  canvas = document.getElementById("paper");
  context = canvas.getContext("2d");
  width = canvas.width;
  height = canvas.height;

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
//};


var socket = io.connect("/");
var id;

//Now we can listen for that event
socket.on("onconnected", function(data) {
  //Note that the data is the object we sent from the server, as is. So we can assume its id exists.
  console.log(
    "Connected successfully to the socket.io server. My server side ID is " +
      data.id
  );

  id = data.id;
});

socket.on('set challenge', function(data){
  if(data.id == id){
    alert("Move the objects on the grid to form a " + data.challenge.name);
    var elements = document.getElementsByClassName("instruction");
    for(var j=0; j<elements.length; j++){
      elements[j].style = "pointer-events : auto; opacity : 1.0";
    }
  }
  else{
    var elements = document.getElementsByClassName("instruction");
    for(var j=0; j<elements.length; j++){
      elements[j].style = "pointer-events : none; opacity : 0.4";
    }
  }

  for(shape in data.challenge.blockpositions){
    var positions = data.challenge.blockpositions[shape];
    for(var k = 0; k < positions.length; k++){
      var x0 = positions[k][0];
      var y0 = positions[k][1]; 
      
      switch(String(shape)){
        case "rectangle" : context.fillRect(width/9 * x0, height/9 * y0, width/9 , height/9 );
      }
      
    }
  }
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
  showDelete(str);
  document.getElementById(str).innerHTML = data;
  document.getElementById(str).style = "";
  instructions[pos[0]][pos[1]] = data;
  document.getElementById(str).parentElement.style.border = "2px solid black";
  console.log(instructions);
}

function deleteInstruction(ev) {
  ev.preventDefault();
  var icon =
    ev.target.parentElement.previousElementSibling.previousElementSibling;
  console.log(icon);

  icon.innerHTML = "";
  var pos = icon.id.split(",");
  pos[1] = Math.min(pos[1], instructions[pos[0]].length);
  var str = pos[0] + "," + pos[1];
  instructions[pos[0]].splice(pos[1], 1);
  console.log(instructions);
  updateInstructions(instructions[pos[0]], pos[0]);
}

function updateInstructions(instruc = null, index = null) {
  var tmp = document.getElementsByClassName("instruction-list");
  var tmp2 = tmp[index].children;
  let i = 0;
  for (let ins of instruc) {
    tmp2[i].firstElementChild.innerHTML = ins;
    i++;
  }
  tmp2[i].firstElementChild.innerHTML = "";
  hideDelete(`${index},${i}`);
}

function showDelete(id) {
  document.getElementById(
    id
  ).nextElementSibling.nextElementSibling.style.display = "block";
}

function hideDelete(id) {
  document.getElementById(
    id
  ).nextElementSibling.nextElementSibling.style.display = "none";
}




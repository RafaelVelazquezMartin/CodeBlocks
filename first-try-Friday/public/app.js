var canvas;
var context;
var width;
var height;

//window.onload = function() {
canvas = document.getElementById("paper");
context = canvas.getContext("2d");
width = canvas.width;
height = canvas.height;

var draw_grid = function() {
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

draw_grid();
//};

var socket = io.connect("/");
var id;
var blockpositions = [];

//Now we can listen for that event
socket.on("onconnected", function(data) {
  //Note that the data is the object we sent from the server, as is. So we can assume its id exists.
  console.log(
    "Connected successfully to the socket.io server. My server side ID is " +
      data.id
  );

  id = data.id;
});

socket.on("set challenge", function(data) {
  if (data.id == id) {
    alert("Move the objects on the grid to form a " + data.challenge.name);
    var elements = document.getElementsByClassName("instruction");
    for (var j = 0; j < elements.length; j++) {
      elements[j].style = "pointer-events : auto; opacity : 1.0";
    }
    document.getElementById("start-btn").style =
      "pointer-events : none; opacity : 0.4";
    document.getElementById("stop-btn").style =
      "pointer-events : auto; opacity : 1";
  } else {
    alert("One of the players is drawing.");
    var elements = document.getElementsByClassName("instruction");
    for (var j = 0; j < elements.length; j++) {
      elements[j].style = "pointer-events : none; opacity : 0.4";
    }
    document.getElementById("start-btn").style =
      "pointer-events : none; opacity : 0.4";
    document.getElementById("stop-btn").style =
      "pointer-events : none; opacity : 0.4";
  }

  blockpositions = data.challenge.blockpositions;
  draw_blocks(blockpositions);
});

socket.on("end", function(newblockpositions) {
  blockpositions = newblockpositions;
  draw_blocks(blockpositions);
  // alert("Guess what the shape is.");
  $(document).ready(function() {
    $(".modal").modal("open");
  });
  document.getElementById("start-btn").style =
  "pointer-events : auto; opacity : 1";
});

var start = function() {
  socket.emit("start");
};

var end = function() {
  blockpositions = exec_instructions(instructions, blockpositions);
  draw_blocks(blockpositions);
  socket.emit("end", blockpositions);
  document.getElementById("start-btn").style =
  "pointer-events : auto; opacity : 1";
  document.getElementById("stop-btn").style =
  "pointer-events : none; opacity : 0.4";
};

var draw_blocks = function(bpos) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  draw_grid();

    for (var k = 0; k < bpos.length; k++) {
      var x0 = bpos[k][0];
      var y0 = bpos[k][1];
      
      context.fillStyle = "black";
      switch (String(bpos[k][3])) {
        case "rectangle":
          context.fillRect(
            (width / 9) * x0,
            (height / 9) * y0,
            width / 9,
            height / 9
          );
      }
      
      context.fillStyle = "white";
      context.font = "bold 16px Arial";
      context.fillText(k+1, (width / 9) * (x0 +0.5), (height / 9) * (y0 +0.5) );
      
    }
  
};

var exec_instructions = function(instructions, bpos) {
  for(var item=0; item<num_of_objects; item++){
    for(var i=0; i < instructions[item].length; i++){
      switch(instructions[item][i]){
        case "arrow_back": {
          //alert("arrow_back");
          if(bpos[item][0] != 0){
            bpos[item][0] -= 1;
          }
          //alert(bpos[item]);
          break;
        }
        case "arrow_forward": {
          //alert("arrow_fwd");
          if(bpos[item][0] != 8){
            bpos[item][0] +=1;
          }
          //alert(bpos[item]);
          break;
        }
        case "arrow_upward": {
          //alert("arrow_up");
          if(bpos[item][1] != 0){
            bpos[item][1] -=1;
          }
          //alert(bpos[item]);
          break;
        }
        case "arrow_downward" : {
          //alert("arrow_up");
          if(bpos[item][1] != 8){
            bpos[item][1] += 1;
          }
          //alert(bpos[item]);
          break;
        }
      }
    }
  } 

  return bpos;
};

var num_of_objects = 5;
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
  // console.log(instructions);
}

function deleteInstruction(ev) {
  ev.preventDefault();
  var icon =
    ev.target.parentElement.previousElementSibling.previousElementSibling;
  // console.log(icon);

  icon.innerHTML = "";
  var pos = icon.id.split(",");
  pos[1] = Math.min(pos[1], instructions[pos[0]].length);
  var str = pos[0] + "," + pos[1];
  instructions[pos[0]].splice(pos[1], 1);
  // console.log(instructions);
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

function showModal() {
  $(".modal").modal();
}

$(document).ready(function() {
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $(".modal").modal();
});

document.getElementById("test").innerHTML = "WebSocket is not connected";

var websocket = new WebSocket('ws://'+location.hostname+'/');
/*
var slider = document.getElementById("myRange");

slider.oninput = function () {
  websocket.send("L" + slider.value);
}
*/
function sendMsg() {
  websocket.send('L50');
  console.log('Sent message to websocket');
}

function sendText(text) {
  websocket.send("M" + text);
}

websocket.onopen = function(evt) {
  console.log('WebSocket connection opened');
  websocket.send("It's open! Hooray!!!");
  document.getElementById("test").innerHTML = "WebSocket is connected!";
}

websocket.onmessage = function(evt) {
  var msg = evt.data;
  var value;
  var logData = evt.data.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&¤\*\(\)-_=\+;:<>\/\\\|\}\{\[\]\n\r`~]*/g, '');
  var json = JSON.parse(logData);
  var ar = json.data.split("[0m");
  var color = "white";
  ar.forEach(function(line) {
    var output;
    line = line.replace("[0m", "");
    line = line.replaceAll("", "");

    if(line.includes("[0;32m")) {
      line = line.replace("[0;32m", "");
      color = "green";
    } else if(line.includes("[0;31m")) {
      line = line.replace("[0;31m", "");
      color = "red";
    } else if(line.includes("[0;33m")) {
      line = line.replace("[0;33m", "");
      color = "yellow";
    } else {
      color = "white";
    }
    output = "<span style=\"color:"+ color +";\">" + line + "</span>";
    document.getElementById("output").innerHTML += output;
  })
}

websocket.onclose = function(evt) {
  console.log('Websocket connection closed');
  document.getElementById("test").innerHTML = "WebSocket closed";
}

websocket.onerror = function(evt) {
  console.log('Websocket error: ' + evt);
  document.getElementById("test").innerHTML = "WebSocket error????!!!1!!";
}

$(document).ready(function(){
  $.get(
      "network",
      function(data) {
         //document.getElementById("datamodel").innerHTML = JSON.stringify(data, null, 2);
         console.log(data);
         renderjson.set_show_to_level(3);
         document.getElementById("container").appendChild(renderjson(data));
      }
  );
});

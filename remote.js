let auto_scroll_check, checkboxPlaying
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

function clickEnable() {
  /*
  fetch("http://localhost/state/406d9c22-43df-4d83-0c98-40151aa19cbb",{
    method: 'PUT',
    mode: 'no-cors',
    headers:{
      'Content-Type':'application/json',
      'Access-Control-Allow-Origin': 'http://localhost',
      'Access-Control-Allow-Methods' : 'GET, POST, OPTIONS',
    },
    body: JSON.stringify(todo set data)
  }).then(response=>{
    return response.json()
  }).then(data=>
    console.log(data)
  );
*/
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
    var jsondata;
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
    jsondata = "<span style=\"color:"+ color +";\">" + line + "</span>";
    document.getElementById("debug_log").innerHTML += jsondata;
  })
  //window.scrollTo(0,document.logstyle.scrollHeight);
  if(auto_scroll_check.checked) {
    $("#debug_log").scrollTop($("#debug_log")[0].scrollHeight);
  }
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
  document.getElementById("test").innerHTML = "WebSocket is not connected";

  auto_scroll_check = document.getElementById('switch-scroll');

/*
  enableButton = document.getElementById("switch-enable");
  enableButton.addEventListener('click', clickEnable);
*/

  $.get(
      "network",
      function(data) {
         //document.getElementById("datamodel").innerHTML = JSON.stringify(data, null, 2);
         console.log(data);
         //data.device[0].value[5]
         renderjson.set_show_to_level(0);
         document.getElementById("datamodel").appendChild(renderjson(data));
      }
  );
});

let auto_scroll_check, checkboxPlaying;
let enable_uuid_control, enable_uuid_report;
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
  var body_data = '0';
  if(enableButton.checked) {
    body_data = '1';
  }
  fetch("/state/"+enable_uuid_control,{
    method: 'PUT',
    headers:{
      'Content-Type':'application/json',
    },
    body: JSON.stringify({'data': body_data})
  }).then(response=>{
    return response.json()
  }).then(data=>
    console.log(data)
  );
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

  enableButton = document.getElementById("switch-enable");
  enableButton.checked = false;
  enableButton.addEventListener('click', clickEnable);

  auto_scroll_check = document.getElementById('switch-scroll');

  gpio0Button = document.getElementById("switch-gpio0");
  gpio0Button.disabled = true;

  $.get(
      "network",
      function(data) {
         //document.getElementById("datamodel").innerHTML = JSON.stringify(data, null, 2);
         console.log(data);

         for(var i=0; i< data.device[0].value.length; i++) {
            if(data.device[0].value[i].name == "DBG Enable") {
              for(var s=0; s<data.device[0].value[i].state.length; s++ ) {
                if(data.device[0].value[i].state[s].type == "Control") {
                  enable_uuid_control = data.device[0].value[i].state[s].meta.id;
                  if(data.device[0].value[i].state[s].data == "1") {
                    enableButton.checked = true;
                  }
                } else if(data.device[0].value[i].state[s].type == "Report") {
                  enable_uuid_report = data.device[0].value[i].state[s].meta.id;
                }
              }
            }
         }
         renderjson.set_show_to_level(0);
         document.getElementById("datamodel").appendChild(renderjson(data));
      }
  );

});

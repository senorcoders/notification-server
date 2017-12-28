// Websocket Server for mobile notifications 1.0
// This connects devices to the server allowing
// for instant notifications
// SenorCoders - Kharron Reid Dec 2017
// Added an http server for over the internet calls Dec 2017

const express = require('express');
const http = require('http');
const url = require('url');
var WebSocketServer = require("websocketserver");
var api = require("./api");
const app = express();
var port = 8088
app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!');
});
cors = require('cors');

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Add necessary middleware
app.use(cors(corsOptions));
app.use(express.urlencoded());


var ws = new WebSocketServer("all", 5000);

console.log("Lets start!");
var connectionList = [];
var uidList = new Object;
ws.on("connection", function(id) {
  connectionList.push(id);
	console.log("Connected: ", id);
	ws.sendMessage("one", "This is your server", id);
});

function getMessages(){
  var message;

  // calls api for ux events
  api.getNotifications(uid,function(message){
    console.log(message);
    message = JSON.stringify(message);
//      ws.sendMessage("one",message,id);
    ws.sendMessage("one",message, uidList(uid));
  });
}
// Incoming Message from device
ws.on("message", function(data, id) {
	var mes = ws.unmaskMessage(data);
	var str = ws.convertToString(mes.message);
  console.log("From ID: ", id)
  console.log("Message: ", str);

  // Use a try / catch in case we don't get JSON from device
  try
  {
    // convert string to JSON
    fromDevice = JSON.parse(str);

    // Each message must have an action
    var action = fromDevice[0]['action'];
    console.log("Action: ", action);

    // action sendid
    if (action == "sendid"){
      var uid = fromDevice[0]['uid'];
      console.log("UID: ", uid);
      uidList[uid] = id;
    }
    // perform action for device
    if (action == "getMessages"){
      //Retrieve Followers for twitter
      var uid = fromDevice[0]['uid'];
      getMessages(uid);
    }
    if (action == "testTweet"){
      console.log("Testing Tweet");
      // Users that follow a twitter handle
      // calls api for list of uids that follow twitter handle
      tHandle = "SenSherrodBrown";
      api.getUsersTwitter(tHandle,function(tList){
        var tweepsArr = tList['twitters_ids'];
        for (tid in tweepsArr){
          uid = tweepsArr[tid];
          ws.sendMessage("one", tweet, uidList[uid]);
        }
      //      ws.sendMessage("one",message,id);
      });
      
    }
  }
  catch(e)
  {
    // nothing
  }

});


ws.on("closedconnection", function(id) {
	console.log("Connection " + id + ": has left the server");
});


// Create routes for twitter subscription server
// Example handle SenSherrodBrown
app.post('/gettweet', function(request, response){
  if (request.body.tweet){
    if (request.body.screen_name && request.body.tweet){
      let tHandle = request.body.screen_name;;
      let tweet = request.body.tweet;
      console.log("We've got a tweet");
      console.log("Tweet: ", tweet.text);

      // Users that follow a twitter handle
      // calls api for list of uids that follow twitter handle
      api.getUsersTwitter(tHandle,function(tList){
        var tweepsArr = tList['twitters_ids'];

        // Send connected users a tweet
        for (tid in tweepsArr){
          uid = tweepsArr[tid];
          ws.sendMessage("one", tweet, uidList[uid]);
          // Update db with tweet event
        }
      });
    }
    
  }

});


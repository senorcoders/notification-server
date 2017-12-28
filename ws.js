// Websocket Server for mobile notifications 1.0
// This connects devices to the server allowing
// for instant notifications
// SenorCoders - Kharron Reid Dec 2017
//

const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
var api = require("./api");

const app = express();

app.use(function (req, res) {
    res.send({ msg: "hello" });
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {

  // Device connection initiated
	let ip = req.connection.remoteAddress;
	console.log("Device Connected! to ip: " + ip);

  // Messages Received from Devices
	ws.on('message', function incoming(message) {
	      console.log('received: %s', message);
    var msg = JSON.parse(message);
    console.log(msg);
    var action = msg[0]['action'];
    var uid = msg[0]['uid'];
    console.log("USER ID: ", uid);
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(uid);
      }else{
        console.log("Client: " + client.readyState);
      }
    });

    // calls api for ux events
    api(uid,function(message){
      console.log(message);
      message = JSON.stringify(message);
      ws.send(message);
    });

	
	});


});

server.listen(8087, function listening() {
    console.log('Listening on %d', server.address().port);
});

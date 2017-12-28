var express = require('express');
var app = express();
const https = require("https");
const url = "https://maps.googleapis.com/maps/api/geocode/json?address=Florence"; 

app.listen(5000, function () {
	console.log('Dev app listening on port 5000!');
});
    // Our first route
app.get('/', function (req, res) {
	https.get(url, res => {
		res.setEncoding("utf8");
		let body = "";
		res.on("data", data => {
			body += data;
		});
		res.on("end", () => {
			body = JSON.parse(body);
			console.log(body);
		});
	});

});




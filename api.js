/*
 * Notifications api for Rally App
 * Kharron Reid @ senorcoders Dec 2017
 */

const https = require("https");


/*
 * Retrieves list of notifications for one users
 *
 */

function getNotifications(uid, callback){
	var result = https.get('https://api.provethisconcept.com/api/ux_event?user_id=' + uid, (res) => {
		console.log(res.statusCode);
		let mes = "";
		res.on("data",data => {
			mes += data;
		});
		res.on("end", () => {
//			console.log(mes);
			callback(JSON.parse(mes));
		});
	});
	return result;
}

/*
 * Retrieves list of users for a specific twitter handle
 *
 */
function getUsersTwitter(twitteruser, callback){
  var result = https.get('https://api.provethisconcept.com/rallyapi/twitter_follower_reps/' + twitteruser, (res) => {
    console.log("StatusCode: ",res.statusCode);
    let mes = "";
    res.on("data",data => {
      mes += data;
    });
    res.on("end", () => {
      callback(JSON.parse(mes));
    });
  });
}

module.exports.getNotifications = getNotifications;
module.exports.getUsersTwitter = getUsersTwitter;


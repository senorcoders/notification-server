Notifications server specifically built for Rally App
Created by Kharron Reid of SenorCoders
Dec 2017


Install:
npm install

Receiving Tweets
receive tweets from a subscription server via post
/getweet

tweet is sent in the body and read by the notifications
server.  At which point a list of relevant users are 
created from the twitter handle


Get Notifications
Each device can request an updated list of notifications
through the websocket server

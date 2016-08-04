var login = require("facebook-chat-api");
var fs = require("fs");
var textrank = require("./textrank.js");

var username = fs.readFileSync('username.txt', 'utf8');
var password = fs.readFileSync('password.txt', 'utf8');

var FB_EMAIL = username;
var FB_PASSWORD = password;


login({email: FB_EMAIL, password: FB_PASSWORD}, function callback (err, api) {
    if(err) return console.error(err);
 	
    api.setOptions({listenEvents: true, selfListen: true});
 	var rawText = [];
 	var senderDict = {};
 	var threadDict = {}; 
    var stopListening = api.listen(function(err, event) {
        if(err) return console.error(err);
 		
        switch(event.type) {
          	case "message":
	            if(event.body === '/summarizepls') {
	              	api.sendMessage("Ok...", event.threadID);
	              	for (var key in senderDict) {
	              		if (senderDict.hasOwnProperty(key)) {
						    console.log(key);
						}
	              	}
	              	for (var key2 in threadDict) {
	              		if (senderDict.hasOwnProperty(key2)) {
						    console.log(key2);
						}
	              	}
	              	var result = textrank.summarizeText(rawText);
	              	api.sendMessage(result, event.threadID);
	              	//console.log("Summary of backlog: " + result);
	              	return stopListening();
	            }
	            // I'm not sure when to split a sentence. Whether by punctuation enders or the end of a message
	            // For now its the end of a message
	            rawText.push(event.body);
	            if (event.senderID in senderDict) {
	            	senderDict[event.senderID].push(event.body);
	            } else {
	            	senderDict[event.senderID] = [event.body];
	            }
	            if (event.threadID in threadDict) {
	            	threadDict[event.threadID].push(event.body);
	            } else {
	            	threadDict[event.threadID] = [event.body];
	            }
	            break;
	        case "event":
	            rawText.push(event.logMessageType + ", " + event.logMessageBody);
	            break;
        }
    });
});



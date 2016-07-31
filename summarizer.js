// MAKE SURE TO TURN TO EMRTY STRINGS WHEN COMMITTING
var FB_EMAIL = "";
var FB_PASSWORD = "";














//Found a way to use synchronous with generators. Read file, check if parameters filled,
//access cache

var login = require("facebook-chat-api");
var fs = require("fs");
var textrank = require("./textrank.js");

//Eventually want to change to take backlog and even summarize other ppls messgae

login({email: FB_EMAIL, password: FB_PASSWORD}, function callback (err, api) {
    if(err) return console.error(err);
 
    api.setOptions({listenEvents: true, selfListen: true});
 	var rawText = [];
    var stopListening = api.listen(function(err, event) {
        if(err) return console.error(err);
 		
        switch(event.type) {
          	case "message":
	            if(event.body === '/summarizepls') {
	              	api.sendMessage("Ok...", event.threadID);
	              	var result = textrank.summarizeText(rawText);
	              	api.sendMessage(result, event.threadID);
	              	return stopListening();
	            }
	            // I'm not sure when to split a sentence. Whether by punctuation enders or the end of a message
	            // For now its the end of a message
	            var msg = event.body.split(".");
	            rawText.push(msg);
	            break;
	        case "event":
	            rawText.push(event.logMessageType);
	            rawText.push(event.logMessageBody);
	            break;
        }
    });
});



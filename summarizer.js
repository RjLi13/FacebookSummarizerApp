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
    var stopListening = api.listen(function(err, event) {
        if(err) return console.error(err);
 		
        switch(event.type) {
          	case "message":
	            if(event.body === '/summarizepls') {
	              	api.sendMessage("Ok...", event.threadID);
	              	var result = textrank.summarizeText(rawText);
	              	api.sendMessage(result, event.threadID);
	              	//console.log(result);
	              	return stopListening();
	            }
	            // I'm not sure when to split a sentence. Whether by punctuation enders or the end of a message
	            // For now its the end of a message
	            rawText.push(event.body);
	            break;
	        case "event":
	            rawText.push(event.logMessageType + ", " + event.logMessageBody);
	            break;
        }
    });
});



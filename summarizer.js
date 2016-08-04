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
          		if (event.body) {
		            if(event.body === '/summarizepls') {
		              	api.sendMessage("Ok...", event.threadID);
		              	api.getUserInfo(Object.keys(senderDict), function(err, info) {
		              		if(err) return console.error(err);
		      				// console.log(senderDict);
		      				// console.log(threadDict);
		              		var userDict = {};
			              	for (var key in senderDict) {
			              		if (senderDict.hasOwnProperty(key)) {
								    if (key in info) {
								    	userDict[info[key]["name"]] = senderDict[key];
								    }
								}
			              	}
			              	// console.log(userDict);
			    			var result = "";
			              	var resultsArr = textrank.summarizeText(rawText);
			              	// console.log("Debug information: Not necessary to read");
			              	// console.log(resultsArr);
			              	var currentName = "";
			              	var currentThread = "";
			              	for (var i = 0; i < resultsArr.length; i++) {
				              	for (var thread in threadDict) {
				              		if (threadDict.hasOwnProperty(thread)) {
			              				for (var k = 0; k < threadDict[thread].length; k++) {
			              					if (resultsArr[i] === threadDict[thread][k]) {
			              						if (currentThread != thread) {
			              							result += "\n\nThread num: " + thread + "\n";
			              							currentThread = thread;
			              						}
			        							break;
			              					}
			              				}
			      						break;
			      					}
			      				}
	              				for (var user in userDict) {
				              		if (userDict.hasOwnProperty(user)) {
			              				for (var j = 0; j < userDict[user].length; j++) {
				              				if (resultsArr[i] === userDict[user][j]) {
				              					if (currentName != user) {
					              					result += user + " said: ";
													currentName = user;
												}
												result += resultsArr[i];
												result += "\n";
												break;
				              				}
										}
										break;
			              			}
			              		}
			              	} 
			              	// api.sendMessage(result, event.threadID);
			              	console.log("\nTo look for which thread, go to messenger.com and look at url, the number is the threadID.\n");
			              	console.log("Summary of backlog: " + result);
			              	rawText = [];
			              	senderDict = {};
 							threadDict = {};
		              	});
		              	//For only running program once
		              	// return stopListening();
		            }
		            rawText.push(event.body);
		            // console.log(rawText);

		            var msgArrSender = event.body.split(/[\\.!\?]/).filter(Boolean);
		            var msgArrThread = event.body.split(/[\\.!\?]/).filter(Boolean);
		            // console.log("Event.senderID: " + event.senderID);
		            // console.log("Event.threadID: " + event.threadID);
		            if (event.senderID in senderDict) {
		            	var sendArr = senderDict[event.senderID]
		            	// console.log(sendArr);
		            	sendArr.push.apply(sendArr, msgArrSender);
		            } else {
		            	senderDict[event.senderID] = msgArrSender;
		            }
		            // console.log(senderDict);
		            if (event.threadID in threadDict) {
		            	var threadArr = threadDict[event.threadID]
		            	// console.log(threadArr);
		            	threadArr.push.apply(threadArr, msgArrThread);
		            } else {
		            	threadDict[event.threadID] = msgArrThread;
		            }
		            // console.log(threadDict);
		        } else {
		        	console.log("Sorry we don't support whatever is being sent");
		        }
		        break;
	        case "event":
	        	if (event.logMessageType && event.logMessageBody) {
	            	rawText.push(event.logMessageType + ", " + event.logMessageBody);
	            } else if (event.logMessageBody) {
	            	rawText.push(event.logMessageBody);
	            } else if (event.logMessageType) {
	            	rawText.push(event.logMessageType);
	            } else {
	            	console.log("Sorry we don't support whatever is being sent");
	            }
	            break;
        }
    });
});



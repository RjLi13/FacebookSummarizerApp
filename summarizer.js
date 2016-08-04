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
		     //          	console.log("senderDict");
		     //          	for (var key in senderDict) {
		     //          		if (senderDict.hasOwnProperty(key)) {
							//     console.log(key);
							// }
		     //          	}

		              	api.getUserInfo(Object.keys(senderDict), function(err, info) {
		              		if(err) return console.error(err);
		      //         		console.log("senderDict in needed");
		              		var userDict = {};
			              	for (var key in senderDict) {
			              		if (senderDict.hasOwnProperty(key)) {
								    if (key in info) {
								    	userDict[info[key]["name"]] = senderDict[key];
								    }
								}
			              	}
			              	// console.log("userDict in needed");
			              	// for (var key2 in userDict) {
			              	// 	if (userDict.hasOwnProperty(key2)) {
			              	// 		console.log(userDict[key2]);
			              	// 	}
			              	// }
			    			var result = "";
			              	var resultsArr = textrank.summarizeText(rawText);
			              	console.log("Debug information: Not necessary to read");
			              	console.log(resultsArr);
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
	              				for (var key3 in userDict) {
				              		if (userDict.hasOwnProperty(key3)) {
			              				for (var j = 0; j < userDict[key3].length; j++) {
				              				if (resultsArr[i] === userDict[key3][j]) {
				              					if (currentName != key3) {
					              					result += key3 + " said: ";
					              					result += resultsArr[i];
													result += "\n";
													currentName = key3;
												} else {
													result += resultsArr[i];
													result += "\n";
												}
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
		              	});
		              	return stopListening();
		            }
		            // I'm not sure when to split a sentence. Whether by punctuation enders or the end of a message
		            // For now its the end of a message
		            rawText.push(event.body);
		            var msgArr = event.body.split(/[\\.!\?]/).filter(Boolean);
		            if (event.senderID in senderDict) {
		            	senderDict[event.senderID].push.apply(senderDict[event.senderID], msgArr);
		            } else {
		            	senderDict[event.senderID] = msgArr;
		            }
		            if (event.threadID in threadDict) {
		            	threadDict[event.threadID].push.apply(threadDict[event.threadID], msgArr);
		            } else {
		            	threadDict[event.threadID] = msgArr;
		            }
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



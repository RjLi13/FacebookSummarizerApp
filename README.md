# FacebookSummarizerApp

Tired of reading a backlog of messages? Then this app would work prefectly for you! This application summarizes the messages your friends say to you from the point where you run the application up til you type the command to summarize the backlog of messages you missed.

It requires node module and facebook-chat-api module. First it reads the username.txt and password.txt for facebook credentials, then it logins into facebook in the background, waits and listens to messages on the current thread you are on, until you type "/summarizepls", which then allows it to summarize all the messages it listened to using a summarizer algorithm more naive then the textrank algorithm. Then it prints that message into the thread.

This application is built using Facebook Chat API https://github.com/Schmavery/facebook-chat-api/blob/master/DOCS.md#getThreadList and the algorithm elaborated here: https://thetokenizer.com/2013/04/28/build-your-own-summary-tool/, which itself was based on Textrank.

I implemented the algorithm listed in the url, but with a few additional changes. First I picked the most important sentence from a paragraph. To do this, I recognized a paragraph as a single message with 2 or more sentences and separated sentences by punctuation. Then given these important sentences, I took the current number of sentences/3 top ranked sentences and built a message around it to send.

Try it out today!

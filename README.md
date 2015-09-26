# Designing Video Interfaces

Designing Video Interfaces is a Database includes 42 Interaction Design Patterns that describe common solutions of recurring problems in the design and development of video learning environments. 
In addition more then 100 video learning environments have been described, categorized and examplified by screenshots. Within each video environemnt user interface elements have been analyzed to be an evidence and example for the Interavction Design Patterns. 
Interaction Design Patterns of Video Learning Environments including a comprehensive database of video applications.


# Aims

Currently the patterns as well as the application database is work in progress. It is my aim to combine the patterns in a book.

Beside that the application is going to be an example for a pattern database. Users are supported when selecting patterns and when they want to get some inspiration about how others solved a certain problem.


# Install instructions

## Initial setup
* git clone https://github.com/nise/designing-video-interfaces
* sudo npm install etherpad-lite-client express express-validator mongodb path socket.io node-fs csv node-schedule ejs-locals passport passport-local connect-flash canvas identicon mongoose csv mv async cookie-parser express-json body-parser method-override express-session
* mongorestore --db video-patterns ./dump/video-patterns
* sudo forever start -a -l forever.log -o out.log -e err.log server.js
* sudo forever stop server.js

## Update from repo
git fetch --all
git reset --hard origin/master

## dump and restore mongoDB
mongodb: mongodb://localhost/video-patterns
**dump**
mongodump --db video-patterns
**restore**
mongorestore --db video-patterns ./dump/video-patterns



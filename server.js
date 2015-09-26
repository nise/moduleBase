/*
author: niels.seidel@nise81.com
titel: video pattern and application database
description: 
**/


require( './db' );

var
	compression = require('compression') 
	express = require('express'),
	expressValidator = require('express-validator'),
	app = express(),
	path = require('path'),
	flash = require('connect-flash'),
	server = require('http').createServer(app),
	fs = require('node-fs'),

	// database entities
	videos = require('./routes/videos'),
	users = require('./routes/users'),
	images = require('./routes/images'),
	scripts = require('./routes/scripts'),
	portals = require('./routes/portals'),
	patterns = require('./routes/patterns'),
	analysis = require('./routes/analysis'),
		
	groups = require('./routes/groups'),
	// terzin specific entities
	scenes = require('./routes/scenes'),
	persons = require('./routes/persons')
	;
	

	
	//io.set('transports', ['websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
	var port = 3000;
	server.listen(port);
	server.setMaxListeners(0); // xxx: untested: unfinite number of listeners, default: 10;
	// http://nodejs.org/docs/latest/api/events.html#events_emitter_setmaxlisteners_n
	
console.log('\n\n************************************************');
console.log('Started server on port: '+ port);	
console.log('************************************************\n\n');

	
	exports.getServer = function ( req, res ){
		return server;
	};

/* configure application **/
  app.set('port', process.env.PORT || port);
  app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
	app.use(compression())
	
  app.use(express.static(path.join(__dirname, 'public')));
	app.set('views', __dirname + '/public/vi-lab/views');
	app.set('view engine', 'ejs');
	app.engine('ejs', require('ejs-locals'));
		
	var cookieParser = require('cookie-parser');
	app.use(cookieParser());
//	app.use(express.cookieSession({ secret: 'tobo!', maxAge: 360*5 }));
		
	var json = require('express-json');
	app.use( json());
	
	var bodyParser = require('body-parser');
	app.use(expressValidator());	
	app.use( bodyParser.urlencoded({ extended: true }));
	app.use( bodyParser.json());
		
	var methodOverride = require('method-override');
	app.use( methodOverride());
		
	var session = require('express-session');
	app.use(session({
	  secret: 'keyb22oar4d cat', 
	  saveUninitialized: true,
	  resave: true
    }));
	
	app.use(flash());
	app.use(users.passport.initialize());
	app.use(users.passport.session());
	//app.use(app.router);
	app.set("jsonp callback", true); // ?????

	


/* ACL */
//

var mongoose = require( 'mongoose' );
var conn = mongoose.connect( 'mongodb://localhost/video-patterns' , function(err, db){
	if(err){
		console.log(err);
	}else{
		/*
		Import data
		**/
		// !!! do not!! portals.csvImport();
		// !!! caution images.folderImport();
		//patterns.folderImport();
		
		// ANALYSES
		/*analysis.getInstancesOfPattern(0);
		analysis.getInstancesOfPattern(1);
		analysis.getInstancesOfPattern(2);
		analysis.getInstancesOfPattern(3);
		analysis.getInstancesOfPattern(4);
		analysis.getInstancesOfPattern(5);
		analysis.getInstancesOfPattern(6);
		analysis.getInstancesOfPattern(7);
		analysis.getInstancesOfPattern(8);
		analysis.getInstancesOfPattern(9);*/
		
		//////analysis.getInstancesOfPattern();
		//analysis.getPatternsPerPortals();
		//analysis.getTagCoOccurences({},{});
		//analysis.getPatternCoOccurences({},{});
		////analysis.getPortalCoOccurences();
		
		// buggg xxx analysis.getMissingPatterns();
		
		//analysis.renderPortalDataLatex();
		//analysis.test2();
		
		//users.csvImport();
		//scenes.csvImport();
		//videos.csvImport(); // !!! caution
		
		//scripts.importScript();
		//groups.csvImport();
		//groups.csvImportFromJSON();
		//require('./routes/etherpad').generatePadGroups(); // !!!
		var ACL = require('./routes/aclrouts')(db, app, io);
	}	
});


// test: $ node process-2.js one two=three four
/*process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});*/










/* 
Setup socket.io 
**/
//io.set('heartbeat interval', 1);
//io.set('transports', ['xhr-polling']);
//{ rememberTransport: false, transports: ['WebSocket', 'Flash Socket', 'AJAX long-polling'] }).listen(server),
io = require('socket.io')(server);
io.sockets.on('connection', function (socket) {
	
  socket.on("disconnect", function(){
  	//console.log("ping : user disconnect");
  });
	 
	  
	/*
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
	  console.log(data);
	});
	*/
	
	//socket.broadcast.emit('user connected');
	
	/*
	socket.on('registered user', function(data) {
		console.log('socket.io:: User has registered');
		socket.broadcast.emit('broadcast-user-online', data); 
	});
	
	socket.on('updated video', function (data) {
		//console.log('socket.io:: update info eingegangen ' + data.videoid);
		console.log('video updated at client')
	  socket.broadcast.emit('broadcast',{hello: 'world2'}); 
	});*/
});



/*var io = require('socket.io').listen(80);

io.sockets.on('connection', function (socket) {
  socket.join('justin bieber fans'); // put socket in a channel
  socket.broadcast.to('justin bieber fans').emit('new fan'); // broadcast a message to a channel
  io.sockets.in('rammstein fans').emit('new non-fan'); // to another channel
});*/

exports.socketio = function (event, data){
	var io = require('socket.io')(server); 
	io.sockets.on('connection', function (socket) {
		switch(event){
			case "user.connected" :
				socket.broadcast.emit( event, {user: data[0].id, online:true } );
				//require('routes/users').setOnlineStatus({params:{ id: data[0].id}, body:{online_status:true, online_location:'index'}}, {});
				break;
			case "user.disconnected" :
				socket.broadcast.emit( event, {user: data.id, online:false } );
				//require('routes/users').setOnlineStatus({params:{ id: data[0].id}, body:{online_status:true, online_location:'index'}}, {});
				break;	
		}	
		
		socket.on('updated video', function (data) {
			//console.log('socket.io:: update info eingegangen ' + data.videoid);
			console.log('video updated at client');
		});	
	});					
}						


// 
//var lec = require('./utils/lecturnity');






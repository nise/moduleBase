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
	fs = require('node-fs')
	;
	
	// database entities 
	/*
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
	*/

	
	//io.set('transports', ['websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
	var port = 3003;
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
//	app.use(users.passport.initialize());
//	app.use(users.passport.session());
	//app.use(app.router);
	app.set("jsonp callback", true); // ?????

	


/* ACL */
var mongoose = require( 'mongoose' );
var conn = mongoose.connect( 'mongodb://localhost/moduleBase' , function(err, db){
	if(err){
		console.log(err);
	}else{
		/*
		Import data
		**/
		m = require('./routes/modules');
		m.csvImport();
		
		// routes
		app.get(	'/data/json/modules', m.getJSON );
		app.get(	'/data/csv/modules', m.getCSV );
		app.get(	'/modules/list', function ( req, res ){ res.render( 'm_modules', { title : 'Modules' }); });
		
		//var ACL = require('./routes/aclrouts')(db, app, io);
	}	
});






/*
 * author: niels.seidel@nise81.com
 * titel: moduleBase
 * description: 
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
	m = require('./routes/modules')
	users = require('./routes/users')
	;
	
	var port = 3003;
	server.listen(port);
	server.setMaxListeners(0); 

	
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
	app.set('views', __dirname + '/public/static/views');
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
	app.set("jsonp callback", true); 




/* ACL */
var mongoose = require( 'mongoose' );
var conn = mongoose.connect( 'mongodb://localhost/moduleBase' , function(err, db){
	if(err){
		console.log(err);
	}else{
		/*
		Import initial data
		**/
		//m.importTags({}, m.importMetadata );
		//m.getTagVectors(); // builts matrix of tags and module numbers
		//users.csvImport();
		
		/*
		 * Define HTTP routes
		 **/ 
		app.get(	'/', function ( req, res ){ res.render( 'index', { title : '',
			  user: req.user !== undefined ? req.user : 'null' }); });
		app.get(	'/home', function ( req, res ){ res.render( 'index', { title : '',
			  user: req.user !== undefined ? req.user : 'null' }); });
		app.get(	'/api', function ( req, res ){ res.render( 'api', { title : '',
			  user: req.user !== undefined ? req.user : 'null' }); });
		app.get(	'/about', function ( req, res ){ res.render( 'about', { title : 'About',
			  user: req.user !== undefined ? req.user : 'null' }); });
		app.get(	'/impressum', function ( req, res ){ res.render( 'impressum', { title : 'Impressum',
			  user: req.user !== undefined ? req.user : 'null' }); });
		app.get(	'/data/json/modules', m.getJSON );
		app.get(	'/data/json/modules/tag/:id', m.getJSONbyTag );
		app.get(	'/json/modules/field-schema', m.getFieldSchema );
		app.get(	'/json/modules/similar/:id', m.getSimilarModulesJSON );
		app.get(	'/data/csv/modules', m.getCSV );
		app.get(	'/modules/tag-schema', m.getTagSchema );
		app.get(	'/modules/list', m.index );
		app.get(	'/modules/view/:id', m.viewSingle );
		app.get(	'/modules/edit/:id', users.ensureAuthenticated, m.edit );
		app.get(	'/modules/new', users.ensureAuthenticated, m.newModule );
		app.post(	'/modules/create', users.ensureAuthenticated, m.create );
		app.post(	'/modules/update/:id', users.ensureAuthenticated, m.update );
		app.get(	'/modules/tag/:id', m.modulesWithTag );
		app.get(	'/modules/search', function ( req, res ){ 
			res.render( 'm_search', { 
				title : '',
			  user: req.user !== undefined ? req.user : 'null' 
			}); 
		});
		app.get(	'/modules/search/fulltext/:query', m.fulltextSearch );
		app.get(	'/modules/search/tags/:query', m.tagSearch );
		app.post(	'/modules/search', m.searchQuery );
		app.get(	'/admin/tags/list', m.tagIndex );
		app.get(	'/admin/tags/edit/:tag', m.tagEdit );
		app.post(	'/admin/tags/update/:tag', m.tagUpdate );
		app.get(	'/admin/tags/destroy/:tag', m.tagDestroy );
		
		// users	
		app.get('/admin/users', users.ensureAuthenticated,	users.renderIndex );
		app.get('/admin/users/create', users.ensureAuthenticated, users.renderCreate );
		app.post('/admin/users/create', users.ensureAuthenticated, users.create ); // opens input form
		app.get('/admin/users/edit/:id', users.ensureAuthenticated, users.renderEdit );
		app.post(	'/admin/users/update/:id', users.ensureAuthenticated, users.update );//users.updateUsers);	
		app.get('/admin/users/destroy/:id',	users.ensureAuthenticated,	users.destroy );


		app.get(	'/users/view/:username', users.ensureAuthenticated,	users.renderByUsername );
		app.get(	'/users/register', users.ensureAuthenticated, users.registrationForm ); // opens input form
		app.post(	'/users/register', users.ensureAuthenticated, users.registerUser ); // saves user
		app.post(	'/users/create', users.ensureAuthenticated, users.create ); // saves user

		app.get('/json/users', users.ensureAuthenticated, users.getJSON);
		app.get('/json/user-data', users.ensureAuthenticated, users.getUserData );

		// login
		app.get('/logout', users.ensureAuthenticated, users.handleLogout );
		app.get('/login',  users.openLoginPage );
		app.post('/login', users.authenticate );
		//app.get('/login-guest', users.authenticateGuest );
	}	
});






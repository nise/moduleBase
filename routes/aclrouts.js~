/*
author: niels.seidel@nise81.com
module:
description: 

**/

module.exports = function(db, app) {
	var module = {};

	mongoose = require( 'mongoose' ),
	admin = require('./admin'),
	scripts = require('./scripts'),
	videos = require('./videos'),
	images = require('./images'),
	portals = require('./portals'),	
	patterns = require('./patterns'),	
	users = require('./users'),
	groups = require('./groups'),
	// terzin specific
	scenes = require('./scenes'),
	persons = require('./persons'),
	messages = require('./messages')
	;
	

//if (req.isAuthenticated()) { return next(); }
//res.redirect('/login')
	
/* define routes **/

// routes for files
/*app.get('/slides/:id', function(req, res){ 
	console.log('öööööööööööö'+'___public/vi-lab'+req.params.id)
  var file = 'public/vi-lab'+req.params.id;
  res.download(file); // Set disposition and send it.
});
*/

	// routes related to admin area
	app.get(	'/admin', 			admin.index );
	app.get(	'/admin/users', admin.getUsers );
	
	// search
	/*var regex = new RegExp('noodles', 'i');  // 'i' makes it case insensitive
    return Questions.find({text: regex}, function(err,q){
        return res.send(q);
    });
  */  
  
  // misc
  app.get(	'/', function ( req, res ){ res.render( 'intro', { title : 'Designing Video Interfaces' }); });
	app.get(	'/wizzard', function ( req, res ){ res.render( 'wizzard', { title : 'Pattern Wizzard' }); });
	app.get(	'/about', function ( req, res ){ res.render( 'about', { title : 'About' }); });
	app.get(	'/citation', function ( req, res ){ res.render( 'citation', { title : 'Citation' }); });
  app.get(	'/api', function ( req, res ){ res.render( 'api', { title : 'API' }); });
  
  	app.get(	'/eval', function ( req, res ){ res.render( 'eval-pattern-buckets', { title : 'What do you think?' }); });

	// routes for portals
	app.get(	'/portals', 						portals.list );
	app.get(	'/portals/patterns/:id',portals.getPortalsOfPattern );
	app.get(	'/portals/tag/:id',			portals.getPortalsOfTag );
	app.get(	'/portals/new', 				portals.new_one );
	app.post(	'/portals/create', 			portals.create );
	app.get(	'/portals/destroy/:id',	portals.destroy );
	app.get(	'/portals/edit/:id', 		portals.edit );
	app.post(	'/portals/update/:id', 	portals.update );
	app.get(	'/json/portals', 				portals.getJSON );
	app.get(	'/json/portals/patterns/:id',portals.getJSONPortalsOfPattern );
	app.get(	'/json/pattern-names', 	portals.getJSONPatterns );
	app.get(	'/json/portals/name',		portals.getJSONPortalNames );
	
	// routes for images
	app.get( 	'/json/images/all' , 			images.getJSON );
	app.get( 	'/json/images/by-pattern/:pattern', images.getJSONImagePerPattern );
	app.get( 	'/json/images/view/:filename' 		, images.getJSONImagePerFilename );
	app.get(	'/images', 						images.list );
	app.get(	'/images/edit', 			images.edit );
	app.get(	'/images/destroy/:id',images.destroy );
	app.post(	'/images/update/:id', images.update );
	
	// routes for patterns
	app.get( 	'/json/patterns' , 			patterns.getJSON );
	app.get(	'/json/patterns/name',	patterns.getJSONPatternNames );
	app.get(	'/patterns/list', 			patterns.list );
	app.get(	'/proto-patterns/list', patterns.listProtopatterns );
	app.get(	'/patterns/view/:name', patterns.listOne );
//	app.get(	'/patterns/view/:id', 	patterns.listOne );
	app.get(	'/patterns/edit/:id', 	patterns.edit );
//	app.get(	'/patterns/edit/:name', patterns.edit );
	app.post(	'/patterns/update/:id', patterns.update );
	
	
	// routes for messages
	app.get( 	'/json/messages/all' , 			messages.getJSON );
	app.get( 	'/json/messages/:type' , 		messages.getJSONbyType );


	
	// routes for videos
	// http://localhost:3000/popcorn-maker/popcorn-maker/#
	app.get(	'/videos' , 	users.ensureAuthenticated,					videos.list );
	app.get(	'/videos/view/:id' , users.ensureAuthenticated, videos.show );
	app.get(	'/admin/videos',  admin.getVideos )
	app.get(	'/admin/videos/new' , 			 users.authCallback(['user','editor']), videos.new_one );
	app.get(	'/admin/videos/metadata/edit/:id' , 	videos.editMetadata );
	app.get(	'/admin/videos/annotations/edit/:id' , 	videos.editAnnotations );
	app.get(	'/videos/destroy/:id' ,videos.destroy );
	app.post(	'/videos/update/:id' ,videos.update );
	app.post(	'/videos/create' , 		videos.create );
	app.post(	'/videos/annotate', users.ensureAuthenticated, videos.annotate);
	app.get( 	'/json/videos' , 			videos.getJSON );
	app.get( 	'/json/videos/:id' , 	videos.getOneJSON );
	app.get( 	'/json/film' , 				videos.getJSON );


	///////xxx todo :: app.get('/related-videos/:id' , users.ensureAuthenticated, wine.getRelatedVideos);

	// routes related to scripts	
	app.get('/json/script', users.ensureAuthenticated, scripts.getScript);


	// routes for user management
	app.get('/groups', groups.getGroups);
	app.get('/json/groups', groups.getGroups);
	//	app.get('/messages', users.ensureAuthenticated, wine.getMessages);
	//	app.post('/messages', users.ensureAuthenticated, wine.addMessage);
	
	// routes for system purpose	
	app.post('/log', function(req, res) {
		log.write(req.param('data'));	
		res.send('terminated logging');
	});
	app.get('/log', users.authCallback(['editor']), function(req, res) {
		//console.log(req.headers.toString()+'__________________'+String(req.headers['X-Forwarded-For']).split('-')[0]);
		//log.write(req.param('data'));	
		//res.type('text/text');
		res.send('terminated request');
	});	
	

	// routes related to User Management and Passport - Local Authentication
	app.get(	'/users/view/:username', 	users.show );// showAccountDetails);
	app.get(	'/admin/users/new', 						users.addUserForm ); // opens input form
	app.get(	'/users/register', 				users.registrationForm ); // opens input form
	app.post(	'/users/register', 				users.registerUser ); // saves user
	app.post(	'/users/create', 					users.create ); // saves user
	app.post(	'/users/update/:id', users.authCallback(['editor']),		users.update );//users.updateUsers);	
	app.get(	'/admin/users/destroy/:id',		users.destroy );
	app.get(	'/admin/users/edit/:username', 	users.edit );
	app.post(	'/users/online/:username', 	users.setOnlineStatus );
	app.get(	'/users/online/:username', 	users.getOnlineStatus );
	// api
	app.get('/json/users', users.ensureAuthenticated, users.getJSON);
	app.get('/json/user-data', users.getUserData );
	app.get('/json/group-data', users.getGroupData );

	// login
	app.get('/logout', users.ensureAuthenticated, users.handleLogout );
	app.get('/login', users.openLoginPage ); //curl -v -d "username=bob&password=secret" http://localhost:3000/login
	app.post('/login', users.authenticate );

	
	// routes related to E-Assessment
	var assess = require('./assessment');
	app.get('/json/assessment', assess.getTest);
	app.get('/assessment', assess.index);
	app.get('/assessment/results', users.ensureAuthenticated, assess.getResults );
	app.post('/assessment/results', users.ensureAuthenticated , assess.setResults );
	app.get('/assessment/fill-in/:field', users.ensureAuthenticated, assess.getFillins );
	app.post('/assessment/fill-in/:field', users.ensureAuthenticated, assess.setFillins );
	app.get('/assessment/written/:field', users.ensureAuthenticated, assess.getWrittenAssessment );
	app.post('/assessment/written/:field', users.ensureAuthenticated, assess.setWrittenAssessment );
	

/*
	// routes related to etherpad
	var etherpad = require('./etherpad');
	
	app.get('/collaborative-writing', users.ensureAuthenticated, etherpad.createSession )
	app.get('/collaborative-writing2', users.ensureAuthenticated, etherpad.createSession2 )
	app.get('/json/etherpad', etherpad.getJSON )
	app.get('/admin/etherpad', users.ensureAuthenticated, etherpad.listPadInput )
*/
	/*
	Logging
	**/
	var log = fs.createWriteStream('logfile.debug', {'flags': 'a'}); // use {'flags': 'a'} to append and {'flags': 'w'} to erase and write a new file


} // end module

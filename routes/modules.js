


var 
	mongoose = require( 'mongoose' ),
	Modules  = mongoose.model( 'Modules' ),
	fs = require('node-fs'),
	csv = require('csv')
	;


/*
Import Modules data from csv
**/
exports.csvImport = function ( req, res ){ 
	// load data
	fs.readFile(__dirname+'/../data/data2.csv', function read(err, data) {
		if(err){
			console.log(err);
		} 
		// get Video dataset in order to extract toc data
		var tags = [];
			// destroy dataset first
			Modules.remove({}, function(err) { console.log('collection removed') });
			csv().from.string(data, {comment: '#'} )
				.to.array( function(data){
					// define Modules for each line
					for(var i = 2; i < data.length; i++){
						tags = [];
						console.log( data[i][0] )
						if(data[i][10] != false){ 
							tags.push("Video Learning Environment"); 
						}
						
						//new Modules(
						
						var obj = {};
						validate(obj, 'modulnr1', 		data[i][0], 'string');
						validate(obj, 'modulnr2', 		data[i][1], 'string');
						validate(obj, 'modultitel', 	data[i][2], 'string');
						validate(obj, 'course', 	data[i][2], 'string');
						validate(obj, 'type', 	data[i][2], 'string', [ 'Master', 'Bachelor', 'Diplom' ]);
						validate(obj, 'university', 	data[i][2], 'string', [ 'TUD/IHI', 'TUD', 'HSZG' ]);
						validate(obj, 'language', 	data[i][2], 'string', [ 'Deutsch', 'Englisch', 'Deutsch/Englisch' ]);
						validate(obj, 'modultitel', 	data[i][2], 'string');
						validate(obj, 'modultitel', 	data[i][2], 'string');
						validate(obj, 'modultitel', 	data[i][2], 'string');
						validate(obj, 'modultitel', 	data[i][2], 'string');
						
						
						
						var t = {
				
	/*
							sws: [{
								vorlesung: Number, 
								ringvorlesung: Number, 
								ubung: Number, 
								seminar: Number, 
								ubung_seminar: Number, 
								tutorium: Number, 
								praktikum: Number, 
								exkursion: Number, 
								projekt: Number, 
								berufspraktikum: Number, 
								sprachkurs: Number, 
								elearning: Number
							}],	
							sws_total: Number, 
							workload: Number, //Arbeitsaufwand [h]		150	150
							workload_self  : Number, //Selbststudium [h]		90	60
							ects: Number,
	
							pvl: [{
								referat: Number,
								labor: Number,
								beleg: Number,
								testat: Number,
								protokoll: Number,
								moderation: Number
							}],
							pl: [	{
								klausur: Number,
								mdlpruefung: Number,
								referat: Number,
								praesentation: Number,
								belegarbeit: Number,
								seminararbeit: Number,
								projektarbeit: Number,
								praktikumsprotokoll: Number,
								praktikumsbericht: Number,
								exkursionsbericht: Number,
								laborarbeit: Number,
								forschungsplan: Number,
								elearningtest: Number
							}],	
	
							ws: Boolean,
							ss: Boolean,
							modulverantwortlicher: String,
							mail: { type: String, trim: true },
							lecturers		: String, // weitere Dozenten
							comments : String,	
							*/
							updated_at : Date.now()
						};
						
						
						console.log(obj);
						//).save( function( err, todo, count ){
							//res.redirect( '/portals' );
						//});	
					}
				});// end array()	
			console.log('Imported modules.csv');
			console.log('......................')
	});// end fs				
};


function validate(obj, entry, val, type, not_null){
	if( typeof val === "string" && val.length > 0){
		obj[entry] = val
	}
}


/*
REST API CALL
**/
exports.getJSON = function(req, res) {
	var stream = Modules.find().sort( 'id' ).lean().stream();
	
	stream
		.on('data', function (docs) {
			res.type('application/json');
			res.jsonp(docs);
			res.end('done');
		})
		.on('error', function (err) {
			console.log('stream error @ modules.js')
		});
};




exports.index = function ( req, res ){
  res.render( 'modules', { title : 'Express Modules Example' });
};

/*
**/
exports.getJSONPortalNames = function ( req, res ){
  Modules
		.find( { })
		.select('name -_id')
		.sort( 'name' )
		.exec( function ( err, modules ){
			var arr = [];
			for(var p in modules){
				if(portals.hasOwnProperty(p)){
					arr.push(modules[p].name);	
				}
			} 
			res.jsonp(arr);
		});
};







//
exports.create = function ( req, res ){
  new Modules({
    name : req.body.name,
    description : req.body.description,
    category : '-99',//req.body.category;
		provider : req.body.provider,
		url : req.body.url,
		accessible : req.body.accessible,
		open_source : false,
		availability : req.body.availability,
		tags : req.body.tags,
    patterns : String(req.body.patterns).split(','),
    updated_at : Date.now()
  }).save( function( err, todo, count ){
    res.redirect( '/modules' );
  });
};


// query db for all todo items
exports.list = function ( req, res ){
  Modules
		.find()
		.sort( 'name' )
		.exec( function ( err, docs ){ 
			res.render( 'modules', {
			  title : 'Video Learning Environments (' + docs.length + ')',
			  items : docs
			});
		});
};

// new 
exports.new_one = function ( req, res ){
  Modules
		.find()
		.sort( 'number' )
		.exec( function ( err, todos ){ 
			res.render( 'modules-new', {
			  title : 'Express Modules Example',
			  todos : todos
			});
		});
};

// remove todo item by its id
exports.destroy = function ( req, res ){
  Modules.findById( req.params.id, function ( err, todo ){
    todo.remove( function ( err, todo ){
      res.redirect( '/modules' );
    });
  });
};


exports.edit = function ( req, res ){
  Modules.findOne({_id: String(req.params.id)}, function ( err, item ){
  	if(err){
  		console.log(err);
  	}
    res.render( 'modules-edit', {
        item   : item,
        current : req.params.id
    });
  });
};


// redirect to index when finish
exports.update = function ( req, res ){
  Modules.findById( req.params.id, function ( err, portal ){
  name : req.body.name,
    portal.name    = req.body.name;
    portal.description = req.body.description;
    portal.provider = req.body.provider;
		portal.url = req.body.url;
		portal.accessible = req.body.accessible;
		portal.availability = req.body.availability;
    portal.tags = String(req.body.tags).split(','); 
    portal.patterns = String(req.body.patterns).split(',');
    portal.updated_at = Date.now();
    portal.save( function ( err, ix, count ){
    	if(err){ console.log(err); }
    	res.redirect( '/modules' );
    });
  });
};







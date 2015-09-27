


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
			Modules.remove({}, function(err) { console.log('collection removed') ;
				csv().from.string(data, {comment: '#'} )
					.to.array( function(data){
						var id=1;
						// define Modules for each line
						for(var i = 2; i < data.length; i++){
						
							var obj = {};
							obj.id = id; id++;
							validate(obj, 'modulnr1', 		data[i][0], 'string');
							validate(obj, 'modulnr2', 		data[i][1], 'string');
							validate(obj, 'modultitel', 	data[i][2], 'string');
						
							var courses = [];
							for(var j = 3; j < 10; j++){
								if( typeof data[i][j] === "string" && data[i][j].length > 0){
									courses.push( data[i][j] ); 
								}
							}	
							obj.courses = courses;
						
							validate(obj, 'type', 				data[i][10], 'string', [ 'Master', 'Bachelor', 'Diplom' ]);
							validate(obj, 'university', 	data[i][11], 'string', [ 'TUD/IHI', 'TUD', 'HSZG' ]);
							validate(obj, 'language', 		data[i][12], 'string', [ 'Deutsch', 'Englisch', 'Deutsch/Englisch' ]);
					
							var sws = {};
							validate(sws, 'vorlesung', 	data[i][13], 'number');
							validate(sws, 'ringvorlesung', 	data[i][14], 'number');
							validate(sws, 'ubung', 	data[i][15], 'number');
							validate(sws, 'seminar', 	data[i][16], 'number');
							validate(sws, 'ubung_seminar', 	data[i][17], 'number');
							validate(sws, 'tutorium', 	data[i][18], 'number');
							validate(sws, 'praktikum', 	data[i][19], 'number');
							validate(sws, 'exkursion', 	data[i][20], 'number');
							validate(sws, 'projekt', 	data[i][21], 'number');
							validate(sws, 'berufspraktikum', 	data[i][22], 'number');
							validate(sws, 'sprachkurs', 	data[i][23], 'number');
							validate(sws, 'elearning', 	data[i][24], 'number');
							obj.sws = sws;
						
							validate(obj, 'sws_total', 	data[i][25], 'number');
							validate(obj, 'workload', 	data[i][26], 'number');//Arbeitsaufwand [h]		150	150
							validate(obj, 'workload_self', 	data[i][27], 'number');//Selbststudium [h]		90	60
							validate(obj, 'ects', 	data[i][28], 'number');
						
							var pvl = {};
							validate(pvl, 'referat', 	data[i][29], 'number');
							validate(pvl, 'labor', 	data[i][30], 'number');
							validate(pvl, 'beleg', 	data[i][31], 'number');
							validate(pvl, 'testat', 	data[i][32], 'number');
							validate(pvl, 'protokoll', 	data[i][33], 'number');
							validate(pvl, 'moderation', 	data[i][34], 'number');
							obj.pvl = pvl;
						
							var pl = {};
							validate(pl, 'klausur', 	data[i][35], 'number');
							validate(pl, 'mdlpruefung', 	data[i][36], 'number');
							validate(pl, 'referat', 	data[i][37], 'number');
							validate(pl, 'praesentation', 	data[i][38], 'number');
							validate(pl, 'belegarbeit', 	data[i][39], 'number');
							validate(pl, 'seminararbeit', 	data[i][40], 'number');
							validate(pl, 'projektarbeit', 	data[i][41], 'number');
							validate(pl, 'praktikumsprotokoll', 	data[i][42], 'number');
							validate(pl, 'praktikumsbericht', 	data[i][43], 'number');
							validate(pl, 'exkursionsbericht', 	data[i][44], 'number');
							validate(pl, 'laborarbeit', 	data[i][45], 'number');
							validate(pl, 'forschungsplan', 	data[i][46], 'number');
							validate(pl, 'elearningtest', 	data[i][47], 'number');
							obj.pl = pl;
						
							obj.summer_winter = data[i][48] === '1' ? 'WS' : 'SS';
							validate(obj, 'modulverantwortlicher', 	data[i][50], 'string');
							validate(obj, 'mail', 	data[i][51], 'string');
							validate(obj, 'lecturer', 	data[i][52], 'string');
							validate(obj, 'comments', 	data[i][53], 'string');
							obj.updated_at = Date.now();
						
						
							//console.log(obj);
							new Modules( obj ).save( function( err, todo, count ){
								if(err){console.error(String(err))}
								else{ 
									//console.log(todo) 
								}
								//res.redirect( '/portals' );
							});	
						}
					});// end array()	
				console.log('Imported modules.csv');
				console.log('......................')
			});	
	});// end fs				
};


function validate(obj, entry, val, type, not_null){
	if( typeof val === "string" && type == "string" && val.length > 0){
		obj[entry] = val
	}
	if( typeof Number(val) === "number" && type == "number" && val !== '0'){
		obj[entry] = Number(val.replace(',','.'));	
	}
}


/*
REST API CALL
**/
exports.getJSON = function(req, res) {
	var stream = Modules.find()
	//.select('sws ects')
	.lean()
	.exec( function ( err, modules ){
		res.jsonp(modules);
	});
	
};

/*
CSV Export
**/
expressCSV = require('express-csv')
exports.getCSV = function(req, res) {
	var stream = Modules.find()
	//.select('sws ects')
	.lean()
	.exec( function ( err, modules ){
		//res.set('Content-Type', 'application/octet-stream');
		res.csv(modules);
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







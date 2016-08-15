


var 
	mongoose = require( 'mongoose' ),
	Modules  = mongoose.model( 'Modules' ),
	fs = require('node-fs'),
	csv = require('csv'),
	tag_schema = {}
	;





/* Returns the filed schemas of most of the module fields
 * status: tested, but could be refactored
 */
exports.getFieldSchema = function(req,res){
	Modules.find().distinct( 'university', function(error, university) {
		Modules.find().distinct('language', function(error, language) {
			Modules.find().distinct('courses', function(error, courses) {
				Modules.find().distinct('type', function(error, type) {
					Modules.find().distinct('summer_winter', function(error, summer_winter) {
						Modules.find().distinct('pl', function(error, pl) {
							Modules.find().distinct('pvl', function(error, pvl) {
								Modules.find().distinct('sws', function(error, sws) {
									
									//Modules.find().distinct('tags', function(error, tags) {
									fs.readFile( './data/analysis/data-tag-level-relations.csv' , function read(err, data) { 
										if(err){
											console.error(err);
										} 
										csv().from.string(data, {comment: '#'} )
											.to.array( function(csv){
												tag_schema = {};
												for(var i = 1; i < csv.length; i++){
													if( tag_schema[ csv[i][1] ] === undefined ){
														tag_schema[ csv[i][1] ] = [];
													}
													tag_schema[ csv[i][1] ].push( csv[i][0] )
												}
												//console.log(tag_schema);	
												
												for(var j = 0; j < tag_schema.length; j++){
													tag_schema[j] = tag_schema[j].filter( uniq );
												}
												var extractKeys = function(obj){
													var arr = [];
													for(var p in obj){
														if( obj.hasOwnProperty(p)){ 
															arr.push( Object.keys( obj[p] )[0] );
														}
													}
													return arr.filter( uniq );
												}
												var uniq = function onlyUnique(value, index, self) { 
														return self.indexOf(value) === index;
												}
											
												res.jsonp( {
													university: university,
													language: language,
													courses: courses,
													type: type,
													summer_winter: summer_winter,
													tags : tag_schema, // captures in advance,
													pl: extractKeys( pl ),
													pvl: extractKeys( pvl ),
													sws: extractKeys( sws )
												} );
											});
										});
										
									//});	
								});
							});
						});				
					});				
				});
			});
		});
	}); 
}



/*********************************************************************************/
/* TAGS */


/*
Import tags from several csv files
**/
exports.importTags = function ( req, res ){ 
	// import tag classification
	
	fs.readFile( __dirname+'/../data/keyword_refinement_revisited.csv' , function read(err, data) { // test: data2.csv
		if(err){
			console.error(err);
		} 
		csv().from.string(data, {comment: '#'} )
			.to.array( function(replace_tags){
				// reformat replace_tags
				var repl = {};
				for(var i = 0; i < replace_tags.length; i++){
					var tmp = [];
					for(var j = 1; j < replace_tags[i].length; j++){
						if(replace_tags[i][j] !== ''){
							tmp.push(replace_tags[i][j]);
						}
					}
					repl[ replace_tags[i][0] ] = tmp;
					//console.log( replace_tags[i] );
				} 
				// store replace tags for later use
				t_replace = repl;		
				
				// import tag files 
				var dir = './data/tags';
				var files = fs.readdirSync(dir);
				for(var i in files){
					if (!files.hasOwnProperty(i)){ 
						continue;
					}	
					var name = dir+'/'+files[i];
					if ( fs.statSync(name).isDirectory() === false){
						// exclude temp files etc.
						if(name.slice(-1) !== '~' && files[i].slice(0,2) !== '.~'){
							//console.log('Start prosessing tags for file: '+ name + '................')
							importTagFile( { file: name}, res ); 
						}
				 	}else{  
						//getFiles(name);
				 	}
				}
			});//end toArray
	});// end fs.read			
};

var 
	modules = {},
	tag_file_count = 0,
	tag_level1_arr = [],
	tag_level2_arr = [],
	t_ignored = [
		'Bevölkerungsgeographie / Sozialgeographie',
		'Skala / Skalenebenen: Biozönose - Ökosystem',
		'Teambildung / Teambuilding / Teamfindung',
		'Versuchsplanung',
		'Wasserhaushalt (terrestrische Standorte)','deskriptive Statistik'
		],
	t_replace = []	
	;

function importTagFile( req, res ){ 
	var tagRelations = '2nd-level,1st-level\n';
	fs.readFile( req.file , function read(err, data) { // test: data2.csv
		if(err){
			console.error(err);
		}	
		csv().from.string(data, {comment: '#'} )
			.to.array( function(csv){
				//console.log( csv[0][2] );
				// 
				tag_file_count++; 
				for(var i = 1; i < csv.length; i++){ // ignore first row
					for(var j = 1; j < csv[i].length; j++){ // ignore first column (== tags on level 1)
						if( csv[i][j] === '1' ){ 	
							//console.log(csv[0][j] + ' has tag '+csv[i][1]);
							if( modules[ csv[0][j] ] === undefined ){
								modules[ csv[0][j] ] = [];
							}
							// collect all tags for consitency checks
							tag_level1_arr.push( csv[i][0] );
							
							if( csv[i][0] === ''){
								console.warn( req.file )
							}
							
							// tags to be ignored
							if( t_ignored.indexOf( csv[i][1] ) === -1 ){ //console.log(csv[i][1])
								// append tag to module
								if( Object.keys(t_replace).indexOf( csv[i][1] ) !== -1 ){
									for(var k = 0; k < t_replace[ csv[i][1] ].length; k++){
										modules[ csv[0][j] ].push( t_replace[ csv[i][1] ][ k ] );
										//console.log('+ added tag: ' + t_replace[ csv[i][1] ][ k ] )
										tag_level2_arr.push( csv[i][1] );
										tagRelations += csv[i][1] + ',' + csv[i][0] + '\n';
									}
								}else{
									modules[ csv[0][j] ].push( csv[i][1] );
									tag_level2_arr.push( csv[i][1] );
									tagRelations += csv[i][1] + ',' + csv[i][0] + '\n';
									//console.log('+ added tag: '+  csv[i][1] )
								}
							}// end if	
							else{
								//console.log('- deleted tag: '+  csv[i][1] )
							}
						}// end if
					}// end for
				}// end for
				//console.log(Object.keys(modules));
				if(tag_file_count === 11 ){ // 11 files in total
					tagRelations = tagRelations.split('\n')
					var uniqueTagRelations = tagRelations.filter(function(item, pos) {
							return tagRelations.indexOf(item) == pos;
					});
					write2file('data-tag-level-relations.csv', uniqueTagRelations.join('\n'));
					res( { tags: modules }, {} );
				}
			
		});// end toArray
	});// end read
}



/*
 * Get the schema of all tags. The schema has tags on two levels. Each tag on the first level is related to several tags on the second level.
 **/
exports.getTagSchema = function(req,res){
 res.jsonp( tag_schema );
}

/*
 * Render list of Modules that have a certain tag
 **/
exports.modulesWithTag = function ( req, res ){
  Modules
		.find( { tags : req.params.id.replace('_',' ') })
//		.select( ' modultitel  ' )
		.sort( 'modultitel' )
		.exec( function ( err, docs ){ 
			res.render( 'm_modules_index', {
			 	title : "Module mit dem Schlüsselwort '"+req.params.id.replace('_',' ')+"'",
			  items : docs,
			  user: req.user !== undefined ? req.user : undefined
			});
		});
};


/*
 * Return JSON of Modules that have a certain tag
 */
exports.getJSONbyTag = function ( req, res ){
  Modules
		.find( { tags : req.params.id.replace('_',' ') })
//		.select( ' modultitel  ' )
		.sort( 'modultitel' )
		.exec( function ( err, modules ){ 
			res.jsonp(modules);
		});
};


/*
 * Render list of tags with its corresponding modules
 */
exports.tagIndex = function ( req, res ){
	Modules
		.find()
		.select('modultitel tags _id')
		.exec( function( err, modules ){
			// prepare data
			var tags = {};
			for(var i = 0; i < modules.length; i++){
				for(var j = 0; j < modules[i].tags.length; j++){
					if( tags[ modules[i].tags[j] ] === undefined ){
						tags[ modules[i].tags[j] ] = {};
						tags[ modules[i].tags[j] ].tag = modules[i].tags[j];
						tags[ modules[i].tags[j] ].modules = [];
					}
					tags[ modules[i].tags[j] ].modules.push( {title: modules[i].modultitel, _id: modules[i]._id } );
				}
			} 
			// sort tags ::todo xxx
			var 
				keys = Object.keys(tags),
				tmp = {}, 
				 i, len = keys.length;

			keys.sort();

			for (i = 0; i < len; i++) {
				k = keys[i];
				tmp[keys[i]] = tags[keys[i]];//alert(k + ':' + data[k]);
			}	
			// render
			res.render( 'm_tags_index', {
			  tags : tmp,
			  user: req.user !== undefined ? req.user : undefined
			});
		})
		;
};


/*
 * Render edit form for a tag
 **/
exports.tagEdit = function ( req, res ){ 
	res.render( 'm_tags_edit', { 
		tagname: req.params,
	  user: req.user !== undefined ? req.user : undefined 
	});
}
 
/*
 * Update tag
 **/ 
exports.tagUpdate = function ( req, res ){ 
  Modules
  	.find( { tags : req.params.tag.replace('_',' ') })
		.select( 'tags' )
		.sort( 'modultitel' )
		.exec( function ( err, docs ){
			for(var i = 0; i < docs.length; i++){
				docs[i].tags = docs[i].tags
					.join(',')
					.replace(','+req.params.tag+',', ','+req.body.tagname+',')
					.split(',');
				docs[i].save();	
			} 
			res.redirect('/admin/tags/list');
		});
};


/*
 * Destroy tag
 **/ 
exports.tagDestroy = function ( req, res ){
  Modules
		.find( { tags : req.params.tag.replace('_',' ') })
		.remove()
		.exec()
		;
};

/*
 * 
 **/
exports.getTagVectors = function( req, res ){
	var 
		tagnames = require(__dirname+'/../data/analysis/module-tag-names.json'),
		tmp = [],
		out = ',' +  tagnames.toString() + '\n' 
		;
	Modules.find()
	.select('modulnr1 tags')
	.lean()
	.exec( function ( err, modules ){
		if(err){ console.error( err ); }
		for(var i = 0; i < modules.length; i++){
			// init array
			for(var j = 0; j < 570; j++){ tmp[j] = 0; }	
			// travers tags of current module
			for(var k = 0; k < modules[i].tags.length; k++ ){
				// flip vector bit
				if(tagnames.indexOf( modules[i].tags[k] ) !== -1 ){
					tmp[ tagnames.indexOf( modules[i].tags[k] ) ] = 1; //console.log( modules[i].tags[k] )
				}
			}
			out += modules[i].modulnr1 + ',' + tmp.toString() + '\n';
		}
		//console.log(out);
		write2file('tag-vectors.csv', out );
	});
}


/********************************************************************************/
/* ANALYSIS */


/*
Returns a tsv of the number of connections between co-occuring patterns over all portals
This can be randered in a heatmap (=> d3) or network graph (=> gephi)
example: patterns-co-occurance
status: finished
**/
exports.getTagCoOccurences = function(req, res) { console.log(3)
	Modules
		.find()
		.select('modultitel tags _id university')
		.exec( function( err, modules ){
			// prepare data
			var tags = {};
			var json = {};
			var nodes = [];
			json.nodes = [], json.links =[];
			var tmp = {};
			for(var i = 0; i < modules.length; i++){
				// generate list of modules
				nodes.push( {id: i, title: modules[i].modultitel, group: modules[i].university } );
				// collect tags
				for(var j = 0; j < modules[i].tags.length; j++){
					if( tags[ modules[i].tags[j] ] === undefined ){
						tags[ modules[i].tags[j] ] = {};
						tags[ modules[i].tags[j] ].tag = modules[i].tags[j];
						tags[ modules[i].tags[j] ].modules = [];
					}
					//tags[ modules[i].tags[j] ].modules.push( {title: modules[i].modultitel, _id: modules[i]._id } );
					tags[ modules[i].tags[j] ].modules.push( i );
				}
			} 
			// generate list of links
			for(var tag in tags){
				if(tags.hasOwnProperty(tag) && tags[tag].modules.length > 1 ){
					var 
						permutations = pairs( tags[tag].modules ),
						len = permutations.length
						;
						
					for(var i=0; i < len; i++){
						permutations[i] = permutations[i].sort();
						var key = permutations[i][0]+'-'+permutations[i][1]
						tmp[key] = (tmp[key] || 0) + 1
					}
				}
			}
			// print
			var used = [];
			for(var j in tmp){
				if(tmp.hasOwnProperty(j) && tmp[j] > 1){
					var t = j.split('-');
					json.links.push( { source: Number(t[0]), target: Number(t[1]), value: tmp[j]} )
					used.push(Number(t[0])); used.push(Number(t[1]))
				}
			}
			for(var j in nodes){
				if(nodes.hasOwnProperty(j)){
					json.nodes.push( nodes[j] );
				}
			} 
			//console.log(json)
			res.render('analysis_similarity2', { data: json, user: undefined });
			//res.jsonp(json);
			// save file
		})
		;
}


/*
 * Util: Returns all possible combinations of array elements
 * status: finished
 **/
pairs = function (list) {
    var pairs = [];
    for (var i = 0; i < list.length - 1; i++) {
        for (var j = i; j < list.length - 1; j++) {
            pairs.push([list[i], list[j+1]]);
        }
    }
    return pairs;
}

																																												



/*********************************************************************************/
/* MODULES */


/*
 * Import meta data from single csv
 * status: finished
 **/
exports.importMetadata = function ( req, res ){
	// print the previously collected tags per module:
	//console.log( req.tags ); 
	//console.log( uniq( tag_level2_arr ) );
	write2file('module-tag-names.json', JSON.stringify( uniq( tag_level2_arr ) , null, 4) );
	write2file('module-tag.json', JSON.stringify(req.tags, null, 4) );
	
	
	// load data
	fs.readFile(__dirname+'/../data/module_metadata_clean2.csv', function read(err, data) { // test: data2.csv
		if(err){
			console.error(err);
		} 
		// get tags
		//var tags = importTags();
			// destroy dataset first
			Modules.remove({}, function(err) { 
				console.log('collection removed') ;
				// start import from csv
				csv().from.string(data, {comment: '#'} )
					.to.array( function(data){
						var id=1;
						// define Modules for each line
						for(var i = 1; i < data.length; i++){
						
							var obj = {};
							obj.id = id; id++;
							validate(obj, 'modulnr1', 		data[i][0], 'string');
							validate(obj, 'modulnr2', 		data[i][1], 'string');
							validate(obj, 'modulnr3', 		data[i][2], 'string');
							validate(obj, 'modultitel', 	data[i][3], 'string');
						
							var courses = [];
							for(var j = 4; j < 10; j++){
								if( typeof data[i][j] === "string" && data[i][j].length > 0){
									courses.push( data[i][j] ); 
								}
							}	
							obj.courses = courses;
						
							validate(obj, 'type', 				data[i][11], 'string', [ 'Master', 'Bachelor', 'Diplom' ]);
							validate(obj, 'university', 	data[i][12], 'string', [ 'TUD/IHI', 'TUD', 'HSZG' ]);
							validate(obj, 'language', 		data[i][13], 'string', [ 'Deutsch', 'Englisch', 'Deutsch/Englisch' ]);
					
							var sws = {};
							validate(sws, 'vorlesung', 	data[i][14], 'number');
							validate(sws, 'ringvorlesung', 	data[i][15], 'number');
							validate(sws, 'ubung', 	data[i][16], 'number');
							validate(sws, 'seminar', 	data[i][17], 'number');
							validate(sws, 'ubung_seminar', 	data[i][18], 'number');
							validate(sws, 'tutorium', 	data[i][19], 'number');
							validate(sws, 'praktikum', 	data[i][20], 'number');
							validate(sws, 'exkursion', 	data[i][21], 'number');
							validate(sws, 'projekt', 	data[i][21], 'number');
							validate(sws, 'berufspraktikum', 	data[i][23], 'number');
							validate(sws, 'sprachkurs', 	data[i][24], 'number');
							validate(sws, 'elearning', 	data[i][25], 'number');
							obj.sws = sws;
						
							validate(obj, 'sws_total', 	data[i][26], 'number');
							validate(obj, 'workload', 	data[i][27], 'number');//Arbeitsaufwand [h]		150	150
							validate(obj, 'workload_self', 	data[i][28], 'number');//Selbststudium [h]		90	60
							validate(obj, 'ects', 	data[i][29], 'number');
						
							var pvl = {};
							validate(pvl, 'referat', 	data[i][30], 'number');
							validate(pvl, 'labor', 	data[i][31], 'number');
							validate(pvl, 'beleg', 	data[i][32], 'number');
							validate(pvl, 'testat', 	data[i][33], 'number');
							validate(pvl, 'protokoll', 	data[i][34], 'number');
							validate(pvl, 'moderation', 	data[i][35], 'number');
							obj.pvl = pvl;
						
							var pl = {};
							validate(pl, 'klausur', 	data[i][36], 'number');
							validate(pl, 'mdlpruefung', 	data[i][37], 'number');
							validate(pl, 'referat', 	data[i][38], 'number');
							validate(pl, 'praesentation', 	data[i][39], 'number');
							validate(pl, 'belegarbeit', 	data[i][40], 'number');
							validate(pl, 'seminararbeit', 	data[i][41], 'number');
							validate(pl, 'projektarbeit', 	data[i][42], 'number');
							validate(pl, 'praktikumsprotokoll', 	data[i][43], 'number');
							validate(pl, 'praktikumsbericht', 	data[i][44], 'number');
							validate(pl, 'exkursionsbericht', 	data[i][45], 'number');
							validate(pl, 'laborarbeit', 	data[i][46], 'number');
							validate(pl, 'forschungsplan', 	data[i][47], 'number');
							validate(pl, 'elearningtest', 	data[i][48], 'number');
							obj.pl = pl;
						
							obj.summer_winter = data[i][49] === '1' ? 'WS' : '';
							obj.summer_winter += data[i][50] === '1' ? 'SS' : '';
							obj.summer_winter = data[i][49] === '1' && data[i][50] === '1' ? 'WS + SS' : obj.summer_winter;

							obj.dauer = data[i][51];
							validate(obj, 'modulverantwortlicher', 	data[i][52], 'string');
							validate(obj, 'mail', 	data[i][53], 'string');
							validate(obj, 'lecturer', 	data[i][54], 'string');
							validate(obj, 'comments', 	data[i][55], 'string');
							obj.updated_at = Date.now();
							
							// add tags
							if( Object.keys(req.tags).indexOf( obj.modulnr1 ) === -1 ){
								console.warn('- no tags found for module: '+obj.modulnr1);
							}else{
								obj.tags = req.tags[ obj.modulnr1 ];
							}
						
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
	
				// make indexes	
				module.exports.makeIndex();
				console.log('Imported modules.csv');
				console.log('......................')
				// analysis
				
			});	
	});// end fs				
};


/*
 * Validates data type and existence of the given csv-entry
 */
function validate(obj, entry, val, type, not_null){
	if( typeof val === "string" && type == "string" && val.length > 0){
		obj[entry] = val
	}
	if( typeof Number(val) === "number" && type == "number" && val !== '0' && val !== 0){
		obj[entry] = Number(val.replace(',','.'));	
	}
}




/***********************************************************/
/* REST API CALL */

/*
 *
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
 * CSV Export
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








/*
 * Frequency of tags. In how many jj 
 */
exports.getSimilarModulesJSON = function(req, res) {
	var
		overlap = []
		;
	Modules.find()
		.select('modultitel modulnr1 tags _id')
		.lean()
		.exec(function (err, modules) {	
			Modules
			.findById( req.params.id )
			.sort( 'name' )
			.select('tags')
			.exec( function ( err, tags ){
				tags = tags.tags; 
				for(var i = 0; i < modules.length; i++){
					if(String(modules[i]._id) !== String(req.params.id)){			
						var intersection = tags.filter(function(n) {
								return modules[i].tags.indexOf(n) != -1
						});
						if( intersection.length > 0 ){
							overlap.push({_id: modules[i]._id, title: modules[i].modultitel, similarity: intersection.length}); 
						}
					}	
				}// end for	
				
				// sort
				overlap.sort(function(a, b){
				 return b.similarity - a.similarity
				})
			
				
				res.jsonp(overlap);
			
			});		
	});
}





exports.getSimilarJSONxxx = function ( req, res ){
  Modules
		.aggregate([
					{
						  "$unwind" :  "$tags" 
					},
					{
						  "$group" : {
						      "_id" : "$tags",
						      "count" : {
						          "$sum" : 1
						      }//,
						      //"name" : "$name" 
						  }
					},
					{
						  "$sort" : {
						      "count" : -1
						  }
					}
			]).exec(function(err, docs){
					res.jsonp(docs);
			});
};


/********************************************************/
/* Index, List, Show */


/*
 * Render list of all Modules
 **/
exports.index = function ( req, res ){ 
  Modules
		.find()
		.sort( 'modultitel' )
		.exec( function ( err, docs ){ 
			res.render( 'm_modules_index', {
			  title : 'Module',
			  items : docs,
			  user: req.user !== undefined ? req.user : undefined
			});
		});
};





/*
 * Renders single Modules
 **/
exports.viewSingle = function ( req, res ){
  Modules
		.findById( req.params.id )
		.sort( 'name' )
		.exec( function ( err, module ){ 
			res.render( 'm_modules_single', {
			  items : module,
			  user: req.user !== undefined ? req.user : undefined
			});
		});
};


/*
 * Store a new Module
 **/
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


/*
 * Renders form to enter a new Module
 **/
exports.new_one = function ( req, res ){
  Modules
		.find()
		.sort( 'number' )
		.exec( function ( err, todos ){ 
			res.render( 'modules-new', {
			  title : 'Express Modules Example',
			  user: req.user !== undefined ? req.user : undefined
			});
		});
};


/*
 * Destroys a Module
 **/
exports.destroy = function ( req, res ){
  Modules.findById( req.params.id, function ( err, todo ){
    todo.remove( function ( err, todo ){
      res.redirect( '/modules' );
    });
  });
};


/*
 * Renders form to edit Module
 **/
exports.edit = function ( req, res ){
  Modules.findOne({_id: String(req.params.id)}, function ( err, item ){
  	if(err){
  		console.error(err);
  	} 
    res.render( 'm_modules_edit', {
        item   : item,
        current : req.params.id,
			  user: req.user !== undefined ? req.user : undefined
    });
  });
};

exports.newModule = function ( req, res ){
  res.render( 'm_modules_new', {
      item   : {},
      current : req.params.id,
		  user: req.user !== undefined ? req.user : undefined
  });
};


/*
 * Creates a new Module
 **/
exports.create = function ( req, res ){
  Modules.save( req.params, function ( err, module ){
    if(err){ 
    	console.error(err); 
    }
    res.redirect( '/modules/view/'+module.id );
  });
};


/*
 * Updates data of an existing Module
 **/
exports.update = function ( req, res ){ 
	var data = req.body;
	Modules.findOneAndUpdate( { '_id':req.params.id }, data, { returnNewDocument: true}, function ( err, module ){
    if(err){ 
    	console.error(err);
    	res.end(); 
    }else{
    	res.redirect( '/modules/view/'+req.params.id );
    }	   
  });
};




/****************************************/
/* SEARCH */


/*
 *
 **/
exports.tagSearch = function ( req, res ){ 
	//console.log(req.params.query);
	// prepare query
	var query = {};
	// send query
  Modules
		.find( query )
		.select('name -_id')
		.sort( 'name' )
		.exec( function ( err, modules ){
			res.jsonp(modules);
		});
};


/*
 * 
 **/
exports.makeIndex = function( req, res){	
	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;
	var searchable = require('mongoose-searchable');
}


/*
 *
 **/
exports.searchQuery = function( req, res ){ 
 //console.log( JSON.stringify(req.body.data));
 var query = [];
 for(var i = 0; i < req.body.data.length; i++){
 	var key = Object.keys(req.body.data[i])[0];
 	if(req.body.data[i][key].expr === undefined){
 		query.push(req.body.data[i])
 	}else{
 		var o = {};
 		o[key] = new RegExp(req.body.data[i][key].expr,"i")
 		query.push(o); // e.g. [{"modultitel" : new RegExp("umwelt","i") }]
 	}
 }
 //console.log(query)
 
	Modules
	 .find( { $and : query } )// req.body.data
	 .exec( function ( err, modules ){
			if(err){
				console.error(err);
			}else{ //console.log(modules)
				res.jsonp(modules);
			}	
		})
		;
 }


/*
 * 
 **/
exports.fulltextSearch = function ( req, res ){ 
	var query = decodeURI( req.params.query ).split(' ');
	//console.log(query);
	Modules
	 .find({ keywords: { $in: query }})
	 .exec( function ( err, modules ){
			if(err){
				console.error(err)
			}else{
				res.jsonp(modules);
			}	
		})
		;
};


/*
 * 
 **/
exports.tagSearch = function ( req, res ){ 
	//console.log( decodeURI( req.params.query ) );
	var query = decodeURI( req.params.query ).split(',');
	//console.log(query);
	Modules
		.find( { tags: { $all: query } } )
		.exec( function ( err, modules ){
			if(err){
				console.error(err);
			}else{
				res.jsonp(modules);
			}
		});
};



/*
 * Util: Writes file to disk
 * status: finished and tested
 **/
write2file = function(filename, dataset, new_path){
	var path = '/home/abb/Documents/www2/moduleBase/data/analysis/';
	if(new_path !== undefined){
		path = new_path;
	}
	if(!filename || ! dataset){
		console.warn('No data or file to write'); return;
	}
//	fs.writeFile(__dirname+'/results/data/'+filename, dataset, function(err){
	fs.writeFile(path+filename, dataset, function(err){
	 if(err) {
	      console.error(err);
	  } else {
	  	 console.log('Data generated: '+filename);
		}	
	});
}	


/*
 * Util: remove duplicate entries in an array
 * status: finished
 **/
function uniq(a) {
  return a.sort().filter(function(item, pos, ary) {
      return !pos || item != ary[pos - 1];
  })
}




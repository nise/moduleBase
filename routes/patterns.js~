	



var 
	mongoose = require( 'mongoose' ),
	Patterns  = mongoose.model( 'Patterns' )
	fs = require('node-fs'),
	path = require('path'),
	csv = require('csv')
	;


/*
Import Pattern data from LaTeX files
**/
exports.folderImport = function ( req, res ){	

	// flush database in order to reload the patterns later on
	//Patterns.remove({}, function(err) { console.log('collection of patterns removed') });
	
	// 
	var dir = './data/patterns';
	dir = '/home/abb/Documents/proj_001_doc/work/chapter/patterns/macro';
	var files = fs.readdirSync(dir);
	var name = '--';
	for(var i in files){
		if ( files.hasOwnProperty(i)){   
			name = dir+'/'+files[i];
			if (fs.statSync(name).isDirectory()){
			   //console.log('--found dir')
			}else if(files[i].slice(-1) === '~'){ 
				//console.log('--found tmp')
			}else{
				//console.log(files[i])
				fs.readFile(name, 'utf8', function(err, data) {
					if (err){
						console.log(err);
					}
					error = false; 
				
					// cleans inline comments
					var cl = function(str){
						if(str == undefined){ return; }
						var arr = str.split(/\n/);
						for(var a = 0; a < arr.length; a++){
							var matches = arr[a].match(/^(%)/gi);
							if(matches != null){ 
								arr.splice(a,1);
							}
							arr[a] = arr[a].split('%')[0].replace(/\t/gi,'');
						}
						return sc2links(arr.join(""));
					};
					/* handle: 
						citations, 
						href, 
						textit, 
						protect 
						footnotes in figures
						images in consequences ... detail on demand
						multiple images to one caption
					
						see: http://daringfireball.net/projects/markdown/syntax#link
				
					*/
					// handle textsc
					var sc2links = function (str) {
						return str
							.replace(/~/g, "")
							.replace(/\\item/g, "\n\n *  ")
							.replace(/\\end{itemize}/g,'\n\n')
							.replace(/\\begin{itemize}/g,'')
							.replace(/\\textsc\{(.*?)\}/g, "[$1](/patterns/view/$1)")
							.replace(/\\cite\{(.*?)\}/g, "[$1]")
							.replace(/\\citeN\{(.*?)\}/g, "[$1]")
							; 
					};
					//
					var p = {};
					p.name = cl( data.split(/%%<name>%%%/g)[1] );
					p.name = p.name == undefined ? 'xx' : p.name;
					//p.alias = '';
					//p.synopsis = '';
					//p.confidence = '';
					//p.illustration = '';
					p.diagram = { image: cl( data.split(/%%<diagram-img>%%%/g)[1] ), caption: cl( data.split(/%%<diagram-caption>%%%/g)[1] )};
				
					p.context = cl( data.split(/%%<context>%%%/g)[1] );
					p.problem = cl( data.split(/%%<problem>%%%/g)[1] );
					p.forces = cl( data.split(/%%<forces>%%%/g)[1] );
					p.solution = cl( data.split(/%%<solution>%%%/g)[1] );
					p.consequences = cl( data.split(/%%<consequences>%%%/g)[1] ); // former consequences
					p.related_patterns = [];
					var related = data.split(/%%<related>%%%/g) != undefined ? cl( data.split(/%%<related>%%%/g)[1] ) : '';
					if(related != undefined){
						for(var i = 1; i < related.split(',').length; i++){
							p.related_patterns.push(
								{
									type					: 'is-a',//{ type: String, enum: [ 'is-a', 'is-contained-by', 'contains' ] }, 
									//patternID		: Schema.Types.Objectid, 
									//collection 	: String,
									label 				: related[i] 
								}	
							);
						}
					}				
	
					//p.literature	=	'',
					//p.implementation = '',  
					// examples
					p.example_description = cl( data.split(/%%<example-text>%%%/g)[1] );
					p.evidence = [];
					var img = data.split(/%%<image>%%%/g);
					var caption = data.split(/%%<caption>%%%/g);
					if( img.length == caption.length){
						for(var i = 1; i < img.length; i=i+2){
							p.evidence.push({
								example: img[i].replace("img/pattern-img/","").replace(/\n/ig,'').replace(/\ /ig,'').replace(/%/g,''), 
								rational: cl( caption[i] ).replace(/\n/ig,'') 
							});
						}
					}else{
						console.log('## error_img/caption length @ '+ p.name);
					}	
					// management
					p.management = {};
					p.management = {
						author						: 'Niels Seidel',
						credits						: '', // e.g. Shepherds
						editor_comment		: cl( data.split(/%%<comment>%%%/g)[1] ),
						status						: 'pattern',
						creation_date 		: Date.now(),
						last_modified 		: Date.now(),
						revision_number		: 1
					};


					// analysis for mathing forces
						//data.split(/%%<forces>%%%/g)[1]
						//.replace(/\\textsc\{(.*?)\}/g, "[$1](/patterns/$1)")

					// analyse missing fields
					for(var k in p){
						if(p[k] == undefined){
							console.warn('## error_Missing '+k+' in '+ p.name);
							//error = true;
						}
					}
				
					// store in database
					if(! error){
						var pattern = new Patterns(p)
							.save( function( err, data, count ){
								console.log('saved pattern: '+ data.name + '/' );
								//console.log(p.context);
						});
					}	
				});// end fs
				//fs.close();
			}//end else
		}	
	}//end for
};	



/*
Returns all patterns that are no proto-patterns and calls the rendering engin ejs. to display them.
**/
exports.list = function ( req, res ){
  Patterns
		.find( { $or:[ { 'management.status' : 'pattern' }, { 'management.status' : 'workshoped-pattern' } ] } )
		.sort( 'name' )
		.exec( function ( err, patterns ){ 
			res.render( 'patterns', {
			 items : patterns
			});
		});
};

/*
**/
exports.listProtopatterns = function ( req, res ){
  Patterns
		.find( { 'management.status' : 'proto-pattern' })
		.sort( 'name' )
		.exec( function ( err, patterns ){ 
			res.render( 'patterns', {
			 items : patterns
			});
		});
};

/*
Returns the Pattern document to the requested pattern name and renders through ejs
**/
exports.listOne = function ( req, res ){
  Patterns
		.find({ name: String(req.params.name).replace(/-/g,' ') })
		.exec( function ( err, patterns ){ 
			res.render( 'patterns-single', {
			 items : patterns[0]
			});
		});
};

/*
**/
exports.update = function ( req, res ){
  Patterns.findById( req.params.id, function ( err, image ){
   	//image.filename    = req.body.filename;
   	//image.url    = req.body.url;
   	image.portal    = req.body.portal;
    image.caption = req.body.caption; 
    image.tags = String(req.body.tags).split(',');
    image.updated_at = Date.now();
    image.save( function ( err, ix, count ){
    	if(err){ console.log(err); }
    	res.end();
    
    	//res.redirect( '/images' );
    });
  });
};

/*
**/
exports.edit = function ( req, res ){
  Patterns.find({}).sort( 'name' ).lean().exec(function (err, items) {
  	if(err){
  		console.log(err);
  	}
    res.render( 'patterns-edit', {
        items   : items
    });
  });
};

	
/*
REST API CALL
**/
exports.getJSON = function(req, res) {
	Patterns.find().sort( 'name' ).lean().exec(function (err, docs) {
		res.jsonp(docs);
	});
};


/*
**/
exports.getJSONPatternNames = function ( req, res ){
  Patterns
		.find( { })
		.select('name -_id')
		.sort( 'name' )
		.exec( function ( err, patterns ){
			var arr = [];
			for(var p in patterns){
				if(patterns.hasOwnProperty(p)){
					arr.push(patterns[p].name);	
				}
			} 
			res.jsonp(arr);
		});
};	

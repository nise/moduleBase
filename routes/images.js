	



var 
	mongoose = require( 'mongoose' ),
	Images  = mongoose.model( 'Images' )
	fs = require('node-fs'),
	mv = require('mv'),
	path = require('path'),
	csv = require('csv')
	;


/*
Import files from upload folder into database and moves the files into another folder
status: unfinished
- move files fails
**/
exports.folderImport = function ( req, res ){	

	// flush database in order to reload the images later on
	Images.remove({}, function(err) { console.log('collection of images removed') });
	
	//
	 Images
		.find()
		.sort( 'filename' )
		.exec( function ( err, existing_images ){ 
			var source_dir = './public/vi-lab/img/upload';
			var dest_dir = './public/vi-lab/img/screenshots';
			var files = fs.readdirSync(source_dir);
			for(var i in files){
					if ( ! files.hasOwnProperty(i)) continue;
					if(files[i].slice(-1) === '~'){ break;}
					var file_stats = fs.statSync(source_dir+'/'+files[i]);
					if (file_stats.isDirectory()){
						  // getFiles(dir, files[i]); 
					}else{
						var portall = files[i].split('_')[1];
									var img = new Images({
										filename : files[i],
										url : dest_dir.slice(1).replace(/\/public/,'') + '/' + files[i],
										caption : '',
										tags		: [],
										portal : portall == undefined ? 'unknown' : portall.replace(".png",""),
										file_modified_at : file_stats.mtime,
										file_created_at : file_stats.ctime,
										updated_at : Date.now()
									}).save( function( err, todo, count ){
										console.log('saved: '+ dest_dir.slice(1) + '/' + files[i] );
									});
						
						
					}
			}// end for
			mv(source_dir+'', dest_dir, {mkdirp: true}, function(err) {	
				if(err){
					console.log('Error during mv in Images: '+err)
				}else{
					console.log('Moved all images from upload to screenshot folder')
				}
			});
		});
	// 		
};	


/*
**/
exports.list = function ( req, res ){
  Images
		.find()
		.sort( 'filename' )
		.exec( function ( err, images ){ 
			res.render( 'images', {
			 items : images
			});
		});
};

/*
**/
exports.getJSONImagePerFilename = function ( req, res ){
  Images
		.find({filename: req.params.filename })
		.exec( function ( err, image ){ 
			res.jsonp(image);
		});
};

/*
**/
exports.getJSONImagePerPattern = function ( req, res ){
  Images
  	.aggregate([
  		{
							"$match" 	:	{ tags: req.params.pattern }
					},
    { "$project": {
       "caption": 1,
       "portal" : 1,
       "url"		: 1,
       "filename": 1,
       "portal_lower": { "$toLower": "$portal" }
    }},
    { "$sort": { "portal_lower": 1 } }
	])
		//.find()
		//.sort('portal')
		.exec( function ( err, image ){ 
			res.jsonp(image);
		});
};

/*
**/
exports.update = function ( req, res ){
  Images.findById( req.params.id, function ( err, image ){
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
  Images.find().sort( 'portal' ).lean().exec(function (err, items) {
  	if(err){
  		console.log(err);
  	}
    res.render( 'images-edit', {
        items   : items
    });
  });
};

// remove todo item by its id
exports.destroy = function ( req, res ){
  Images.findById( req.params.id, function ( err, img ){
    img.remove( function ( err, iimg ){
      res.end();//redirect( '/images/edit' );
    });
  });
};

	
/*
REST API CALL
**/
exports.getJSON = function(req, res) {
	Images.find().sort( 'filename' ).lean().exec(function (err, docs) {
		res.jsonp(docs);
	});
};	

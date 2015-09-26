
var 
	mongoose = require( 'mongoose' ),
	Groups  = mongoose.model( 'Groups' )
	fs = require('node-fs'),
	csv = require('csv')
	;
	

/***************************************************/
/* GROUP MGMT */

	var groups = [];
	
exports.csvImportFromJSON = function ( req, res ){
	// destroy dataset first
	Groups.remove({}, function ( err, docs ){
		console.log('Removed all groups to replace them by a JSON file.');
		var vi = require('../data/groups.json');

		for(var j = 0; j < vi.length; j++){
			var t = new Groups(vi[j])
				.save( function( err, video, count ){
					if(err){
						console.log(err)
					}else{
						console.log('Imported group '+video.id+' '+video.id);
					}	
				});
		}	
	});
	//	
	
	return;				
};	

/* Load user data from csv file. Insert data into database **/
exports.csvImport = function ( req, res ){
	// read file
	fs.readFile(__dirname+'/../data/groups.csv', function read(err, data) {
		Groups.remove({}, function(err) { 
			console.log('Removed Groups from DB') 
			csv().from.string(data, {comment: '#'} )
				.to.array( function(data){
				// define group for each line
				for(var i = 1; i < data.length; i++){
					new Groups({
						id: data[i][0],
						description: data[i][1],
						persons: data[i][2],
						hs: data[i][3], 
						videos : data[i][4].split(';') // data[i][3],	"videos" : ["5294bc22985254e831000002", "2", "3"]
					})
					.save( function( err, videos, count ){
						if(err){
							console.log(err)
						}
					});	
				}
				console.log('Imported Groups from data/groups.js to DB');
			});// end read
		});// end csv	
	}); // end remove
};


/*

**/
exports.getGroups = function(req, res) {
	Groups.collection.find().sort( 'id' ).toArray(function(err, items) {
		if(err){
			console.log(err)
		}else{
      res.type('application/json');
			res.jsonp(items);  
			res.end('done');
		}	
  });
};

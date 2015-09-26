




var 
	mongoose = require( 'mongoose' ),
	Messages  = mongoose.model( 'Messages' )
	;






//
exports.create = function ( req, res ){
  new Messages({
  	id					: Number,
		type				: String,  // pattern, pattern-section or portal, general
		author			: req.body.author,
		contact			: req.body.contact,
 		message			: req.body.message,
 		reply_to		: '',
 		updated_at 	: Date.now()	
  }).save( function( err, todo, count ){
    res.redirect( '/users' );
  });
};



/****************************************
REST API CALL
**/

/*
REST call for all messages in JSON format
**/
exports.getJSON = function(req, res) {
	Messages.find().sort( 'update_at' ).lean().exec(function (err, docs) {
		res.jsonp(docs);
	});
};

/*
REST call for all messages by type in JSON format
**/
exports.getJSONbyType = function(req, res) {
	Messages.find({ type: req.params.type })
		.sort( 'update_at' )
		.lean()
		.exec(function (err, docs) {
			res.jsonp(docs);
		}
	);
};


/*
REST call
**/
exports.getJSONbyID = function(req, res) {
	Messages.findById( req.params.id, function ( err, doc ){
		res.jsonp(doc);
	});
};

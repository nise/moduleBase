


/*

**/
var 
	mongoose = require( 'mongoose' ),
	Schema   = mongoose.Schema,
	searchable = require('mongoose-searchable')
	;



/*  Make a field extensible: see feeds

var appFormSchema = new Schema({
    User_id : {type: String},
    LogTime : {type: String},
    feeds : [new Schema({
        Name: {type: String},
        Text : {type: String}
    }, {strict: false})
    ]
}, {strict: false});
*/

var Modules = new Schema({
	id				: Number,
	modulnr1	: String,
	modulnr2	: String,
	modulnr3	: String,
	modultitel: String,
	courses:[String], // 
	type: { type: String, enum: [ 'Master', 'Bachelor', 'Diplom', 'Diplom/Bachelor' ] }, 
	university: { type: String, enum: [ 'TUD/IHI', 'TUD', 'HSZG' ] }, 
	language: { type: String, enum: [ 'Deutsch', 'Englisch', 'Deutsch/Englisch' ] }, 
	
	sws: { //lehrform
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
	},	
	sws_total: Number, 
	workload: Number, //Arbeitsaufwand [h]		150	150
	workload_self  : Number, //Selbststudium [h]		90	60
	ects: Number,
	
	pvl: {
		referat: Number,
		labor: Number,
		beleg: Number,
		testat: Number,
		protokoll: Number,
		moderation: Number
	},
	pl: 	{
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
	},	
	
	tags : [Schema.Types.Mixed],
	
	summer_winter: String,
	modulverantwortlicher: String,
	struktureinheit: String,
	mail: { type: String, trim: true },
	lecturers		: String, // weitere Dozenten
	remarks_general : String,	
	remarks_internal : String,
	comments : [Schema.Types.Mixed],
	updated_at : Date

});

Modules.plugin(searchable);


Modules.index( { tags: "text" } );
	

// make indexes

	// text index
	Modules.index(
		{
		 "modulnr1": "text",
		 "modulnr2": "text",
		 "modultitel": "text",
		 "courses": "text",
		 "type": "text",
		 "university": "text",
		 "language": "text",
		 "summer_winter": "text",
		 "modulverantwortlicher": "text",
		 "mail": "text",
		 "lecturers": "text",
		 "remarks_general": "text",
		 "remarks_internal": "text",
		 "tags":"text",
		 "struktureinheit": "text"
		},
		{ unique: true },
		{
		 name: "moduleMetaIndex"
		}
	);

mongoose.model( 'Modules', Modules );	

//

		




















/*





//
var Messages = new Schema({
		id					: Number,
		type				: String,  // pattern, pattern-section or portal, general
		author			: { type: String, trim: true },
		contact			: { type: String, trim: true },
 		message			: { type: String, trim: true },
 		reply_to		: Number,
 		updated_at 	: Date	
}); 
mongoose.model( 'Messages', Messages );		
 
// 
var Portals = new Schema({
		id					: Number,
		name				: String,
		description : String,
		category		: String,
		provider		: String,
		url					: String,
		accessible	: Boolean,
		open_source	: Boolean,
		availability: String,
		tags				: Array,
		patterns		:	Array,
//		screenshots : [{type: Schema.Types.ObjectId, ref: 'Images' }],
//		comments		: [{type: Schema.Types.ObjectId, ref: 'Messages' }],
    updated_at 	: Date
});
mongoose.model( 'Portals', Portals ); 
 
 
// 
var Images = new Schema({
		url 							: String,
		filename					: String,
		caption						: String,
		tags							: Array, // patterns
		portal						: String,
		file_modified_at 	: Date,
		file_created_at 	: Date,
    updated_at 				: Date
});
mongoose.model( 'Images', Images );

// 
var Patterns = new Schema({
	pattern_id				: Number,
	name 							: { type: String, trim: true },
	alias 						: String,
	synopsis 					: String,		
	confidence 				: { type: Number, min:0, max:3 }, 
	illustration 			: String,
	context						: String,
	problem						: { type: String, trim: true },
	forces						: String, 
	solution					: { type: String, trim: true },
	consequences 			: String,
	rationale 				: String,
	diagram						: String,
	example_description : String, // additional
	evidence					: [{      
		rational 				: String,
		example						: { type: String, trim: true }
	}],		
	literature				: String,
	implementation 		: String,  
	related_patterns	:	[{
		type							: { type: String, enum: [ 'is-a', 'is-contained-by', 'contains' ] }, 
		pattern_id					: Number, 
		//collection 				: String,
		label 						: { type: String, trim: true },
	}],
	management				: {
		author						: String,
		credits						: String,
		editor_comment		: String,
		status						: { 		 // additional
													type: String, 
													enum: [ 'proto-pattern', 'pattern', 'workshoped-pattern' ] 
												},
		creation_date 		: Date,
		last_modified 		: Date,
		revision_number		: Number		
	}	
});

mongoose.model( 'Patterns', Patterns ); 
 
 
 
 
 
 
// 
var Scenes = new Schema({
		title				: String,
		number 			: Number,
		source			: String, // Source at German Fedaral Archive
		status			: String,
		description	: String,
		protagonists	: Array,
		locations		: String,
    user_id    	: String,
    length			: String,
    start				: Number,
    music				: String,
    images			: Array,
    updated_at 	: Date
});
mongoose.model( 'Scenes', Scenes );


//
var Persons = new Schema({
		shortname		: String,
		name				: String,
		surename 		: String,
		birth				: String, 
		death				: String,
		birth_place	: String,
		death_place	: String,
		profession	: String,
    bio    			: String,
    images 			: Array,
    updated_at 	: Date
});
mongoose.model( 'Persons', Persons );


var VideoMetadata = new Schema({
			 author				: String,
       institution	: String,
       title				: String,
       category			: String,
       abstract			: String,
       length				: String,
       date					: String,
       weight				: Number,
       source				: String
		});
//mongoose.model( 'VideoMetadata', VideoMetadata );


//
var Videos = new Schema({
		video		: String,
		id				: String,
		metadata 		: [{
			 author				: String,
       institution	: String,
       title				: String,
       category			: String,
       tags					: Array,
       abstract			: String,
       length				: String,
       date					: String,
       weight				: Number,
       thumbnail 		: String,
       source				: String
		}],
		links				: [], 
		toc					: [{
        label				: String,
        number			: Number,
        start				: Number,
        _comment		: String,
        date				: String
    }],
		tags				: [Schema.Types.Mixed],
		highlight		: [Schema.Types.Mixed],
		slides			: [Schema.Types.Mixed],
		comments		: [Schema.Types.Mixed],
		assessmentfillin		: [Schema.Types.Mixed],
		assessmentwriting		: [Schema.Types.Mixed],
		progress		: String,
    updated_at 	: Date
});
mongoose.model( 'Videos', Videos );




// 
var Users = new Schema({
	id: Number,
  username: String,
  password: String,
  email: String,
  name: String,
  firstname: String,
  hs: String,
  role: String,
  status: {
  	online: Boolean,
  	location: String,
  	updated_at: Date
  },
  icon: String,
  trace: Boolean,
  experimental: Boolean,
  groups: [Schema.Types.Mixed],
  updated_at 	: Date
});
mongoose.model( 'Users', Users );



// 
var Groups = new Schema({
	id: String,
	description: String,
	persons: Number,
	hs: String, 
	videos : Array,
	ep_group_pad_id: String, 
	ep_group_id: String,
  updated_at 	: Date
});
mongoose.model( 'Groups', Groups );



// 
var Scripts = new Schema({
	current_phase : Number,
  slides : Boolean,
  phases : [Schema.Types.Mixed],
  updated_at 	: Date
});
mongoose.model( 'Scripts', Scripts );


var Tests = new Schema({
	user : String,
  results : Array,
  user_results : [Schema.Types.Mixed],
  process_time: Number,
  updated_at 	: Date
});
mongoose.model( 'Tests', Tests );


var Fillin = new Schema({
	field 		: String,
	contents 	: [{
  	username 	: String,
  	user_id		: Number,	
  	text 			: String,
  	updated_at: Date
  }],
  correct : String
});
mongoose.model( 'Fillin', Fillin );


var Written = new Schema({
	field 		: String,
	contents 	: [{
  	username 	: String,
  	user_id		: Number,	
  	text 			: String,
  	updated_at: Date
  }],
  correct : String
});
mongoose.model( 'Written', Written );

*/


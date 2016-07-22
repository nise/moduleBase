


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



/*
User management
**/
var Users = new Schema({
	id: Number,
  username: String,
  password: String,
  email: String,
  name: String,
  firstname: String,
  hs: String,
  gender: String,
  culture: String,
  attribute:Number,
  role: String,
  status: {
  	online: Boolean,
  	location: String,
  	updated_at: { type: Date, default: Date.now }
  },
  icon: String,
  trace: Boolean,
  experimental: Boolean,
  groups: [Schema.Types.Mixed],
  updated_at 	: { type: Date, default: Date.now }
});
mongoose.model( 'Users', Users );




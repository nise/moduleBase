
var 
	mongoose = require( 'mongoose' ),
	Scripts  = mongoose.model( 'Scripts' )
	fs = require('node-fs'),
	csv = require('csv')
	;




 /*
 
 **/
 exports.importScript = function(){
 
    var script = 
    {
    	current_phase : 4,
    	slides : true,
    	phases: [
    		{
    			title: "Phase 1 - Selbsttest",
    			instruction: "Bitte schauen Sie sich das Video an und notieren sich die aus Ihrer Sicht wichtigsten Punkte. Sie können das Video taggen und kommentieren. Füllen Sie anschließend den <a href='/assessment'>Online-Selbsttest</a> aus.",
    		//	title_k: "Aufgabe 1 - Annotieren",
    		//	instruction_k: "Schauen Sie sich die Lernvideos an. Annotieren Sie Kapitelmarken und Schlüsselwörter in Abhängigkeit der Zeit.",
    			seq : 0,
    			groupindex: 0,
    			slides:1,
    			widgets: [
		  			{ name: 'toc', accordion:true, annotate:false },
		  			{ name: 'tags', accordion:true, annotate:true },
		  			{ name: 'comments', accordion:true, annotate:true },
		  			{ name: 'assessment', accordion:false, annotate:false },
		  			{ name: 'slides' }
		  		]	
    		},
    		{
    			title: "Phase 2 - Lückenskript",
    			instruction: "Bitte schauen Sie sich das Video an und füllen Sie gemeinsam die in den Folien enthaltenen Lücken. Bereits gefüllte Lücken können im Nachgang von Ihnen und/oder anderen Gruppenmitgliedern bearbeitet werden. (Gruppenarbeit, 2-3 Personen)",
    			//title_k: "Aufgabe 2 - Testfragen",
    			//instruction_k: "Definieren Sie Testfragen, die mit Hilfe des jeweiligen Videos beantwortet werden können. ",
    			seq : 1,
    			groupindex: 1,
    			slides:1,
    			widgets: [
		  			{ name: 'toc', accordion:true, annotate:false },
		  			{ name: 'tags', accordion:true, annotate:true },
		  			{ name: 'comments', accordion:true, annotate:true },
		  			{ name: 'assessment-fill-in', accordion:true, annotate:false },
		  			{ name: 'slides' }
    			]
    		},
    		{
    			title: "Phase 3 - kollaboratives Schreiben",
    			title_k: "Aufgabe 3 - Testdurchführung",
    			instruction: "Bitte schauen Sie sich das Video an. Sie können dieses wieder taggen und kommentieren. Diskutieren Sie in Ihrer Gruppe folgende Frage: Welche aus Video 2 bekannten Werkzeuge sollten in den einzelnen Phasen der Gruppenentwicklung nach Tuckmann (1965) und Stahl (2002) gewählt werden, um die jeweils darin ablaufenden Prozesse optimal zu unterstützen? Fassen Sie Ihre Werkzeugempfehlung inkl. einer kurzen Begründung im <a href='/collaborative-writing'>kollaborativen Schreibtool</a> zusammen.",
    			instruction_k: "Schauen Sie sich die Lernvideos noch einmal an und beantworten Sie die von anderen erstellten Aufgaben.",
    			seq : 2,
    			groupindex: 2,
    			slides:1,
    			widgets: [
		  			{ name: 'toc', accordion:true, annotate:false },
		  			{ name: 'tags', accordion:true, annotate:true },
		  			{ name: 'comments', accordion:true, annotate:true },
		  			{ name: 'assessment-fill-in', accordion:true, annotate:false },
		  			{ name: 'slides' }
		  		]	
    		},
    		{
    			title: "Phase 4 - Test im Video",
    			instruction: "Bitte schauen Sie sich das Video an und notieren sich die aus Ihrer Sicht wichtigsten Punkte. Sie können das Video taggen und kommentieren. Beantworten Sie auch die in den Folien integrierten Fragen (Einzelarbeit).",
    			title_k: "Aufgabe 4 - Diskussion & Feedback",
    			instruction_k: "Nutzen Sie die Gelegenheit die anderen Lernvideos anzusehen, absolvieren Sie weitere Tests und geben Sie anderen ein Feedback zu ihren abgegebenen Lösungen (unter 'Messages'). Überarbeiten Sie gegebenenfalls die Videos.",
    			seq : 3,
    			groupindex: 3, // == current phase in exif14, theresienstadt
    			widgets: [
		  			{ name: 'toc', accordion:true, annotate:false },
		  			{ name: 'tags', accordion:true, annotate:true },
		  		//	{ name: 'highlight', accordion:true, annotate:true },
		  			{ name: 'comments', accordion:true, annotate:true },
		  			{ name: 'assessment-fill-in', accordion:true, annotate:false },
		  			{ name: 'assessment-writing', accordion:true, annotate:false },
		  			{ name: 'slides' }
		  		]	
    		},
    		{
    			title: "Phase 5 - kollaboratives Schreiben",
    			instruction: "Bitte schauen Sie sich das Video an. Sie können dieses wieder taggen und kommentieren. Diskutieren Sie anschließend in Ihrer Gruppe die eingefügte Situationsbeschreibung und erstellen Sie gemeinsam einen fundierten Diagnosebefund mit folgenden Bestandteilen: Konfliktart und -ursache, Streitthemen, Konfliktverlauf, Parteien, Beziehungen zwischen den Parteien, Grundeinstellung zum Konflikt, Konfliktstufe nach Glasl. Ein kleiner Tipp: In der aufgezeigten Situation sind zwei verschiedene Konflikte versteckt! Beide hängen zusammen, sind jedoch getrennt voneinander zu analysieren. <br>Entscheiden Sie anschließend, welche Interventionsform Ihrer Ansicht nach in dem vorliegenden Fall geeignet ist. Dokumentieren Sie Ihre Arbeitsergebnisse in einem <a href='/collaborative-writing2'>kollaborativen Schreibtool</a>. (Gruppenarbeit, 4-6 Personen)",
    			title_k: "Aufgabe 4 - Diskussion & Feedback",
    			instruction_k: "Reflektieren Sie Ihre Ergebnisse auf Basis des bereit gestellten, alternativen Lösungsvorschlags. (Gruppenarbeit, 4-6 Personen)",
    			seq : 4,
    			groupindex: 4, 
    			widgets: [
		  			{ name: 'toc', accordion:true, annotate:false },
		  			{ name: 'tags', accordion:true, annotate:true },
		  		//	{ name: 'highlight', accordion:true, annotate:true },
		  			{ name: 'comments', accordion:true, annotate:true },
		  			{ name: 'assessment', accordion:false, annotate:false },
		  			{ name: 'slides' }
		  		]	
    		},
    		{
    			title: "Experimentalsetting",
    			instruction: "",
    			seq : 5,
    			groupindex: 5,
    			widgets: [
		  			{ name: 'toc', accordion:true, annotate:true },
//		  			{ name: 'highlight', accordion:true, annotate:true },
		  			{ name: 'tags', accordion:true, annotate:true }
		  			//{ name: 'comments', accordion:true, annotate:true },
		  			//{ name: 'assessment', accordion:true, annotate:true }
		  		]	
    		}
    	]
    };

    Scripts.remove(function(err, o){
    	if(err){
    		console.log(err)
    	}else{
        console.log("Removed script");
        new Scripts(script).save( function( err, todo, count ){
					if(err){
						console.log(err);
					}else{
						console.log("added script");
						//res.redirect( '/users' );
					}
				});;
     	}   
    });
    
    return;
    
    Scripts.insert(script, {safe:true}, function(err, result) {
	  	if(err){
    		console.log(err)
    	}else{
    		console.log("added script");
    	}
    });
	 
};




exports.getScript = function(req, res) {
	Scripts.collection.find().toArray(function(err, items) {
    	res.type('application/json');
		 	var 
				date = new Date(), 
				p = 1;
			if(date.getMonth() == 11){
				switch(date.getDate()){
					case 5: p=0; break;
					case 6: p=0; break;
					case 7: p=0; break;
					case 8: p=1; break;
					case 9: p=1; break;
					case 10: p=2; break;
					case 11: p=2; break;
					case 12: p=3; break;
					default : p = 1;
				}
			}
      //items[0]['current_phase'] = p;
      console.log('PHASE == ' + p);
    	res.jsonp(items);  //items is the object
		});
};




/* 
var schedule = require('node-schedule');
var date = new Date();
console.log(date.getYear()+'--'+date.getMonth()+'--'+date.getDay()+'--'+date.getHours()+':'+date.getMinutes());

 date = new Date(113, 11, 2, 23, 42, 0);
// 113--11--2--23:32

date=new Date();
date.setFullYear(2013,11,3,0,0,0);

var j = schedule.scheduleJob(date, function(){
	//var date = new Date();
	//console.log(date.getYear()+'--'+date.getMonth()+'--'+date.getDay()+'--'+date.getHours()+':'+date.getMinutes());
	console.log('....................The world is going to end today.');
});
*/

//var rule = new schedule.RecurrenceRule(); rule.second = 5;
//var jj = schedule.scheduleJob(rule, function(){
//    console.log('The answer to life, the universe, and everything!');
//});



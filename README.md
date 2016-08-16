# moduleBase
moduleBase is a application that keeps so called module descriptions of typical courses from different universities. These descriptions contain meta data such as university, lecturer, exames, and workload. Further more, the content of each module has been annotated with a huge set of semntical tags. The core feature of moduleBase is a advanced search functionality that allows the user to combine a multi criteria search by using boolean operators.

The current instance of moduleBase includes a data set from two german universities:

* (http://www.tu-dresden.de/)[Technische Universität Dreden] 
 * Faculty of environmental sciences 
 * (http://www.ihi-zittau.de/)[International Institute Zittau], including Senckenberg Society
 * (http://www.ioer.de/1/home/)[Leibniz Institute of Ecological Urban and Regional Development]
* (http://www.hszg.de/)[University of Applied Sciences Zittau/Görlitz]

The project follows the idea of Open Daten. All containing data is publically available. The purposes target audiences include faculty members from the cooperating universities, as well as university managers, and scientist. In order to adjust course contents and learning objectives faculty member can make use of the data by searching and comparing existing courses. 

See our (demo)[http://141.30.61.22/].

## Install instructions

### Initial setup on a server

* get the source: `git clone https://github.com/nise/moduleBase`
* restore data: `mongorestore --db video-patterns ./dump/module-base`
* test run: `node server`
* start moduleBase: `forever start -a -l forever.log -o out.log -e err.log server.js`
* stop moduleBase: `forever stop server.js`

### Update from github repository

`git fetch --all && git reset --hard origin/master`

### Database / backups

mongoDB server: `mongodb://localhost/module-base`

dump database from mongoDB: `mongodump --db module-base`

restore database to mongoDB `mongorestore --db video-patterns ./dump/module-base`



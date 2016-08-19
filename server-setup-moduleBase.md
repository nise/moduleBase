
author: niels.seidel@nise81.com
description: technical manual for setting up and running moduleBase on a linux server



------------------
# toDos
- verinice
- server PW ändern
- test reboot: xxx 
- Abnahme

------------------
# Install the server and prepare the application
- server OS:	Ubuntu 14.04.5 LTS
- hard disk: 15637332 MB ~ 20GB
- server type: VM
- server location: ZIH, TU Dresden
- IP: 141.30.61.22
- domain name: oebin.ihiz
- open ports: tcp/22, tcp/80, tcp/443
- user: service 
- password: =3crX7P]
- remark: SRC: (any nach Vorlage Sicherheitskonzept) bis dahin TU networks


**access**
Access is restricted to the TUD networks: `ssh service@141.30.61.22` => enter the password mentioned above


**setup server, node.js, database**
- set bash: `sudo chsh -s /bin/bash username`
- set encoding `sudo locale-gen en_US.UTF-8`
export LC_ALL="en_US.UTF-8"
sudo locale-gen

- install node and npm:
	sudo apt-get install build-essential libssl-dev
	curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh -o install_nvm.sh
	bash install_nvm.sh
	nvm install 5.0.0
	nvm use 5.0.0
	sudo rm /usr/bin/npm
	sudo rm /usr/bin/node
	sudo ln -s /home/service/.nvm/versions/node/v5.1.1/bin/node /usr/bin/node
	sudo ln -s /home/service/.nvm/versions/node/v5.1.1/bin/npm /usr/bin/npm

- change directory `cd ~/www/moduleBase`
- install dependencies for moduleBase `npm install`


**configure ubuntu server**
- port 80 auf port 3003 umleiten: `sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3003`

- install *forever*: `npm install -g forever`
/etc/rc.local

- open issue: setup SSL: http://stackoverflow.com/questions/16573668/best-practices-when-running-node-js-with-port-80-ubuntu-linode
- open issue: set up domain, e.g. http://moduleBase.de


------------------
# Using moduleBase

**Update moduleBase source code**
- fetch source from gitHub: `git fetch --all && git reset --hard origin/master`
- restart moduleBase: `sudo forever stop server.js && sudo forever start -a -l forever.log -o out.log -e err.log server.js`

**Run moduleBase**
- testing `node server.js`
- start production mode: `forever start -a -l forever.log -o out.log -e err.log server.js`
- stop production mode: `forever stop server.js`
- restart: `forever stop server.js && forever start -a -l forever.log -o out.log -e err.log server.js`

**Update and load module and tag data**
Possibility 1: restore an existing Database
Pessebility 2: load data from a csv (comma separated values) file:
1. Under /data/xxx you will find a csv file containing all meta data of the cours module descriptions. Open the file and make some edits if necessary.
2. The file /data/.. contains the course module names and all the tags that can be related with the modules. Make some edits here. Take care that the name of the module has an expression in the previously mention file containing the meta data.
3. Stop the production mode: `forever stop server.js`
4. Start the application with the following command: `node server.js --update-modules --update-tags`
5. Stop the application by pressing Ctrl+C and go into the production mode again: `forever start -a -l forever.log -o out.log -e err.log server.js`


------------------
# Making backups
**Source Code**
The current version can be found at gitHub: https://github.com/nise/moduleBase 
A backup of the application source is not necessary

**Database/ mongoDB**
- mongodb: mongodb://localhost/moduleBase
- dump: `mongodump --db moduleBase`
- restore: `mongorestore --db moduleBase ./dump/moduleBase`
- convert database for inspection: `bsondump collection.bson > collection.json`

Make a mongoDB backup from remote machine: xxx

**Other Files**
- from remote: xxx


------------------
# Run security tests
**zap test**
(from local machine)
- install `sudo apt-get install default-jre`
- check https://github.com/zaproxy/zaproxy/releases for newest release and install: 
	wget https://github.com/zaproxy/zaproxy/releases/download/w2016-08-09/ZAP_WEEKLY_D-2016-08-09.zip
	unzip ZAP_WEEKLY_D-2016-08-09.zip
	cd ZAP_D-2016-08-09
	bash zap.sh




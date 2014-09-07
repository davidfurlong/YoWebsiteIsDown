var express = require('express');
var bodyParser = require('body-parser');
var app     = express();

app.use(express.static(__dirname + '/public'));
var usr, url;
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/myaction', function(req, res, next) {
  	res.send('Yo user "' + req.body.username + '" now tracking '+req.body.url);
  	usr = req.body.username;
  	url = req.body.url;

	var jf = require('jsonfile')
	var util = require('util')

	var file = 'node_modules/ping-node/servers.json'
	jf.readFile(file, function(err, obj) {
		writeIt((obj));
	})

  	function writeIt(ob){
	  var jf = require('jsonfile');

	  var file = 'node_modules/ping-node/servers.json';
	  var obj = ob;
	  var n = {
	  	"url": url,
	  	"user":usr
	  }
	  obj.data.push(n);

	  jf.writeFile(file, obj, function(err) {
	  	queryServers();
	    console.log(err);
	  });
	}
	next();
});

app.listen(8080, function() {
  console.log('Server running at http://127.0.0.1:8080/');
});

queryServers();

function queryServers(){
	var servers = require('ping-node/servers.json'); 

	function ping(s, usr, cb){
		require('http').get(s, function(e){
				cb({time: new Date(), server: s, user: usr, status: e.statusCode});
		}).on('error', function(e){
				cb({time: new Date(), server: s, user: usr, error: e.message});
		})
	}

	function display(o){
		if(o.status && o.status==200) console.log(JSON.stringify(o));
		if(o.error){
			console.log(JSON.stringify(o));
			Yo = require("yo-api");
			yo = new Yo("");
			yo.yo(o.user, function (err, res, body){ return});
		} 
	}
	for(var i = 0; i < servers.data.length; i++){
		ping(servers.data[i].url, servers.data[i].user, display);
	}
	setTimeout(arguments.callee, (process.env.min||10) * 30000);
};
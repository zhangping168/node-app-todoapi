var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

app.get('/',function(req, res){
	res.send('Todo-api root');
});

app.listen(PORT, function(){
	console.log('Todo-api server is on ...');
});


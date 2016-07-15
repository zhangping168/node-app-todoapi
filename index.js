var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/',function(req, res){
	res.send('Todo-api root');
});

app.get('/todos', function(req, res){
	res.json(todos);
})

app.get('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos,{id: todoId});
	
	if(matchedTodo){
		
		res.json(matchedTodo);
	}else{
		res.status(404).send('ID not found');
	}
});

//POST
app.post('/todos',function(req, res){
	var body = req.body;
	
	//valid each field type
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		return res.status(400).send(); //unable to complete
	}
	body.id = todoNextId;
	todos.push(body);
	todoNextId++;	
	
	res.json(body);
	
});

app.listen(PORT, function(){
	console.log('Todo-api server is on ...');
});


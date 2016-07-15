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

//DELETE
app.delete('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos,{id: todoId});
	
	if(matchedTodo){
		todos = _.without(todos,matchedTodo);
		res.status(200).send();
	}else{
		res.status(404).send('ID not found');
	}
});

//UPDATE
app.put('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos,{id:todoId});
	
	if(!matchedTodo){ return res.status(404).send();}
	
	var body = _.pick(req.body, 'description','completed');
	var validAttributes = {};
	
	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		
		validAttributes.completed = body.completed;
		
	}else if(body.hasOwnProperty('completed')){
		return res.status(400).send(); //unable to complete
	}else{
		//bad data,not sending anything
	}
	
	if(body.hasOwnProperty('description') && _.isString(body.description)){
		
		validAttributes.description = body.description.trim();
		
	}else if(body.hasOwnProperty('description')){
		return res.status(400).send(); //unable to complete
	}else{
		//bad data,not sending anything
	}
	
	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});

//POST
app.post('/todos',function(req, res){
	var body = req.body; //use _.pick to pick only description and completed fields
	body = _.pick(body,'description', 'completed');
	//valid each field type
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		return res.status(400).send(); //unable to complete
	}
	
	//set body description to be trimmed value
	body.description = body.description.trim();
	
	body.id = todoNextId;
	todos.push(body);
	todoNextId++;	
	
	res.json(body);
	
});

app.listen(PORT, function(){
	console.log('Todo-api server is on ...');
});


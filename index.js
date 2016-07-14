var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [
	{
		id:1,
		description:'Go to food basic',
		complete: false
	},
	
	{
		id:2,
		description:'Take out with kids',
		complete: false
	},

	{
		id:3,
		description:'Pay the bills',
		complete: true
	}	
];
app.get('/',function(req, res){
	res.send('Todo-api root');
});

app.get('/todos', function(req, res){
	res.json(todos);
})

app.get('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id);
	var matchedTodo;
	//iterate the array to fine the matched id
	//if not found, return 404 status
	todos.forEach(function(todo){
		if(todo.id === todoId){
			matchedTodo = todo;
			
		}
	});
	
	
	if(matchedTodo){
		
		res.json(matchedTodo);
	}else{
		res.status(404).send('ID not found');
	}
});

app.listen(PORT, function(){
	console.log('Todo-api server is on ...');
});


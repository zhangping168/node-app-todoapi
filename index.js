var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt-nodejs');

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('Todo-api root');
});
//GET /todos?completed=true&q=work
app.get('/todos', function (req, res) {
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.trim().length > 0) {
		where.description = {
			$like : '%' + query.q.trim() + '%'
		}
	}

	db.todo.findAll({
		where : where
	}).then(function (todos) {
		res.json(todos);
	}, function (e) {
		res.status(500).send();
	});

})

//GET todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id);
	db.todo.findById(todoId).then(function (todo) {
		if (!!todo) {
			res.send(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function (e) {
		res.status(500).send(); //server error;
	});
});

//DELETE
app.delete ('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id);
	var where = {};

	if (todoId) {
		where.id = todoId;
	}
	db.todo.destroy({
		where : where
	}).then(function (rowsDeleted) {

		if (rowsDeleted === 1) {
			res.status(204).send('Row has been deleted');
		} else {
			res.status(404).send('ID not found');
		}
	}, function (e) {
		res.status(500).send();
	});

});

//UPDATE
app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id);
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description.trim();
	}

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	db.todo.findById(todoId).then(function (todo) {
		if (todo) {
			todo.update(attributes).then(function (todo) {
				res.json(todo.toJSON());
			}, function (e) {
				res.status(400).send();
			});
		} else {
			res.status(404).send();
		}
	}, function (e) {
		res.status(500).send();
	});

});

//POST
app.post('/todos', function (req, res) {
	var body = req.body; //use _.pick to pick only description and completed fields
	body = _.pick(body, 'description', 'completed');

	db.todo.create(body).then(function (todo) {
		res.json(todo.toJSON());
	}, function (e) {
		res.status(400).json(e);
	});

});

//USERS POST
app.post('/users', function (req, res) {
	var body = req.body;
	body = _.pick(body, 'email', 'password');
	db.user.create(body).then(function (user) {
		res.json(user.toPublicJSON());
	}, function (e) {
		res.status(400).json(e);
	});
});

//USERS login
app.post('/users/login', function (req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.authenticate(body).then(function (user) {
		res.json(user.toPublicJSON());
	}, function (e) {
		res.status(401).send();
	});

});

db.sequelize.sync().then(function () {

	app.listen(PORT, function () {
		console.log('Todo-api server is on ...');
	});
});

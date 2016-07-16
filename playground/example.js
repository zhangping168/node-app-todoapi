var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect' : 'sqlite',
		'storage' : __dirname + '/basic-sqlite-database.sqlite'
	});

var Todo = sequelize.define('todo', {
		description : {
			type : Sequelize.STRING,
			allowNull : false,
			validate : {
				len : [1, 255]
			}

		},
		completed : {
			type : Sequelize.BOOLEAN,
			allowNull : false,
			defaultValue : false
		}
	});

sequelize.sync({
	force : true
}).then(function () {
	console.log('Eveything is synced');
	Todo.create({
		description : 'LOL TEST'
	}).then(function (todo) {
		return Todo.create({
			description : 'Go to the park'
		});
	}).then(function () {
		return Todo.findAll({
			where : {
				description : {
					$like : '%lol%'
				}
			}
		});
	}).then(function (todos) {
		if (todos) {
			todos.forEach(function (todo) {
				console.log(todo.toJSON());
			});
		} else {
			console.log('No todo found');
		}
	}).catch (function (e) {
		console.log(e);
	});
});

"use strict"

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/curso_mean2', (err,res) => {
	if(err){
		throw err;
	}else{
		console.log("Base de datos conectada correctamente...");

		app.listen(port, function(){
			console.log("Servidor del API Rest escuchando en http://localhost:" + port);
		})
	}
});
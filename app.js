"use strict"

var express = require('express');
var app = express();

var bodyParser = require('body-parser');

//CARGAR RUTAS
var user_routes = require('./routes/user');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CONFIGURAR CABECERAS HTTP

//RUTAS BASE
app.use('/api', user_routes);


module.exports = app;
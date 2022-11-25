"use strict"

var express = require('express')
var app = express()

var bodyParser = require('body-parser')

//CARGAR RUTAS
var user_routes = require('./routes/user')
var artist_routes = require('./routes/artist')
var album_routes = require('./routes/album')
var song_routes = require('./routes/song')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//CONFIGURAR CABECERAS HTTP Y ACCESO CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});

//RUTAS BASE
app.use('/api', user_routes)
app.use('/api', artist_routes)
app.use('/api', album_routes)
app.use('/api', song_routes)



module.exports = app
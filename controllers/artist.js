'use strict'

var Artist = require('../models/artist')
var Song = require('../models/song')
var Album = require('../models/album')

var path = require('path')
var fs = require('fs')

function getArtist(req, res){
    var artistId = req.params.id

    Artist.findById(artistId, (err, artist) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'})
        }
        if(!artist){
            res.status(404).send({message: 'El artista no existe'})
        }else{
            res.status(200).send({artist})
        }
    })
}

function saveArtist(req, res){
    var artist = new Artist()
    var params = req.body

    artist.name = params.name
    artist.description = params.description
    artist.image = 'null'

    artist.save((err, artistStored) => {
        if(err){
            res.status(500).send({message: 'Error al guardar el artista'})
        }
        if(!artistStored){
            res.status(404).send({message: 'No se pudo guardar el artista'})
        }else{
            res.status(200).send({artist: artistStored})
        }
    })
}

module.exports = {
    getArtist,
    saveArtist
}
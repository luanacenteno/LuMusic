'use strict'

var Artist = require('../models/album')
var Song = require('../models/song')
var Album = require('../models/album')
var mongoosePaginate = require('mongoose-pagination')
var path = require('path')
var fs = require('fs')


function saveAlbum(req, res){
    var album = new Album()
    var params = req.body

    album.title = params.title
    album.description = params.description
    album.year = params.year
    album.image = 'null'
    album.artist = params.artist


    album.save((err, albumStored) => {
        if(err){
            res.status(500).send({message: 'Error al guardar el album'})
        }
        if(!albumStored){
            res.status(404).send({message: 'No se pudo guardar el album'})
        }else{
            res.status(200).send({album: albumStored})
        }
    })
}

function getAlbum(req, res){
    var albumId = req.params.id

    Album.findById(albumId, (err, album) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'})
        }else{
            if(!album){
                res.status(404).send({message: 'El album no existe'})
            }else{
                res.status(200).send({album})
            }
        }
    })
}

module.exports = {
    saveAlbum,
    getAlbum
}
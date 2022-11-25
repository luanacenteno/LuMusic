'use strict'

var Song = require('../models/song')
var Artist = require('../models/artist')
var Album = require('../models/album')
var mongoosePaginate = require('mongoose-pagination')
var path = require('path')
var fs = require('fs')

function saveSong(req, res){
    var song = new Song()
    var params = req.body

    song.number = params.number
    song.name = params.name
    song.duration = params.duration
    song.file = 'null'
    song.album = params.album

    song.save((err, songStored) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'})
        }else{
            if(!songStored){
                res.status(404).send({message: 'No se pudo guardar la canción'})
            }else{
                res.status(200).send({song: songStored})
            }
        }
    })
}

function getSong(req, res){
    var songId = req.params.id

    Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'})
        }else{
            if(!song){
                res.status(404).send({message: 'El song no existe'})
            }else{
                res.status(200).send({song})
            }
        }
    })
}

function getSongs(req, res){
    var albumId = req.params.album
    var find

    if(!albumId){
        find = Song.find({}).sort('number')
    }else{
        find = Song.find({album: albumId}).sort('title')
    }

    find.populate({
        path: 'album', 
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, songs) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'})
        }else{
            if(!songs){
                res.status(404).send({message: 'No hay canciones'})
            }else{
                res.status(200).send({songs})
            }
        }
    })
}

function updateSong(req, res){
    var songId = req.params.id
    var update = req.body

    Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'})
        }else{
            if(!songUpdated){
                res.status(404).send({message: 'No se pudo actualizar la canción'})
            }else{
                res.status(200).send({album: songUpdated})
            }
        }
    })
}

function deleteSong(req, res){
    var songId = req.params.id

    Song.findByIdAndDelete(songId, (err, songDeleted) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'})
        }else{
            if(!songDeleted){
                res.status(404).send({message: 'No se pudo actualizar la canción'})
            }else{
                res.status(200).send({songDeleted})
            }
        }
    })
}

function uploadFile(req, res){
    var songId = req.params.id
    var file_name = 'Sin archivo'

    if(req.files){
        var file_path = req.files.file.path
        var file_split = file_path.split('\\')
        var file_name = file_split[2]
        var ext_split = file_name.split('.')
        var file_ext = ext_split[1]
        
        if(file_ext == 'mp3' || file_ext == 'ogg'){
            Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
                if(err){
                    res.status(500).send({message: 'Error al actualizar el archivo de la canción'})
                }else{
                    if(!songUpdated){
                        res.status(404).send({message: 'No se ha podido actualizar el archivo de la canción'})
                    }else{
                        res.status(200).send({artist: songUpdated})
                    }
                }
            })
        }else{
            res.status(200).send({message: 'Extension de archivo inválida'})
        }
    }else{
        res.status(200).send({message: 'No se ha subido ninguna archivo'})
    }
}

function getFile(req, res){
    var fileSong= req.params.fileSong
    var path_file = './uploads/songs/' + fileSong

    var exists = fs.existsSync(path_file)
    if(exists){
        res.sendFile(path.resolve(path_file))
    }else{
        res.status(200).send({message: 'El archivo no existe'})
    }
}

module.exports = {
    saveSong,
    getSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getFile
}

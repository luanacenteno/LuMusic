'use strict'

var Artist = require('../models/album')
var Song = require('../models/song')
var Album = require('../models/album')
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
            res.status(500).send({message: 'Error en el servidor'})
        }else{
            if(!albumStored){
                res.status(404).send({message: 'No se pudo guardar el album'})
            }else{
                res.status(200).send({album: albumStored})
            }
        }
    })
}

function getAlbum(req, res){
    var albumId = req.params.id

    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
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

function getAlbums(req, res){
    var artistId = req.params.artist
    var find

    if(!artistId){
        find = Album.find({}).sort('title')
    }else{
        find = Album.find({artist: artistId}).sort('year')
    }

    find.populate({path: 'artist'}).exec((err, album) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'})
        }else{
            if(!album){
                res.status(404).send({message: 'No hay albums'})
            }else{
                res.status(200).send({albums: album})
            }
        }
    })
}

function updateAlbum(req, res){
    var albumId = req.params.id
    var update = req.body

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'})
        }else{
            if(!albumUpdated){
                res.status(404).send({message: 'No se pudo actualizar el album'})
            }else{
                res.status(200).send({album: albumUpdated})
            }
        }
    })
}

function deleteAlbum(req, res){
    var albumId = req.params.id

    Album.findByIdAndDelete(albumId, (err, albumRemoved) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'})
        }else{
            if(!albumRemoved){
                res.status(404).send({message: 'No se pudo eliminar el album'})
            }else{
                Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
                    if(err){
                        res.status(500).send({message: "Error al eliminar la canción"})
                    }else{
                        if(!songRemoved){
                            res.status(404).send({message: "La canción no ha sido eliminada"})
                        }else{
                            res.status(200).send({albumRemoved})
                        }
                    }
                })
            }
        }
    })
}

function uploadImage(req, res){
    var albumId = req.params.id
    var file_name = 'Sin imagen'

    if(req.files){
        var file_path = req.files.image.path
        var file_split = file_path.split('\\')
        var file_name = file_split[2]
        var ext_split = file_name.split('.')
        var file_ext = ext_split[1]
        
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'jpeg'){
            Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
                if(err){
                    res.status(500).send({message: 'Error al actualizar la imagen del artista'})
                }else{
                    if(!albumUpdated){
                        res.status(404).send({message: 'No se ha podido actualizar la imagen'})
                    }else{
                        res.status(200).send({artist: albumUpdated})
                    }
                }
            })
        }else{
            res.status(200).send({message: 'Extension de archivo inválida'})
        }
    }else{
        res.status(200).send({message: 'No se ha subido ninguna imagen'})
    }
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile
    var path_file = './uploads/albums/' + imageFile

    var exists = fs.existsSync(path_file)
    if(exists){
        res.sendFile(path.resolve(path_file))
    }else{
        res.status(200).send({message: 'La imagen no existe'})
    }
}


module.exports = {
    saveAlbum,
    getAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}
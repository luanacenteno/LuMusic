'use strict'

var Artist = require('../models/artist')
var Song = require('../models/song')
var Album = require('../models/album')
var mongoosePaginate = require('mongoose-pagination')
var path = require('path')
var fs = require('fs')

function saveArtist(req, res){
    var artist = new Artist()
    var params = req.body

    artist.name = params.name
    artist.description = params.description
    artist.image = 'null'

    artist.save((err, artistStored) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'})
        }else{
            if(!artistStored){
                res.status(404).send({message: 'No se pudo guardar el artista'})
            }else{
                res.status(200).send({artist: artistStored})
            }
        }
        
    })
}

function getArtist(req, res){
    var artistId = req.params.id

    Artist.findById(artistId, (err, artist) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'})
        }else{
            if(!artist){
                res.status(404).send({message: 'El artista no existe'})
            }else{
                res.status(200).send({artist})
            }
        }
    })
}

function getArtists(req, res){
    if(req.params.page){
        var page = req.params.page
    }else{
        var page = 1
    }
    var itemsPerPage = 3

    Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){
        if(err){
            res.status(500).send({message: 'Error en la petición'})
        }else{
            if(!artists){
                res.status(404).send({message: 'No hay artistas!'})
            }else{
                return res.status(200).send({total_artists: total, artists: artists})
            }
        }
    })  
}

function updateArtist(req, res){
    var artistId = req.params.id
    var update = req.body

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'})
        }else{
            if(!artistUpdated){
                res.status(404).send({message: 'No se pudo actualizar el artista'})
            }else{
                res.status(200).send({artist: artistUpdated})
            }
        }
    })
}

function deleteArtist(req, res){
    var artistId = req.params.id
    
    Artist.findByIdAndDelete(artistId, (err, artistRemoved) => {
        if(err){
            res.status(500).send({message: 'Error al eliminar el artista'})
        }else{
            if(!artistRemoved){
                res.status(404).send({message: 'No se pudo eliminar el artista'})
            }else{
                Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
                    if(err){
                        res.status(500).send({message: 'Error al eliminar el album'})
                    }else{
                        if(!albumRemoved){
                            res.status(404).send({message: 'El album no ha sido eliminado'})
                        }else{
                            Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
                                if(err){
                                    res.status(500).send({message: "Error al eliminar la canción"})
                                }else{
                                    if(!songRemoved){
                                        res.status(404).send({message: "La canción no ha sido eliminada"})
                                    }else{
                                        res.status(200).send({artistRemoved})
                                    }
                                }
                            })
                        }
                    }
                })
            }
        }
    })
}

function uploadImage(req, res){
    var artistId = req.params.id
    var file_name = 'Sin imagen'

    if(req.files){
        var file_path = req.files.image.path
        var file_split = file_path.split('\\')
        var file_name = file_split[2]
        var ext_split = file_name.split('.')
        var file_ext = ext_split[1]
        
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'jpeg'){
            Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {
                if(err){
                    res.status(500).send({message: 'Error al actualizar la imagen del artista'})
                }else{
                    if(!artistUpdated){
                        res.status(404).send({message: 'No se ha podido actualizar la imagen'})
                    }else{
                        res.status(200).send({artist: artistUpdated})
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
    var path_file = './uploads/artists/' + imageFile

    var exists = fs.existsSync(path_file)
    if(exists){
        res.sendFile(path.resolve(path_file))
    }else{
        res.status(200).send({message: 'La imagen no existe'})
    }
}

module.exports = {
    getArtist,
    getArtists,
    saveArtist,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}
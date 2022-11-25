'use strict'

var AlbumController = require('../controllers/album')
var express = require('express')
var api = express.Router()
var md_auth = require('../middlewares/authenticated')
var multipart = require('connect-multiparty')
var md_upload = multipart({ uploadDir: './uploads/albums'})


api.post('/save-album', md_auth.ensureAuth, AlbumController.saveAlbum)
api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum)
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums)
api.put('/update-album/:id', md_auth.ensureAuth, AlbumController.updateAlbum)
api.delete('/delete-album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum)
api.post('/upload-image-album/:id', [md_upload, md_auth.ensureAuth], AlbumController.uploadImage)
api.get('/get-image-album/:imageFile', AlbumController.getImageFile)



module.exports = api

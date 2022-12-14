'use strict'

var ArtistController = require('../controllers/artist')
var express = require('express')
var api = express.Router()
var md_auth = require('../middlewares/authenticated')
var multipart = require('connect-multiparty')
var md_upload = multipart({ uploadDir: './uploads/artists'})


api.post('/save-artist', md_auth.ensureAuth, ArtistController.saveArtist)
api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist)
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists)
api.put('/update-artist/:id', md_auth.ensureAuth, ArtistController.updateArtist)
api.delete('/delete-artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist)
api.post('/upload-image-artist/:id', [md_upload, md_auth.ensureAuth], ArtistController.uploadImage)
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile)


module.exports = api

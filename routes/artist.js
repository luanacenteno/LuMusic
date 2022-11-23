'use strict'

var ArtistController = require('../controllers/artist')
var express = require('express')
var api = express.Router()
var md_auth = require('../middlewares/authenticated')

api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist)
api.post('/save-artist', md_auth.ensureAuth, ArtistController.saveArtist)


module.exports = api

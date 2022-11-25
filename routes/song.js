'use strict'

var SongController = require('../controllers/song')
var express = require('express')
var api = express.Router()
var md_auth = require('../middlewares/authenticated')
var multipart = require('connect-multiparty')
var md_upload = multipart({ uploadDir: './uploads/songs'})


api.post('/save-song', md_auth.ensureAuth, SongController.saveSong)
api.get('/song/:id', md_auth.ensureAuth, SongController.getSong)
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs)
api.put('/update-song/:id', md_auth.ensureAuth, SongController.updateSong)
api.delete('/delete-song/:id', md_auth.ensureAuth, SongController.deleteSong)
api.post('/upload-file-song/:id', [md_upload, md_auth.ensureAuth], SongController.uploadFile)
api.get('/get-file-song/:fileSong', SongController.getFile)

module.exports = api

const express = require('express')
const router = express.Router()
const client = require('../controller/client/index')
const manage = require('../controller/manage/index')

router.get('/search', client.search)

router.get('/category', client.category)

router.get('/fundraiser/:id', client.fundraiser)

router.get('/donateData/:id', client.donateData)

router.post('/donation', client.donation)

router.post('/addFunfraiser', manage.addFunfraiser)

router.put('/updateFunfraiser', manage.updateFunfraiser)

router.delete('/removeFundraiser/:id', manage.removeFundraiser)

router.post('/uploadImage', manage.uploadImage)

router.get('/file/*', manage.checkImage)

module.exports = router
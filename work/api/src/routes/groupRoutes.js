const groupRouter = require('express').Router()
const groupController = require('../controllers/groupControllers')

groupRouter.get('/all', groupController.getAll)

module.exports = groupRouter
const announcRouter = require('express').Router()
const announcController = require('../controllers/announcementControllers')

announcRouter.post('/', announcController.getById)
announcRouter.post('/add', announcController.add)

module.exports = announcRouter
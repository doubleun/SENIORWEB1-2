const groupRouter = require('express').Router()
const groupController = require('../controllers/groupControllers')

groupRouter.get('/all', groupController.getAll)
groupRouter.post('/createGroup', groupController.createGroup)
groupRouter.put('/statusgroup', groupController.statusgroup)


module.exports = groupRouter
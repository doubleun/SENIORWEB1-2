const groupRouter = require('express').Router()
const groupController = require('../controllers/groupControllers')

groupRouter.get('/getByMajor', groupController.getByMajor) // addmin, co, advisor, committee
groupRouter.get('/delete', groupController.deletes) // admin, co

module.exports = groupRouter
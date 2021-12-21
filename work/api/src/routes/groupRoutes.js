const groupRouter = require('express').Router()
const groupController = require('../controllers/groupControllers')

groupRouter.get('/getByMajor', groupController.getByMajor) // addmin, co, advisor, committee
groupRouter.get('/delete', groupController.deletes) // admin, co
groupRouter.get('/all', groupController.getAll)
groupRouter.post('/createGroup', groupController.createGroup)
groupRouter.put('/statusgroup', groupController.statusgroup)
groupRouter.post('/getByRole', groupController.getByRole)


module.exports = groupRouter
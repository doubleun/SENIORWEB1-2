const dateRoutes = require('express').Router();
const dateControllers = require('../controllers/dateControllers');

dateRoutes.post('/progression', dateControllers.getProgressionDuedate)
dateRoutes.post('/progression/update', dateControllers.updateProgressionDuedate)

module.exports = dateRoutes
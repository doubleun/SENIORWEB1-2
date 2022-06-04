const groupRouter = require('express').Router()
const groupController = require('../controllers/groupControllers')
const multer = require('../controllers/multer')
const middle = require('../middleware/middle')

groupRouter.post(
  '/getGroupWithID',
  [middle.checkAuthenticated, middle.checkRole([0, 2])],
  groupController.getGroupWithID
) // coordinator, teacher

groupRouter.post(
  '/getTeachersEval',
  [middle.checkAuthenticated, middle.checkRole([0, 1, 2])],
  groupController.getTeachersEval
) // coordinator, teacher, student

groupRouter.post(
  '/getTeachersWithGroupID',
  [middle.checkAuthenticated, middle.checkRole([1])],
  groupController.getTeachersWithGroupID
) // student

groupRouter.post(
  '/listOwnGroup',
  [middle.checkAuthenticated, middle.checkRole([0, 2])],
  groupController.listOwnGroup
) // coordinator, teacher

groupRouter.post(
  '/getScoreCoor',
  [middle.checkAuthenticated, middle.checkRole([0, 2])],
  groupController.getScoreCoor
) // coordinator

groupRouter.post(
  '/socre',
  [middle.checkAuthenticated, middle.checkRole([1])],
  groupController.getGroupScore
) // student

groupRouter.post(
  '/getAllAdmin',
  [middle.checkAuthenticated, middle.checkRole([2, 99])],
  groupController.getAllGroupsAdmin
) // admin, coordinator
groupRouter.post(
  '/getGroupsFinalDoc',
  [middle.checkAuthenticated, middle.checkRole([0, 1, 2, 99])],
  groupController.getGroupsFinalDoc
) // all

groupRouter.post(
  '/listrequestGroup',
  [middle.checkAuthenticated, middle.checkRole([0, 2])],
  groupController.listrequestGroup
) // coordinator, teacher

groupRouter.post(
  '/updateMemberStatus',
  [
    middle.checkAuthenticated,
    middle.checkRole([0, 1, 2]),
    middle.checkAccessDate
  ],
  groupController.updateMemberStatus
) // coordinator, student, teacher

groupRouter.post(
  '/grading',
  multer.upload.single('file'),
  [middle.checkAuthenticated, middle.checkRole([0, 2]), middle.checkAccessDate],
  groupController.grading
) // coordinator, teacher

groupRouter.post(
  '/createGroup',
  [middle.checkAuthenticated, middle.checkRole([1]), middle.checkAccessDate],
  groupController.createGroup
) // student

groupRouter.post(
  '/getGroupMajor',
  [middle.checkAuthenticated, middle.checkRole([0, 2])],
  groupController.getGroupMajor
) // coordinator, teacher

groupRouter.put(
  '/delete/one',
  [middle.checkAuthenticated, middle.checkRole([0, 2]), middle.checkAccessDate],
  groupController.deleteById
) // coordinator, teacher

groupRouter.post(
  '/countMyGroup',
  [middle.checkAuthenticated, middle.checkRole([0, 2])],
  groupController.countTeachergroup
) // coordinator, teacher

groupRouter.post(
  '/getAllFilesMajor',
  [middle.checkAuthenticated, middle.checkRole([0, 2])],
  groupController.getAllFilesMajor
) // coordinator

groupRouter.get(
  '/getAllFinalDoc',
  [middle.checkAuthenticated, middle.checkRole([0, 1, 2, 99])],
  groupController.getAllFinalDoc
) // all

groupRouter.post(
  '/countOwnGroup',
  [middle.checkAuthenticated, middle.checkRole([99])],
  groupController.countOwnGroup
) // admin

// =======================================================>

// === role not sure ===
groupRouter.get(
  '/getGroupInfo',
  [middle.checkAuthenticated, middle.checkRole([0, 1, 2])],
  groupController.getGroupInfo
) // student, coordinator, teacher

groupRouter.post(
  '/getGroupMembers',
  [middle.checkAuthenticated, middle.checkRole([1])],
  groupController.getGroupMembers
) // student

// FIXME: not sure == pendding
groupRouter.post(
  '/moveGroup',
  [middle.checkAuthenticated, middle.checkRole([99])],
  groupController.moveGroup
)
// === role not sure ===

// =======================================================>

// === this api doesn't use? ===

// FIXME: this api doesn't use?
groupRouter.put(
  '/delete',
  [middle.checkAuthenticated, middle.checkRole([0, 2])],
  groupController.deletes
) // coordinator, teacher

// FIXME: this api doesn't use?
groupRouter.get('/all', groupController.getAll)

// FIXME: this api doesn't use?
groupRouter.put('/statusgroup', groupController.statusgroup)

// FIXME: this api doesn't use?
groupRouter.post('/getByRole', groupController.getByRole)

// FIXME: this api doesn't use?
groupRouter.post('/getMyGroup', groupController.getMyGroup)

// FIXME: this api doesn't use?
groupRouter.post('/countprogress', groupController.countProgressGroup)

// FIXME: this api doesn't use?
groupRouter.get(
  '/getByMajor',
  [middle.checkAuthenticated, middle.checkRole([0, 99, 2])],
  groupController.getByMajor
) // addmin, co, advisor, committee

// FIXME: this api doesn't use?
groupRouter.post('/getOnlyGroupWithID', groupController.getOnlyGroupWithID) // teacher

// === this api doesn't use? ===

// =======================================================>

module.exports = groupRouter

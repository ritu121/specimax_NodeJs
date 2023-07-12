const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/site.controller');
const adminController = require('../../controllers/admin/site.controller');
const { authorize, ADMIN, ADMIN_USER } = require('../../middlewares/auth');
const {
  listSites,
  createSite,
  replaceSite,
  updateSite,
  addTeamMember,
  addCheckPoint
} = require('../../validations/site.validation');
const { handlePermission } = require('../../middlewares/permissions');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('locId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/trackers List Trackers
   * @apiDescription Get a list of trackers
   * @apiVersion 1.0.0
   * @apiName ListTrackers
   * @apiGroup tracker
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   tracker's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Trackers per page
   * @apiParam  {String}             [name]       tracker's name
   * @apiParam  {String}             [email]      tracker's email
   * @apiParam  {String=tracker,admin}  [role]       tracker's role
   *
   * @apiSuccess {Object[]} trackers List of trackers.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated trackers can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(ADMIN_USER), validate(listSites), controller.list)
  .post(authorize(ADMIN_USER), validate(createSite), controller.create);

// router
//   .route('/company')
//   .get(authorize(), controller.companySites);
  
router
  .route('/profile')
  .get(authorize(), controller.loggedIn);

router
  .route('/:locId')
  /**
   * @api {get} v1/trackers/:id Get Tracker
   * @apiDescription Get tracker information
   * @apiVersion 1.0.0
   * @apiName GetTracker
   * @apiGroup Tracker
   * @apiPermission tracker
   *
   * @apiHeader {String} Authorization   Tracker's access token
   *
   * @apiSuccess {String}  id         Tracker's id
   * @apiSuccess {String}  name       Tracker's name
   * @apiSuccess {String}  email      Tracker's email
   * @apiSuccess {String}  role       Tracker's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated trackers can access the data
   * @apiError (Forbidden 403)    Forbidden  Only tracker with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound  Tracker does not exist
   */
  .get(authorize(ADMIN_USER), controller.get)
  /**
   * @api {put} v1/trackers/:id Replace Tracker
   * @apiDescription Replace the whole tracker document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceTracker
   * @apiGroup Tracker
   * @apiPermission tracker
   *
   * @apiHeader {String} Authorization   Tracker's access token
   *
   * @apiParam  {String}             email     Tracker's email
   * @apiParam  {String{6..128}}     password  Tracker's password
   * @apiParam  {String{..128}}      [name]    Tracker's name
   * @apiParam  {String=Tracker,admin}  [role]    tracker's role
   * (You must be an ADMIN_USERto change the tracker's role)
   *
   * @apiSuccess {String}  id         Tracker's id
   * @apiSuccess {String}  name       Tracker's name
   * @apiSuccess {String}  email      Tracker's email
   * @apiSuccess {String}  role       Tracker's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated trackers can modify the data
   * @apiError (Forbidden 403)    Forbidden Only tracker with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound Tracker does not exist
   */
  .put(authorize(ADMIN_USER), validate(replaceSite), controller.replace)
  /**
   * @api {patch} v1/trackers/:id Update Tracker
   * @apiDescription Update some fields of a tracker document
   * @apiVersion 1.0.0
   * @apiName UpdateTracker
   * @apiGroup Tracker
   * @apiPermission Tracker
   *
   * @apiHeader {String} Authorization   Tracker's access token
   *
   * @apiParam  {String}             email     Tracker's email
   * @apiParam  {String{6..128}}     password  Tracker's password
   * @apiParam  {String{..128}}      [name]    Tracker's name
   * @apiParam  {String=tracker,admin}  [role]    Tracker's role
   * (You must be an ADMIN_USERto change the tracker's role)
   *
   * @apiSuccess {String}  id         Tracker's id
   * @apiSuccess {String}  name       Tracker's name
   * @apiSuccess {String}  email      Tracker's email
   * @apiSuccess {String}  role       Tracker's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated trackers can modify the data
   * @apiError (Forbidden 403)    Forbidden Only tracker with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound Tracker does not exist
   */
  .patch(authorize(ADMIN_USER), validate(updateSite), controller.update)
  /**
   * @api {patch} v1/trackers/:id Delete Tracker
   * @apiDescription Delete a tracker
   * @apiVersion 1.0.0
   * @apiName DeleteTracker
   * @apiGroup Tracker
   * @apiPermission tracker
   *
   * @apiHeader {String} Authorization   Tracker's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated trackers can delete the data
   * @apiError (Forbidden 403)  Forbidden Only tracker with same id or admins can delete the data
   * @apiError (Not Found 404)  NotFound Tracker does not exist
   */
  .delete(authorize(ADMIN_USER), controller.remove);

router.route('/site-team/:locId')
  .get(authorize(ADMIN_USER),adminController.getSiteTeam)

router.route('/live-view/:locId')
  .get(authorize(ADMIN_USER),adminController.getLiveView)
router.route('/overview/:locId')
  .get(authorize(ADMIN_USER),adminController.getOverview)

router.route('/add-member/:locId')
  .post(authorize(ADMIN_USER), validate(addTeamMember), adminController.addTeamMember)

router
  .route('/list/clockinout')
  .get(authorize(ADMIN_USER), adminController.allClockInOut);

  router
  .route('/export/clockinout')
  .get(authorize(ADMIN_USER), adminController.exportAllClockInOut);

router
  .route('/list/failedclock')
  .get(authorize(ADMIN_USER), adminController.failedCheckin);

router
  .route('/export/failedclock')
  .get(authorize(ADMIN_USER), adminController.exportFailedCheckin);

router
  .route('/export/me')
  .post(authorize(ADMIN_USER), adminController.exportMe);

module.exports = router;

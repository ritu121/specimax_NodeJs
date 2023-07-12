const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/shift.type.controller');
const { authorize, ADMIN, ADMIN_USER } = require('../../middlewares/auth');
const {
  listLogs,
  createLogs,
  replaceLogs,
  updateLogs
} = require('../../validations/shift.logs.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('typeId', controller.load);

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
  .get(authorize(), controller.list)
  /**
   * @api {post} v1/trackers Create tracker
   * @apiDescription Create a new tracker
   * @apiVersion 1.0.0
   * @apiName Createtracker
   * @apiGroup tracker
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   tracker's access token
   *
   * @apiParam  {String}             email     tracker's email
   * @apiParam  {String{6..128}}     password  tracker's password
   * @apiParam  {String{..128}}      [name]    tracker's name
   * @apiParam  {String=tracker,admin}  [role]    tracker's role
   *
   * @apiSuccess (Created 201) {String}  id         tracker's id
   * @apiSuccess (Created 201) {String}  name       tracker's name
   * @apiSuccess (Created 201) {String}  email      tracker's email
   * @apiSuccess (Created 201) {String}  role       tracker's role
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated trackers can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(), controller.create);



router
  .route('/:typeId')
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
  .patch(authorize(ADMIN_USER), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove)
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
   * (You must be an admin to change the tracker's role)
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
  
module.exports = router;

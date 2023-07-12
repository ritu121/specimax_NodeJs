const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/question.controller');
const { authorize, ADMIN_USER } = require('../../middlewares/auth');
const {
  listQuestions,
  createQuestion,
  replaceQuestion,
  updateQuestion,
} = require('../../validations/question.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('questionId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/trackers List Trackers
   * @apiDescription Get a list of trackers
   * @apiVersion 1.0.0
   * @apiName ListTrackers
   * @apiGroup tracker
   * @apiPermission ADMIN_USER
   *
   * @apiHeader {String} Authorization   tracker's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Trackers per page
   * @apiParam  {String}             [name]       tracker's name
   * @apiParam  {String}             [email]      tracker's email
   * @apiParam  {String=tracker,ADMIN_USER}  [role]       tracker's role
   *
   * @apiSuccess {Object[]} trackers List of trackers.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated trackers can access the data
   * @apiError (Forbidden 403)     Forbidden     Only ADMIN_USERs can access the data
   */
  .get(authorize(ADMIN_USER), validate(listQuestions), controller.list)
  /**
   * @api {post} v1/trackers Create tracker
   * @apiDescription Create a new tracker
   * @apiVersion 1.0.0
   * @apiName Createtracker
   * @apiGroup tracker
   * @apiPermission ADMIN_USER
   *
   * @apiHeader {String} Authorization   tracker's access token
   *
   * @apiParam  {String}             email     tracker's email
   * @apiParam  {String{6..128}}     password  tracker's password
   * @apiParam  {String{..128}}      [name]    tracker's name
   * @apiParam  {String=tracker,ADMIN_USER}  [role]    tracker's role
   *
   * @apiSuccess (Created 201) {String}  id         tracker's id
   * @apiSuccess (Created 201) {String}  name       tracker's name
   * @apiSuccess (Created 201) {String}  email      tracker's email
   * @apiSuccess (Created 201) {String}  role       tracker's role
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated trackers can create the data
   * @apiError (Forbidden 403)     Forbidden        Only ADMIN_USERs can create the data
   */
  .post(authorize(ADMIN_USER), validate(createQuestion), controller.create);

router
  .route('/profile')
  /**
   * @api {get} v1/trackers/profile Tracker Profile
   * @apiDescription Get logged in tracker profile information
   * @apiVersion 1.0.0
   * @apiName TrackerProfile
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
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Trackers can access the data
   */
  .get(authorize(), controller.loggedIn);

router
  .route('/:questionId')
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
   * @apiError (Forbidden 403)    Forbidden  Only tracker with same id or ADMIN_USERs can access the data
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
   * @apiParam  {String=Tracker,ADMIN_USER}  [role]    tracker's role
   * (You must be an ADMIN_USER to change the tracker's role)
   *
   * @apiSuccess {String}  id         Tracker's id
   * @apiSuccess {String}  name       Tracker's name
   * @apiSuccess {String}  email      Tracker's email
   * @apiSuccess {String}  role       Tracker's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated trackers can modify the data
   * @apiError (Forbidden 403)    Forbidden Only tracker with same id or ADMIN_USERs can modify the data
   * @apiError (Not Found 404)    NotFound Tracker does not exist
   */
  .put(authorize(ADMIN_USER), validate(replaceQuestion), controller.replace)
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
   * @apiParam  {String=tracker,ADMIN_USER}  [role]    Tracker's role
   * (You must be an ADMIN_USER to change the tracker's role)
   *
   * @apiSuccess {String}  id         Tracker's id
   * @apiSuccess {String}  name       Tracker's name
   * @apiSuccess {String}  email      Tracker's email
   * @apiSuccess {String}  role       Tracker's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated trackers can modify the data
   * @apiError (Forbidden 403)    Forbidden Only tracker with same id or ADMIN_USERs can modify the data
   * @apiError (Not Found 404)    NotFound Tracker does not exist
   */
  .patch(authorize(ADMIN_USER), validate(updateQuestion), controller.update)
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
   * @apiError (Forbidden 403)  Forbidden Only tracker with same id or ADMIN_USERs can delete the data
   * @apiError (Not Found 404)  NotFound Tracker does not exist
   */
  .delete(authorize(ADMIN_USER), controller.remove);

module.exports = router;

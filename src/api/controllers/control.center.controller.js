const httpStatus = require('http-status');
const { omit } = require('lodash');
const LogsModel = require('../models/shift.logs.model');
const multer = require('multer');

exports.get = (req, res) => res.json({code: 200, message: 'Control Center Number retrieved successfully.', data: {'number':'028000900'}});

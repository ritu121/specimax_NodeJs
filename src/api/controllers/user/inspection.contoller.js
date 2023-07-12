const httpStatus = require('http-status');
const moment = require('moment-timezone');
const User = require('../../models/user.model');
const { jwtExpirationInterval } = require('../../../config/vars');
const emailProvider = require('../../services/emails/emailProvider');
const {sentPushNotification} = require('../../utils/helper.js');
const Report = require('../../models/report.model');
const QuestionAnswer = require('../../models/report.question.answer.model');
const Question = require('../../models/question.model');

exports.all = async(req, res, next) => {
   
}





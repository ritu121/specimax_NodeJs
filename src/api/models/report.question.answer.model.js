const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const reportQuestionAnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.ObjectId,
    ref: 'ReportQuestion',
    required: true,
  },
  answer: {
    type: String,
    enum: ['YES','NO','NA'],
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: String,
    required: false,
    default : null
  },
}, {
  timestamps: true,
});


reportQuestionAnswerSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'questionId','answer','comment','createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

reportQuestionAnswerSchema.statics = {
  async get(id) {
    let question;

    if (mongoose.Types.ObjectId.isValid(id)) {
      question = await this.findById(id).exec();
    }
    if (question) {
      return question;
    }

    throw new APIError({
      message: 'Answer does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },


  list({
    page = 1, perPage = 30, questionId, answer, comment,
  }) {
    const options = omitBy({ questionId, answer, comment }, isNil);

    return this.find(options)
      .populate([
        {
          path : 'questionId',
          model : 'ReportQuestion',
          select : "question reportType siteId inspectionId",
          populate : [
            {
              path : 'reportType',
              model : 'AllReportType',
              select : "name"
            },
            {
              path : 'siteId',
              model : 'Site',
              select : "name"
            },
            {
              path : 'inspectionId',
              model : 'Report'
            }
          ]
        },
        {
          path : 'userId',
          model : 'User',
          select : "firstname lastname"
        }
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};
/**
 * @typedef SupportStatus
 */
module.exports = mongoose.model('ReportQuestionAnswer', reportQuestionAnswerSchema, 'report-question-answers');

const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');
/**
 * User Schema
 * @private
 */
const reportQuestionSchema = new mongoose.Schema({
  inspectionId: {
    type: mongoose.Schema.ObjectId,
    ref: 'ReportType',
    required:true,
  },
  question: {
    type: String,
    required: true,
    trim: true,
  },
  reportType: {
    type: mongoose.Schema.ObjectId,
    ref: 'AllReportType',
    required: true,
  },
  siteId : {
    type: mongoose.Schema.ObjectId,
    ref: 'Site',
    required: true,
  },
  choices : {
    type : Object,
    // required : false,
    default : {
      'YES' : false,
      'NO' : false,
      'NA' : false
    },
  }
  // type: {
  //   type:Number,
  //   default : 1
  // },
  // notes: {
  //   type:String
  // },
}, {
  timestamps: true,
});

/**
 * Methods
 */
 reportQuestionSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'question','inspectionId','reportType', 'siteId', 'choices','createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
 reportQuestionSchema.statics = {
  /**
     * Get user
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
  async get(id) {
    let question;

    if (mongoose.Types.ObjectId.isValid(id)) {
      question = await this.findById(id).populate('reportType inspectionId siteId').exec();
    }
    if (question) {
      return question;
    }

    throw new APIError({
      message: 'Question does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  /**
     * List users in descending order of 'createdAt' timestamp.
     *
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
  list({
    page = 1, perPage = 30, question, siteId, inspectionId
  }) {
    const options = omitBy({ question , siteId, inspectionId }, isNil);

    return this.find(options)
      .populate('reportType siteId inspectionId')
      .sort({ createdAt: 1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};
/**
 * @typedef SupportStatus
 */
module.exports = mongoose.model('ReportQuestion', reportQuestionSchema);

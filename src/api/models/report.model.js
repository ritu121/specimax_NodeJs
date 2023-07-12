const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');
/**
 * User Schema
 * @private
 */
const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  reportTypeId: {
    type: mongoose.Schema.ObjectId,
    ref: 'AllReportType',
    required: true,
  },
  siteId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Site',
    required: true,
  },
  // taskId: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'Task',
  //   required: false,
  // },
  questions: [{
    type : mongoose.Schema.ObjectId,
    ref : 'ReportQuestionAnswer',
  }],
  media:{
    type : String,
    required : false,
    default : null,
  },
  note: {
    type: String,
    required: false,
    trim: true,
  },
}, {
  timestamps: true,
});

/**
 * Methods
 */
reportSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'userId', 'reportTypeId', 'sideId', 'questions', 'media', 'note', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
reportSchema.statics = {
  /**
     * Get user
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
  async get(id) {
    let report;

    if (mongoose.Types.ObjectId.isValid(id)) {
      report = await this.findById(id).exec();
    }
    if (report) {
      return report;
    }

    throw new APIError({
      message: 'Report does not exist',
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
    page = 1, perPage = 30, _id,reportTypeId,userId, siteId, questions, media, note, startDate, endDate
  }) {
    
    if(startDate && endDate){
      const options = omitBy({ reportTypeId, _id, questions,userId,siteId, media, note, createdAt : {$gte : startDate, $lte : endDate} }, isNil);
      return this.find(options)
      .populate([
        {
          path: 'reportTypeId',
          model: 'AllReportType'
        },
        {
          path: 'siteId',
          model: 'Site'
        },
        {
          path: 'userId',
          model: 'User'
        },
        {
          path: 'questions',
          model: 'ReportQuestionAnswer',
          populate :{
            path :'questionId',
            model : 'ReportQuestion'
          }
        }
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
    }
    else if(startDate && !endDate){
      const options = omitBy({ reportTypeId, _id, questions,userId,siteId, media, note, createdAt : {$gte : startDate} }, isNil);
      return this.find(options)
      .populate([
        {
          path: 'reportTypeId',
          model: 'AllReportType'
        },
        {
          path: 'siteId',
          model: 'Site'
        },
        {
          path: 'userId',
          model: 'User'
        },
        {
          path: 'questions',
          model: 'ReportQuestionAnswer',
          populate :{
            path :'questionId',
            model : 'ReportQuestion'
          }
        }
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
    }
    if(!startDate && endDate){
      const options = omitBy({ reportTypeId,_id, questions,userId,siteId, media, note, createdAt : {$lte : endDate} }, isNil);
      return this.find(options)
      .populate([
        {
          path: 'reportTypeId',
          model: 'AllReportType'
        },
        {
          path: 'siteId',
          model: 'Site'
        },
        {
          path: 'userId',
          model: 'User'
        },
        {
          path: 'questions',
          model: 'ReportQuestionAnswer',
          populate :{
            path :'questionId',
            model : 'ReportQuestion'
          }
        }
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
    }
    else{
      const options = omitBy({ reportTypeId, _id, questions,userId,siteId, media, note }, isNil);
        return this.find(options)
        .populate([
          {
            path: 'reportTypeId',
            model: 'AllReportType'
          },
          {
            path: 'siteId',
            model: 'Site'
          },
          {
            path: 'userId',
            model: 'User'
          },
          {
            path: 'questions',
            model: 'ReportQuestionAnswer',
            populate :{
              path :'questionId',
              model : 'ReportQuestion'
            }
          }
        ])
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();
      
    }
  },
};
/**
 * @typedef SupportStatus
 */
module.exports = mongoose.model('Report', reportSchema);

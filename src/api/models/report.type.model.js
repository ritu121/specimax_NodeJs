const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');
/**
 * User Schema
 * @private
 */
const reportTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  reportTypeId: {
    type: mongoose.Schema.ObjectId,
    ref: 'AllReportType',
    required:true,
  },
  // position: {
  //   type:Number
  // },
  siteId: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Site'
  }],
  description:{
    type:String
  }
}, {
  timestamps: true,
});

/**
 * Methods
 */
 reportTypeSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name','siteId','category','description','position', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
 reportTypeSchema.statics = {
  /**
     * Get user
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
  async get(id) {
    let role;

    if (mongoose.Types.ObjectId.isValid(id)) {
      role = await this.findById(id).exec();
    }
    if (role) {
      return role;
    }

    throw new APIError({
      message: 'Report type does not exist',
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
    page = 1, perPage = 30, name, siteId, reportTypeId
  }) {
    const options = omitBy({ name, siteId, reportTypeId }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};
/**
 * @typedef SupportStatus
 */
module.exports = mongoose.model('ReportType', reportTypeSchema, 'report_types');

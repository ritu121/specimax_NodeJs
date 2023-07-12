const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');
/**
 * User Schema
 * @private
 */
const questionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type:Number,
  },
  notes: {
    type:String
  },
  formId: {
    type: mongoose.Schema.ObjectId,
    ref: 'ReportType'
  }
}, {
  timestamps: true,
});

/**
 * Methods
 */
questionSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
questionSchema.statics = {
  /**
     * Get user
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
  async get(id) {
    let question;

    if (mongoose.Types.ObjectId.isValid(id)) {
      question = await this.findById(id).exec();
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
    page = 1, perPage = 30, name,
  }) {
    const options = omitBy({ name }, isNil);

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
module.exports = mongoose.model('Question', questionSchema);

const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');
/**
 * User Schema
 * @private
 */
const taskLogs = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Task',
    required: true,
  },
  answers: {
    type: Array,
    required: false,
    trim: true,
  },
  notes: {
    type: String,
    required: false,
    trim: true,
  },
  media: {
    type: String,
    required: false,
    trim: true,
    default: ""
  },
  signature: {
    type: String,
    required: false,
    trim: true,
    default: ""
  },
}, {
  timestamps: true,
});

/**
 * Methods
 */
 taskLogs.method({
  transform() {
    const transformed = {};
    const fields = ['id','taskId', 'answers', 'notes', 'media', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
 taskLogs.statics = {
  async get(id) {
    let message;

    if (mongoose.Types.ObjectId.isValid(id)) {
      message = await this.findOne({taskId : id}).exec();
    }
    if (message) {
      return message;
    }

    throw new APIError({
      message: 'Reply messages does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

 
  list({
    page = 1, perPage = 30, title, description
  }) {
    const options = omitBy({ }, isNil);

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
module.exports = mongoose.model('TaskLogs', taskLogs);

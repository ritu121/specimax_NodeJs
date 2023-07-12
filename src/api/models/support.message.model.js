const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');
/**
 * User Schema
 * @private
 */
const supportMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  supportId :{
    type: mongoose.Schema.ObjectId,
    ref: 'Support',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  uType: {
    type: Number,
    default:0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
});

/**
 * Methods
 */
 supportMessageSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id','userId', 'supportId','uType', 'title', 'description', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
 supportMessageSchema.statics = {
  async get(id) {
    let message;

    if (mongoose.Types.ObjectId.isValid(id)) {
      message = await this.findOne({supportId : id}).exec();
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
    const options = omitBy({ title , description}, isNil);

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
module.exports = mongoose.model('SupportMessage', supportMessageSchema, 'support_messages');

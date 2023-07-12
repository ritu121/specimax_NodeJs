const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');
/**
 * User Schema
 * @private
 */
const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  identifier: {
    type: String,
    required: true,
    trim: true,
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
 pageSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'title','identifier', 'description', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
 pageSchema.statics = {
  async get(id) {
    let page;

    if (mongoose.Types.ObjectId.isValid(id)) {
      page = await this.findById(id).exec();
    }
    if (page) {
      return page;
    }

    throw new APIError({
      message: 'Page not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

 
  list({
    page = 1, perPage = 30, title, identifier, description
  }) {
    const options = omitBy({ title ,identifier, description}, isNil);

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
module.exports = mongoose.model('Page', pageSchema);

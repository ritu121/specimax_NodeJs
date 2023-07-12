const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');
/**
 * User Schema
 * @private
 */
const faqSchema = new mongoose.Schema({
  title: {
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
 faqSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'title', 'description', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
 faqSchema.statics = {
  async get(id) {
    let faq;

    if (mongoose.Types.ObjectId.isValid(id)) {
      faq = await this.findById(id).exec();
    }
    if (faq) {
      return faq;
    }

    throw new APIError({
      message: 'Faq does not exist',
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
module.exports = mongoose.model('Faq', faqSchema);

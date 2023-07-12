const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');
/**
 * User Schema
 * @private
 */
const helpSchema = new mongoose.Schema({
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
  mediaType: {
    type: String,
    enum: ['IMAGE','VIDEO',null],
    required: false,
    default : null,
  },
  media: {
    type: String,
    required: false,
    default: null,
  },
}, {
  timestamps: true,
});

/**
 * Methods
 */
 helpSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'title', 'description', 'mediaType', 'media', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
 helpSchema.statics = {
  async get(id) {
    let help;

    if (mongoose.Types.ObjectId.isValid(id)) {
        help = await this.findById(id).exec();
    }
    if (help) {
      return help;
    }

    throw new APIError({
      message: 'Help does not exist',
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
module.exports = mongoose.model('Help', helpSchema);

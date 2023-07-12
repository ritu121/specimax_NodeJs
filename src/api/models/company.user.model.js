const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');
/**
 * User Schema
 * @private
 */
const companyUserSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true,
  },
  roleId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Role',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: false,
    trim: true,
    minlength: 6,// used by the toJSON plugin
  },
  phone: {
    type: Number,
    default : null
  }
}, {
  timestamps: true,
});

/**
 * Methods
 */
 companyUserSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'email', 'roleId', 'phone', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
 companyUserSchema.statics = {
  /**
     * Get user
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
  async get(id) {
    let company;

    if (mongoose.Types.ObjectId.isValid(id)) {
      company = await this.findById(id).exec();
    }
    if (company) {
      return company;
    }

    throw new APIError({
      message: 'Company does not exist',
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
      .populate([
        {
          path : 'roleId',
          model : 'Role'
        }
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};
/**
 * @typedef Support
 */
module.exports = mongoose.model('CompanyUser', companyUserSchema,'company_users');

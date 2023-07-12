const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');
/**
 * User Schema
 * @private
 */
const siteSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true,
  },
  siteId: {
    type: Number,
    required: true,
    default: Math.floor(Math.random() * 99999999),
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: mongoose.Schema.ObjectId,
    ref: 'City',
    required: true,
  },
  country: {
    type: mongoose.Schema.ObjectId,
    ref: 'Country',
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  team:[{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }]
}, {
  timestamps: true,
});

/**
 * Methods
 */
siteSchema.method({
  transform() {
    const transformed = {}; 
    const fields = ['id', 'userId', 'siteId', 'name','address','city','country', 'latitude', 'longitude', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
siteSchema.statics = {
  /**
     * Get user
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
  async get(id) {
    let site;

    if (mongoose.Types.ObjectId.isValid(id)) {
      site = await this.findById(id)
      .populate([
        {
          path : 'companyId',
          model : 'Company'
        },
        {
          path : 'city',
          model : 'City'
        },{
          path : 'country',
          model : 'Country'
        }
      ])
      .exec();
    }
    if (site) {
      return site;
    }

    throw new APIError({
      message: 'Site does not exist',
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
        path : 'companyId',
        model : 'Company'
      },
      {
        path : 'city',
        model : 'City'
      },{
        path : 'country',
        model : 'Country'
      }
    ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};
/**
 * @typedef SupportStatus
 */
module.exports = mongoose.model('Site', siteSchema);

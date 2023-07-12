const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../errors/api-error');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');

/**
 * User Schema
 * @private
 */

const clockOutData = new mongoose.Schema({
  injurySuffered:{
    type: String,
    default:null,
  },
  taskCompleted:{
    type: String,
    default:null,
  },
  reportableIssue:{
    type: String,
    default:null,
  },
  taskStatus:{
    type: String,
    default:null,
  },
  notes:{
    type: String,
    default:null,
  }
})
const userSettingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Visitors',
    required: true,
  },
 
  visitDate: {
    type: Date,
  },
  siteId: {
    type: mongoose.Schema.ObjectId,
    ref:'Sites'
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref : 'Company'
  },
  checkIn: {
    type: Date,
  },
  checkOut: {
    type: Date,
  },
  purpose:{
    type:String
  },
  location:{
    type:String
  },
  lat:{
    type:String
  },
  lng:{
    type:String
  },
  clockOutData:{
    type:clockOutData
  },
  siteDocuments:[{
    type:mongoose.Schema.ObjectId
  }]
}, {
  timestamps: true,
});


/**
 * Methods
 */
 userSettingSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'user', 'casualShiftsSubscription', 'casualShiftsAvailability', 'profileVisibleToEmployer', 'licenseVisibleToEmployer'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

});

/**
 * Statics
 */
 userSettingSchema.statics = {
  async get(id) {
    let user;

    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await this.findById(id).exec();
    }
    if (user) {
      return user;
    }

    throw new APIError({
      message: 'Setting does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  list({
    page = 1, perPage = 30, user,
  }) {
    const options = omitBy({ user }, isNil);

    return this.find(options)
        .populate([
          {
              path: 'siteId',
              model: 'Site',
          },
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

/**
 * @typedef User
 */
module.exports = mongoose.model('VisitorBook', userSettingSchema, 'visitor_book');

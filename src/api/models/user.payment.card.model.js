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
const userCardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  cardType: {
    type: String,
    enum :['INCOMING','OUTGOING'],
    required : true,
  },
  cardHolderName: {
    type: String,
    required : true,
  },
  bankName:{
    type: String,
    required : true,
  },
  cardNumber: {
    type: Number,
    required : true,
  },
  expiryDate: {
    type: Date,
    // required : true,
    default : null
  },
  cvv: {
    type: Number,
    required : true,
  },
}, {
  timestamps: true,
});


/**
 * Methods
 */
 userCardSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'user', 'cardType', 'cardHolderName', 'bankName', 'cardNumber', 'expiryDate', 'cvv'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

});

/**
 * Statics
 */
 userCardSchema.statics = {
  async get(id) {
    let user;

    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await this.findById(id).exec();
    }
    if (user) {
      return user;
    }

    throw new APIError({
      message: 'Card does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  list({
    page = 1, perPage = 30, user,
  }) {
    const options = omitBy({ user }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

/**
 * @typedef User
 */
module.exports = mongoose.model('UserCard', userCardSchema, 'user_payment_cards');

const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');
/**
 * User Schema
 * @private
 */
const keyShiftDutySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    trim: true,
  },
  shiftId: {
    type:mongoose.Schema.ObjectId,
    ref:'CasualShift'
  }
}, {
  timestamps: true,
});

/**
 * Methods
 */
 keyShiftDutySchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'key','shiftId', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
 keyShiftDutySchema.statics = {
  async get(id) {
    let key;

    if (mongoose.Types.ObjectId.isValid(id)) {
      key = await this.findById(id).exec();
    }
    if (key) {
      return key;
    }

    throw new APIError({
      message: 'Key does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },
  async getByShift(id) {
    let key;

    if (mongoose.Types.ObjectId.isValid(id)) {
      key = await this.findOne({'shiftId':id}).exec();
    }
    if (key) {
      return key;
    }

    throw new APIError({
      message: 'Key does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

 
  list({
    page = 1, perPage = 30, key, 
  }) {
    const options = omitBy({ key}, isNil);

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
module.exports = mongoose.model('KeyShiftDuty', keyShiftDutySchema,'key_shift_duties');

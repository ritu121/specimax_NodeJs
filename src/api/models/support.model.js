const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const supportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  ticketId: {
    type: String,
    required: true,
    trim: true,
    default: Math.random().toString(36).substr(2, 9),
  },
  title: {
    type: String,
    required: true,
  },
  issue: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    required: true,
    default: new Date(),
  },
  closeDate: {
    type: Date,
    required: false,
    default: null,
  },
  statusId: {
    type: mongoose.Schema.ObjectId,
    ref: 'SupportStatus',
    required: true,
    default: "62c79b6a75125e6d08b6dac8"
  },
}, {
  timestamps: true,
});

 supportSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'userId', 'ticketId', 'title', 'issue', 'issueDate', 'closeDate', 'statusId', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });
    return transformed;
  },
});

 supportSchema.statics = {
  async get(id) {
    let support;
    if (mongoose.Types.ObjectId.isValid(id)) {
        support = await this.findById(id).exec();
    }
    if (support) {
      return support;
    }
    throw new APIError({
      message: 'Support query does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  list({
    page = 1, perPage = 30,name, issueDate, closeDate
  }) {
    const options = omitBy({ name}, isNil);
    return this.find(options)
      .populate([
        {
          path : "userId",
          model : "User"
        },
        {
          path : "statusId",
          model: "SupportStatus"
        }
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

module.exports = mongoose.model('Support', supportSchema);

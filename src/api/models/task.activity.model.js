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
const taskActivitySchema = new mongoose.Schema({
  taskId :{
    type: mongoose.Schema.ObjectId,
    ref: 'Task',
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false,
    default : null
  },
  note: {
    type:String,
    required: false,
    default : null
  },
  status: {
    type:String, 
  }
}, {
  timestamps: true,
});


/**
 * Methods
 */
taskActivitySchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'taskId','userId','note'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

});

/**
 * Statics
 */
taskActivitySchema.statics = {
  async get(id) {
    let activity;

    if (mongoose.Types.ObjectId.isValid(id)) {
        activity = await this.findById(id).exec();
    }
    if (activity) {
      return activity;
    }

    throw new APIError({
      message: 'Activity does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  list({
    page = 1, perPage = 25, taskId,
  }) {
    const options = omitBy({ taskId }, isNil);

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
module.exports = mongoose.model('TaskActivity', taskActivitySchema, 'task_activities');

const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const shiftSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    default : null,
  },
}, {
  timestamps: true,
});


 shiftSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});


 shiftSchema.statics = {
  async get(id) {
    let choice;

    if (mongoose.Types.ObjectId.isValid(id)) {
      choice = await this.findById(id).exec();
    }
    if (choice) {
      return choice;
    }

    throw new APIError({
      message: 'Choice does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },


  list({
    page = 1, perPage = 30, inOut, shiftDate,
  }) {
    const options = omitBy({ inOut, shiftDate }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

module.exports = mongoose.model('AlarmStatus', shiftSchema);

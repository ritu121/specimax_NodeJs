const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');
const qrcode = require('qrcode')

const checkpointSchema = new mongoose.Schema({
  name:{
    type:String,
    require:true
  },
  siteId:{
    type: mongoose.Schema.ObjectId,
    ref: 'Site',
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
}, {
  timestamps: true,
});


checkpointSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name','latitude','longitude','qrcode'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});


checkpointSchema.statics = {
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
    page = 1, perPage = 30, siteId
  }) {
    const options = omitBy({ siteId }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

module.exports = mongoose.model('Checkpoints', checkpointSchema);

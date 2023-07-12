const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const DynamicSiteOverviewSchema = new mongoose.Schema({
  reportTypeId:{
    type : mongoose.Schema.ObjectId,
    ref : 'AllReportType',
    required: true,
  },
  siteId:{
    type : mongoose.Schema.ObjectId,
    ref : 'Site',
    required: true,
  },
  role: {
    type: String,
    enum : ['ADMIN','CLIENT','COMPANY_USER','SUPERADMIN','CLIENT_USER'],
    required: true,
  },
  addedBy :{
    type : mongoose.Schema.ObjectId,
    ref : 'User',
    required: true,
  },
}, {
  timestamps: true,
});


DynamicSiteOverviewSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'reportTypeId','siteId' ,'role','addedBy', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});


DynamicSiteOverviewSchema.statics = {
  async get(id) {
    let choice;

    if (mongoose.Types.ObjectId.isValid(id)) {
      choice = await this.findById(id).populate([
        {
          path : 'reportTypeId',
          model : 'AllReportType'
        },
        {
          path : 'siteId',
          model : 'Site'
        },
        {
          path : 'addedBy',
          model : 'User'
        },
      ]).exec();
    }
    if (choice) {
      return choice;
    }

    throw new APIError({
      message: 'Shift does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },


  list({
    page = 1, perPage = 25, addedBy, siteId, reportTypeId
  }) {
    const  options = omitBy({ addedBy, siteId, reportTypeId }, isNil);
    return this.find(options)
      .populate([
          {
            path : 'reportTypeId',
            model : 'AllReportType'
          },
          {
            path : 'siteId',
            model : 'Site'
          },
          {
            path : 'addedBy',
            model : 'User'
          },
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

module.exports = mongoose.model('DynamicSiteOverview', DynamicSiteOverviewSchema,'dynamic_site_overview_reports');

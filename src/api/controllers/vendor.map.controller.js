const httpStatus = require('http-status');
const { omit } = require('lodash');
const Vendor = require('../models/vendor.model');
const bcrypt = require('bcryptjs');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const vendor = await Vendor.find({ vendor: id });
    req.locals = { vendor };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json({ code: 200, message: 'Clients retrieved successfully.', data: req.locals.company.transform() });

/**
 * Get logged in user info
 * @public
 */

/**
 * Create new user
 * @public
 */
// exports.create = async (req, res, next) => {
//   try {


//   } catch (error) {
//     next(error);
//   }
// };

exports.addClient = async (req, res, next) => {
  let vendor = req.body.vendorId;
  let update = await Vendor.updateOne({ vendor }, { $addToSet: { clients: { $each: req.body.client }, sites: { $each: req.body.sites } } })
  let data = await Vendor.findOne({ vendor });
  res.json({ code: 200, message: "Client added successfully", data: data })
}
exports.removeClient = async (req, res, next) => {
  let vendor = req.body.vendorId;
  let update = await Vendor.updateOne({ vendor },
    { $pull: { clients: req.body.client, sites: req.body.sites } })
  let data = await Vendor.findOne({ vendor });
  res.json({ code: 200, message: "Client removed successfully", data })
}

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { company } = req.locals;
    const newCompany = new Company(req.body);
    const newCompanyObject = omit(newCompany.toObject(), '_id');

    await company.updateOne(newCompanyObject, { override: true, upsert: true });
    const savedCompany = await Company.findById(company._id);

    res.json({ code: 200, message: 'Vendor updated successfully.', data: savedCompany.transform() });
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedCompany = omit(req.body);
  const company = Object.assign(req.locals.company, updatedCompany);

  company.save()
    .then((savedCompany) => {
      Company.findOne({ _id: savedCompany._id })
        .populate([
          {
            path: 'countryId',
            model: 'Country'
          },
          {
            path: 'cityId',
            model: 'City'
          }
        ])
        .then((data) => {
          res.json({ code: 201, message: 'Vendor updated successfully.', data: data });
        })
        .catch((errors) => {
          res.json({ code: 500, message: 'Internal server error.', errors: errors });
        })
    })
    .catch((e) => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    // req.query.type='vendor'
    const companies = await Vendor.list(req.query);
    const transformedCompanies = companies.map((status) => status.transform());
    res.json({ code: 200, message: 'Clients list retrieved successfully.', data: transformedCompanies });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { company } = req.locals;

  company.remove()
    .then(() => res.json({ code: 200, message: 'Vendor delete successfully.', data: {} }))
    .catch((e) => next(e));
};

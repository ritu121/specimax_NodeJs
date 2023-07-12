const Company = require('../../models/company.model');
const Role = require('../../models/role.model');
/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const company = await Company.get(id);
    req.locals = { company };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    req.query.type='client'
    const companies = await Company.list(req.query);
    const transformedCompanies = companies.map((status) => status.transform());
    res.json({ code: 200, message: 'Company list retrieved successfully.', data: transformedCompanies });
  } catch (error) {
    next(error);
  }
};

exports.role = async (req, res, next) => {
  try {
    const roles = await Role.list(req.query);
    const transformedRoles = roles.map((status) => status.transform());
    res.json({ code: 200, message: 'Company role list retrieved successfully.', data: transformedRoles });
  } catch (error) {
    next(error);
  }
};

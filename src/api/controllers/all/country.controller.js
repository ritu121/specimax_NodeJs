const Country = require('../../models/country.model');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const country = await Country.get(id);
    req.locals = { country };
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
    const countries = await Country.list(req.query);
    const transformedCountries = countries.map((status) => status.transform());
    res.json({code : 200, message : 'Country list retrieved successfully.', data: transformedCountries});
  } catch (error) {
    next(error);
  }
};

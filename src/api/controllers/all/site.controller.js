const Site = require('../../models/site.model');

exports.listByCountry = async (req, res, next) => {
  try {
    const sites = await Site.find({companyId : req.params.companyId}).populate('team country city companyId');
    res.json({code : 200, message : 'Site list retrieved successfully.', data: sites});
  } catch (error) {
    next(error);
  }
};

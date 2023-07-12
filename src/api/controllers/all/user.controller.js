const Site = require('../../models/site.model');
const User = require('../../models/user.model');

exports.listBySite = async (req, res, next) => {
  try {
    const site = await Site.findOne({_id : req.params.siteId});
    if(site){
      if(site.team){
          const users = await User.find({_id : {$in : site.team}});
          res.json({code : 200, message : 'User list retrieved successfully.', data: users});
      }
      else{
        res.json({code : 200, message : 'User list retrieved successfully.', data: []});
      }
    }
    else{
        res.json({code : 404, message : 'Site not found.', data: []});
    }
    
  } catch (error) {
    next(error);
  }
};

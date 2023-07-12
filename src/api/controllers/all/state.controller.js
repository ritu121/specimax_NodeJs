const Country = require('../../models/country.model');
const State = require('../../models/state.model');
const CityM = require('../../models/city.model');
const State1 = require('country-state-city').State;
const City = require('country-state-city').City;
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
    const states = await State.find({country:req.query.countryId}).populate('country')
    res.json({code : 200, message : 'Country list retrieved successfully.', data: states});
  } catch (error) {
    next(error);
  }
};
exports.create = async (req, res, next) => {
  try {
    const states = State1.getStatesOfCountry(req.query.country)
    states.map(e=>e.country=req.query.countryId)
    // let a= await State.insertMany(states)
    // console.log('aa',a)
    res.json({code : 200, message : 'Country list retrieved successfully.', data: states});
  } catch (error) {
    next(error);
  }
};
exports.createCity = async (req, res, next) => {
  try {
    const states = City.getCitiesOfCountry(req.query.country)
    let cities = []
    states.map(async e=>
      // cities.push(e.name)
      {
        let a = await CityM.updateOne({'name':e.name},{$set:{'name':e.name,'countryId':req.query.countryId}},{upsert:true})
      console.log('a')}
    )
    // let a= await State.insertMany(states)
    // console.log('aa',a)
    res.json({code : 200, message : 'Country list retrieved successfully.', data: states});
  } catch (error) {
    next(error);
  }
};

const httpStatus = require('http-status');
const { omit } = require('lodash');
const Country = require('../models/country.model');
const City = require('../models/city.model');
const cities =  require('../data/cities.json');



exports.cities = async (req, res, next) => {
  try {
    Country.find({}, (err, countries) => {
      if(err){
        return false;
      }
      var arr = [];
      for(var i = 0; i < countries.length; i++){
        for(var j = 0; j  < cities.length; j++){
          if(countries[i].code == cities[j].iso2){
            arr.push({
              countryId : countries[i]._id,
              name : cities[j].city,
             });
            // console.log(countries[i].code  + "---" +cities[j].iso2)
            // var city = new City({
            //   countryId : countries[i]._id,
            //   name : cities[j].city,
            //  });
            //  console.log({
            //   countryId : countries[i]._id,
            //   name : cities[j].city
            //  })

            //  city.save((err, data) =>{
            //   if(err){
            //     console.log(err)
            //     return false;
            //   }
            //   if(data){
            //     console.log('In')
            //   }
            
            //  })

          }
        }
      }

      City.insertMany(arr, (err, city) => {
          if(err){
            return false;
          }
          if(city){
          }
          else{
          }      
      })
      res.json({code : 200, message : 'Upload successfully.'})
    })
   
  } catch (error) {
    console.log(error);
  }
};


const httpStatus = require('http-status');
const { omit } = require('lodash');
const multer = require('multer');
const Card = require('../../models/user.payment.card.model');
const stripe = require('stripe')('sk_test_51LLPCjCK0aC99gHRt1NdlldC5A0HLZ8LwVk6dcYV5mvGoFVPZvVJphZQDGo8aw3Ry3mE9LVoTvCiNluJDSp0x0iK00cU8eeJ88');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const card = await Card.get(id);
    req.locals = { card };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => {
  Card.findOne({ _id: req.locals.card })
  .then((cards) => {
    res.send(200, { code: 200, message: 'Card retrieved successfully.', data: cards })
  })
  .catch((errors) => {
    res.send(500, { code: 500, message: 'Internal server error.', errors });
  });
  
};

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.card.transform());

exports.create = async (req, res, next) => {
  try {
    if (req.body.cardType=='OUTGOING'){
      const custStripeId = req.user.stripeId || 'cus_MRqPuepFsMgh1Q'
      const card = await stripe.customers.createSource(
        // String(req.user._id),
        custStripeId,
        {source: req.body.cardToken}
      );
    }
    
    else{
      const data = {
        user : req.user._id,
        cardType : req.body.cardType,
        bankName : req.body.bankName,
        cardHolderName : req.body.cardHolderName,
        cardNumber : req.body.cardNumber,
        expiryDate : req.body.expiryDate,
        cvv : req.body.cvv
      }
      const card = new Card(data);
      const savedCard = await card.save();
    }
    res.status(httpStatus.CREATED);
    res.send(201, { code: 201, message: 'Card created successfully.' });
  } catch (error) {
    next(error);
  }
};

exports.getOutgoingCards = async (req,res,next)=>{
  try {
    const custStripeId = req.user.stripeId || 'cus_MRqPuepFsMgh1Q'
    const cards = await stripe.customers.listSources(
      custStripeId,
      {object: 'card'}
    );
    // res.status(httpStatus.CREATED);
    res.send(201, { code: 200, message: 'Cards Retrived successfully.', data:cards?.data });
  } catch (error) {
    next(error)
  }
}
/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { card } = req.locals;
    const newCard = new Card(req.body);
    const newCardObject = omit(newCard.toObject(), '_id');

    await card.updateOne(newCardObject, { override: true, upsert: true });
    const savedCard = await card.findById(card._id);

    res.json({ code: 200, message: 'Card updated successfully.', data: savedCard.transform() });
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedCard = omit(req.body);
  const card = Object.assign(req.locals.card, updatedCard);

  card.save()
    .then((data) => res.json({ code: 200, message: 'Card updated successfully.', data: data.transform() }))
    .catch((e) => next(e));
};


exports.view = (req, res, next) => {
  const id = req.locals.card;
  Card.findOne({_id : id}, function(err, card){
    if(err){
      res.send(500, { code: 500, message: 'Internal server error.', errors : err });
    }

    if(card){
      res.send(200 ,{ code: 200, message: 'Card updated successfully.', data: card});
    }

    res.send(404, { code: 404, message: 'Card updated successfully.', data: []});
  })
};
/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const user = {'user':req.user._id}
    const cards = await Card.list(user);
    const transformedCards = cards.map((status) => status.transform());
    res.json({ code: 200, message: 'Card list retrieved successfully.', data: transformedCards });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { card } = req.locals;

  card.remove()
    .then(() => res.json(200, { code: 200, message: 'Card delete successfully.' }))
    .catch((e) => next(e));
};

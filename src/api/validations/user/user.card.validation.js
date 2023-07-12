const Joi = require('joi');

module.exports = {

  // GET /v1/user/status
  listCards: {
  },

  deleteCard: {

  },

  viewCard: {

  },

  // POST /v1/Statuss
  updateCard: {
    body: {
      cardType: Joi.string().valid('INCOMING','OUTGOING').required(),
      cardHolderName: Joi.string().min(3).required(),
      bankName : Joi.string().required(),
      cardNumber: Joi.number().min(3).required(),
      expiryDate: Joi.date().allow(null),
      cvv: Joi.number().min(3).required(),
    },
  },

  replaceCard: {
    body: {
      cardType: Joi.string().valid('INCOMING','OUTGOING').required(),
      cardHolderName: Joi.string().min(3).required(),
      bankName : Joi.string().required(),
      cardNumber: Joi.number().min(3).required(),
      expiryDate: Joi.date().allow(null),
      cvv: Joi.number().min(3).required(),
    },
  },

  createCard: {
    body: {
      cardType: Joi.string().valid('INCOMING','OUTGOING').required(),
      cardHolderName: Joi.when('cardType', { is: 'INCOMING', then: Joi.string().min(3).required()}),
      bankName : Joi.when('cardType', { is: 'INCOMING', then:Joi.string().required()}),
      cardNumber: Joi.when('cardType', { is: 'INCOMING', then:Joi.number().min(3).required()}),
      expiryDate: Joi.when('cardType', { is: 'INCOMING', then:Joi.date().allow(null)}),
      cvv: Joi.when('cardType', { is: 'INCOMING', then:Joi.number().min(3).required()}),
      cardToken: Joi.when('cardType', { is: 'OUTGOING', then:Joi.string().required()}),
    },
  },

};

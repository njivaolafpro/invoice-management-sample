const Joi = require('joi');

const createInvoiceSchema = Joi.object({
    clientId: Joi.string().required(),
    items: Joi.array(),
    paid: Joi.number(),
    moreDetails: Joi.string(),
    debugMode: Joi.boolean(),
});

module.exports = { createInvoiceSchema }

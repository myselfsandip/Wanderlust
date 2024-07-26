const Joi = require('joi');


module.exports.listingSchema = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        country:Joi.string().required(),
        location:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null),
        category: Joi.string().valid('trending', 'rooms', 'iconic-cities', 'mountains', 'castles', 'amazing-pools', 'camping', 'farms', 'arctic').required()
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        comment:Joi.string().required(),
        rating:Joi.number().integer().min(1).max(5).required(),
        createdAt:Joi.date().allow("")
    }).required()
})

const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.object({
      url: Joi.string().uri().default('https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'),
      filename: Joi.string().default('default')
    }).default(),
    category: Joi.string().valid(
      'trending', 
      'rooms', 
      'iconic_cities', 
      'mountains', 
      'castles', 
      'arctic', 
      'camping', 
      'farms', 
      'domes', 
      'boats'
    ).required()
  }).required()
});


module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required(),
    comment: Joi.string().required()
  }).required(),
});
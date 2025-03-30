const Joi = require('joi');

const placeSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  placeType: Joi.array().items(Joi.string().valid(
    'Beach', 'Mountains', 'Waterfalls', 'Religious', 'Historical', 'Urban', 'Wildlife'
  )).min(1).required(),
  suitableFor: Joi.object({
    ageRange: Joi.object({
      min: Joi.number().integer().min(0).max(120),
      max: Joi.number().integer().min(Joi.ref('min')).max(120)
    }),
    hobbies: Joi.array().items(Joi.string().valid(
      'Hiking', 'Surfing', 'Camping', 'Sightseeing', 'Adventure', 'Photography', 'Shopping', 'Relaxation'
    )),
    climate: Joi.array().items(Joi.string().valid(
      'Tropical', 'Temperate', 'Arid', 'Cold'
    )),
    healthConsiderations: Joi.object({
      notRecommendedFor: Joi.array().items(Joi.string().valid(
        'Cough', 'Fever', 'Headache', 'Back Pain', 'Asthma', 'Knee Pain', 'Heart Condition'
      )),
      specialFacilities: Joi.array().items(Joi.string().valid(
        'Wheelchair Access', 'Elevators', 'Rest Areas', 'Medical Support', 'Shuttle Service'
      ))
    })
  }).required()
});

exports.validatePackageInput = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    duration: Joi.number().integer().min(1).required(),
    places: Joi.array().items(placeSchema).min(1).required()
  });

  return schema.validate(data);
};

exports.validateCustomizationInput = (data) => {
  const schema = Joi.object({
    age: Joi.number().integer().min(1).max(120).required(),
    gender: Joi.string().valid('male', 'female', 'other', '').optional(),
    placeType: Joi.array().items(Joi.string().valid(
      'Beach', 'Mountains', 'Waterfalls', 'Religious', 'Historical', 'Urban', 'Wildlife'
    )).optional(),
    hobby: Joi.array().items(Joi.string().valid(
      'Hiking', 'Surfing', 'Camping', 'Sightseeing', 'Adventure', 'Photography', 'Shopping', 'Relaxation'
    )).optional(),
    climate: Joi.string().valid(
      'Tropical', 'Temperate', 'Arid', 'Cold', ''
    ).optional(),
    diseases: Joi.array().items(Joi.string().valid(
      'Cough', 'Fever', 'Headache', 'Back Pain', 'Asthma', 'Knee Pain', 'Heart Condition'
    )).optional(),
    physicalDisorders: Joi.array().items(Joi.string().valid(
      'Back Pain', 'Asthma', 'Knee Pain', 'Heart Condition'
    )).optional()
  });

  return schema.validate(data);
};
const joi = require("joi");
module.exports = {
  signUp: joi.object().keys({
    firstName: joi
      .string()
      .regex(/^[a-zA-Z]+$/)
      .required()
      .messages({
        "string.pattern.base": "Only Alphabets are allowed for {{#label}}"
      }),
    lastName: joi
      .string()
      .regex(/^[a-zA-Z]+$/)
      .required()
      .messages({
        "string.pattern.base": "Only Alphabets are allowed for {{#label}}"
      }),
    userName: joi
      .string()
      .regex(/^[a-z]+$/)
      .required()
      .messages({
        "string.pattern.base":
          "Only lowercase Alphabets are allowed for {{#label}}"
      }),
    email: joi.string().email().required(),
    gender: joi.string().valid("male", "female", "other").required(),
    phone: joi
      .string()
      .length(10)
      .regex(/^[0-9]+$/)
      .required()
      .messages({
        "string.length": "Mobile Number should be exactly 10 digits.",
        "string.pattern.base": "Mobile Number should contain only digits.",
        "any.required": "Mobile Number is required."
      }),
    designation: joi.string().required(),
    phonePrefix: joi.string().required()
  }),
  leaveApply: joi.object().keys({
    typeOfLeave: joi.string().required(),
    startDate: joi.string().required(),
    endDate: joi.string().required(),
    firstHalf: joi.boolean(),
    secondHalf: joi.boolean(),
    leaveDescription: joi.string().required()
  })
};

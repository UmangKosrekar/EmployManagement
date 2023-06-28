const joi = require("joi");
module.exports = {
  signUp: joi.object().keys({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    userName: joi.string().required(),
    password: joi.string().min(3).max(15).required()
  })
};

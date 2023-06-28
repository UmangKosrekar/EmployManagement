const { response } = require("../util/response");

const validation = (Schema) => {
  return (req, res, next) => {
    const { error } = Schema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message.replace(/["]/g, "");
      return response(400, "VALIDATIONERROR", errorMessage, res);
    }
    next();
  };
};
module.exports = validation;

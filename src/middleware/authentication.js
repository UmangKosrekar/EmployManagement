const jwt = require("jsonwebtoken");
const checkAuth = (roles) => (req, res, next) => {
  try {
    const token = req.cookies.access_token || req.headers.access_token;
    if (!token) {
      return response(401, "Login required", undefined, res);
    } else {
      jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (decoded && decoded.userType) {
          roles.map((role) => {
            if (role == decoded.userType) {
              next();
            }
          });
        } else {
          return response(401, "Please login again", undefined, res);
        }
      });
    }
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

module.exports = checkAuth;

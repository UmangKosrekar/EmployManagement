const { response } = require("../util/response");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const { capitalizeEveryFirstLetter } = require("../util/format");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return response(403, "Credentials are missing", undefined, res);
    }
    const userData = await User.findOne({ userName }).lean();
    if (userData) {
      console.log(userData.password, password);
      const comparePass = await bcrypt.compare(password, userData.password);
      if (comparePass) {
        const token = {
          _id: userData._id,
          userName: userData.userName,
          password: userData.password,
          userType: userData.userType,
          type: "login"
        };

        const _token = jwt.sign(token, process.env.JWT_KEY);
        res.cookie("access_token", _token);
        return response(
          200,
          `Welcome aboard ${capitalizeEveryFirstLetter(
            userData.firstName
          )} ${capitalizeEveryFirstLetter(userData.lastName)}`,
          {
            _id: userData._id,
            userName: userData.userName,
            firstName: userData.firstName,
            lastName: userData.lastName,
            userType: userData.userType,
            access_token: _token
          },
          res
        );
      }
    }
    return response(403, "Credentials are incorrect", undefined, res);
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

exports.logOut = async (req, res) => {
  try {
    const bodyData = req.body;
    const userData = await User.findOne({});
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

exports.check = async (req, res) => {
  try {
    const _token = req.cookies.access_token || req.headers.access_token;
    if (_token) {
      jwt.verify(_token, process.env.JWT_KEY, async (err, decoded) => {
        if (decoded) {
          const userData = await User.findOne({ _id: decoded._id }).lean();
          if (userData) {
            return response(
              200,
              undefined,
              {
                _id: userData._id,
                userName: userData.userName,
                firstName: userData.firstName,
                lastName: userData.lastName,
                userType: userData.userType,
                access_token: _token
              },
              res
            );
          }
        }
        return response(401, "Session expired", undefined, res);
      });
    } else {
      return response(401, "Token not found", undefined, res);
    }
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

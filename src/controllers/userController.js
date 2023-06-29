const { response } = require("../util/response");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const { capitalizeEveryFirstLetter } = require("../util/format");

exports.add = async (req, res) => {
  try {
    const bodyData = {
      ...req.body,
      firstName: capitalizeEveryFirstLetter(req.body.firstName),
      capitalizeEveryFirstLetter: capitalizeEveryFirstLetter(req.body.lastName)
    };
    const findUserName = await User.findOne({
      userName: bodyData.userName
    }).lean();
    if (findUserName) {
      return response(403, "User Name already exists", undefined, res);
    }
    const hash = await bcrypt.hash("123", process.env.SALT * 1);
    await User.create({ ...bodyData, password: hash });
    return response(200, "User Registered", undefined, res);
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

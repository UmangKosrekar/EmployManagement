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

    console.log("bodyData", bodyData);
    const findUserName = await User.findOne({
      userName: bodyData.userName
    }).lean();
    console.log("findUserName", findUserName);
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

exports.list = async (req, res) => {
  try {
    const { search } = req.body;
    let condition = { userType: "employ" };
    let sortCondition = { _id: -1 };
    if (search) {
      condition["$or"] = [
        {
          fullName: {
            $regex: search,
            $options: "i"
          }
        },
        {
          userName: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }
    const userList = await User.aggregate([
      {
        $addFields: {
          fullName: { $concat: ["$firstName", " ", "$lastName"] }
        }
      },
      {
        $match: condition
      },
      {
        $facet: {
          count: [{ $count: "totalCount" }],
          paginationResult: [
            {
              $sort: sortCondition
            }
          ]
        }
      }
    ]);

    return response(
      200,
      undefined,
      {
        totalDocs: userList[0].count[0] ? userList[0].count[0].totalCount : 0,
        list: userList[0].paginationResult
      },
      res
    );
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

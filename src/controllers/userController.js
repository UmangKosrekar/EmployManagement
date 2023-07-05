const { response } = require("../util/response");
const User = require("../model/user");
const Leave = require("../model/leave");
const bcrypt = require("bcryptjs");
const ObjectId = require("mongoose").Types.ObjectId;
const { capitalizeEveryFirstLetter } = require("../util/format");

exports.add = async (req, res) => {
  try {
    const bodyData = {
      ...req.body,
      firstName: capitalizeEveryFirstLetter(req.body.firstName),
      lastName: capitalizeEveryFirstLetter(req.body.lastName)
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

exports.list = async (req, res) => {
  try {
    let { search, page } = req.body;
    let condition = { userType: "employ" };
    let sortCondition = { _id: -1 };
    if (!page) {
      page = 1;
    }
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
    const query = [
      {
        $addFields: {
          fullName: { $concat: ["$firstName", " ", "$lastName"] }
        }
      },
      {
        $match: condition
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          userName: 1,
          designation: 1
        }
      },
      {
        $facet: {
          count: [{ $count: "totalCount" }],
          paginationResult: [
            {
              $sort: sortCondition
            },
            {
              $skip: (page - 1) * 5
            },
            {
              $limit: 10
            }
          ]
        }
      }
    ];
    const userList = await User.aggregate(query);

    console.log(JSON.stringify(query, null, 2));

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

exports.view = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await User.findOne(
      {
        _id: id
      },
      {
        firstName: 1,
        lastName: 1,
        userName: 1,
        email: 1,
        gender: 1,
        phone: 1,
        designation: 1
      }
    );
    return response(200, undefined, data, res);
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

exports.update = async (req, res) => {
  try {
    const bodyData = {
      firstName: capitalizeEveryFirstLetter(req.body.firstName),
      lastName: capitalizeEveryFirstLetter(req.body.lastName),
      email: req.body.email.toLowerCase(),
      phone: req.body.phone,
      gender: req.body.gender,
      designation: req.body.designation
    };

    console.log(bodyData, req.body.id);

    const findUserName = await User.findOne({
      _id: { $ne: new ObjectId(req.body.id) },
      userName: bodyData.userName
    }).lean();
    if (findUserName) {
      return response(403, "User Name already exists", undefined, res);
    }
    const hash = await bcrypt.hash("123", process.env.SALT * 1);
    await User.updateOne({ _id: new ObjectId(req.body.id) }, { ...bodyData });
    return response(200, "User Updated", undefined, res);
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

exports.getProfile = async (req, res) => {
  try {
    let data = await User.aggregate([
      {
        $match: {
          _id: new ObjectId(req.user._id)
        }
      },
      {
        $lookup: {
          from: "leaves",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$$id", "$userId"]
                }
              }
            },
            {
              $project: {
                _id: 1,
                typeOfLeave: 1,
                numberOfLeave: 1,
                startDate: 1,
                endDate: 1,
                firstHalf: 1,
                secondHalf: 1,
                status: 1
              }
            },
            {
              $sort: {
                _id: -1
              }
            }
          ],
          as: "leaveData"
        }
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          userName: 1,
          userType: 1,
          email: 1,
          gender: 1,
          phone: 1,
          phonePrefix: 1,
          designation: 1,
          usedLeaves: 1,
          availableLeaves: 1,
          leaveData: 1
        }
      }
    ]);
    return response(200, undefined, data[0], res);
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

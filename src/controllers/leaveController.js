const { response } = require("../util/response");
const User = require("../model/user");
const Leave = require("../model/leave");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const ObjectId = require("mongoose").Types.ObjectId;
const { capitalizeEveryFirstLetter } = require("../util/format");
const d = moment(new Date()).startOf("day");

exports.applyLeave = async (req, res) => {
  try {
    let bodyData = {
      ...req.body,
      userId: new ObjectId(req.user._id)
    };
    const startDate = moment(bodyData.startDate).startOf("day"),
      endDate = moment(bodyData.endDate).startOf("day");

    if (startDate <= d || startDate > endDate) {
      return response(400, "Invalid Leave1", undefined, res);
    }

    bodyData["numberOfLeave"] = (endDate - startDate) / 1000 / 60 / 60 / 24;
    if (!bodyData.firstHalf) {
      bodyData["numberOfLeave"] = bodyData["numberOfLeave"] + 0.5;
    }
    if (!bodyData.secondHalf) {
      bodyData["numberOfLeave"] = bodyData["numberOfLeave"] + 0.5;
    }
    if (bodyData.numberOfLeave <= 0) {
      return response(400, "Invalid Inputs", undefined, res);
    }

    const availableLeaves = await User.findOne({
      _id: new ObjectId(req.user._id)
    }).lean();
    if (availableLeaves.availableLeaves < bodyData.numberOfLeave) {
      return response(400, "Not Enough Balance", undefined, res);
    }

    await Leave.create(bodyData);
    // .then(async (data) => {
    //   if (data && data.userId) {
    //     await User.updateOne(
    //       { _id: new ObjectId(data.userId) },
    //       {
    //         $inc: {
    //           usedLeaves: data.numberOfLeave,
    //           availableLeaves: -data.numberOfLeave
    //         }
    //       }
    //     );
    //   }
    // });
    return response(200, "Leave applied", undefined, res);
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

exports.removeLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const leaveData = await Leave.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(req.user._id)
    }).lean();
    if (!leaveData) {
      return response(400, "Leave not found", undefined, res);
    }
    if (leaveData.status != "pending") {
      return response(
        400,
        "Confirmed Leave can not be cancled",
        undefined,
        res
      );
    }
    if (d > moment(leaveData.startDate)) {
      return response(400, "Leave can not be cancled", undefined, res);
    }
    // await User.updateOne(
    //   { _id: new ObjectId(leaveData.userId) },
    //   {
    //     $inc: {
    //       usedLeaves: -leaveData.numberOfLeave,
    //       availableLeaves: leaveData.numberOfLeave
    //     }
    //   }
    // );
    await Leave.deleteOne({ _id: new ObjectId(id) });
    return response(200, "Leave Removed", undefined, res);
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

exports.leaveList = async (req, res) => {
  try {
    const leaveData = await Leave.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData"
        }
      },
      {
        $unwind: "$userData"
      },
      {
        $addFields: {
          sortField: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "pending"] }, then: 0 },
                { case: { $eq: ["$status", "confirm"] }, then: 1 },
                { case: { $eq: ["$status", "reject"] }, then: 2 }
              ],
              default: 3
            }
          }
        }
      },
      {
        $sort: { sortField: 1 }
      },
      {
        $project: {
          _id: 1,
          typeOfLeave: 1,
          numberOfLeave: 1.5,
          startDate: 1,
          endDate: 1,
          firstHalf: 1,
          secondHalf: 1,
          status: 1,
          leaveDescription: 1,
          userData: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            userName: 1,
            designation: 1,
            usedLeaves: 1,
            availableLeaves: 1
          }
        }
      }
    ]);
    return response(200, undefined, leaveData, res);
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const leaveFind = await Leave.findOne({ _id: new ObjectId(id) }).lean();
    if (status == "confirm") {
      await Leave.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status } }
      ).then(async (data) => {
        if (leaveFind.status != "confirm") {
          await User.updateOne(
            { _id: new ObjectId(data.userId) },
            {
              $inc: {
                usedLeaves: leaveFind.numberOfLeave,
                availableLeaves: -leaveFind.numberOfLeave
              }
            }
          );
        }
      });
    } else if (status == "pending") {
      await Leave.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status } }
      ).then(async (data) => {
        if (leaveFind.status == "confirm") {
          await User.updateOne(
            { _id: new ObjectId(data.userId) },
            {
              $inc: {
                usedLeaves: -leaveFind.numberOfLeave,
                availableLeaves: leaveFind.numberOfLeave
              }
            }
          );
        }
      });
    } else if (status == "reject") {
      await Leave.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status } }
      ).then(async (data) => {
        if (leaveFind.status == "confirm") {
          await User.updateOne(
            { _id: new ObjectId(data.userId) },
            {
              $inc: {
                usedLeaves: -leaveFind.numberOfLeave,
                availableLeaves: leaveFind.numberOfLeave
              }
            }
          );
        }
      });
    }

    return response(
      200,
      "Leave " + status.charAt(0).toLowerCase() + status.slice(0),
      undefined,
      res
    );
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

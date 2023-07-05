const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    typeOfLeave: { type: String, required: true },
    leaveDescription: { type: String, required: true },
    numberOfLeave: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    firstHalf: { type: Boolean, default: false },
    secondHalf: { type: Boolean, default: false },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "confirm", "reject"]
    }
  },
  { timestamps: true }
);

const userModel = mongoose.model("leave", userSchema);

module.exports = userModel;

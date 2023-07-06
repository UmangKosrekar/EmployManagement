const express = require("express");
const route = express.Router();
const leave = require("../controllers/leaveController");
const validationGroup = require("../validation.js/auth");
const validate = require("../middleware/validate");
const checkAuth = require("../middleware/authentication");

route.post(
  "/apply",
  checkAuth(["employ"]),
  validate(validationGroup.leaveApply),
  leave.applyLeave
);
route.get("/remove/:id", checkAuth(["employ"]), leave.removeLeave);
route.get("/list", checkAuth(["admin"]), leave.leaveList);
route.post("/change-status", checkAuth(["admin"]), leave.changeStatus);
// route.get("/getProfile", checkAuth(["admin", "employ"]), leave.getProfile);

module.exports = route;

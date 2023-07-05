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
// route.get("/view/:id", checkAuth(["admin"]), leave.view);
// route.post("/update", checkAuth(["admin"]), leave.update);
// route.get("/getProfile", checkAuth(["admin", "employ"]), leave.getProfile);

module.exports = route;

const express = require("express");
const route = express.Router();
const user = require("../controllers/userController");
const validationGroup = require("../validation.js/auth");
const validate = require("../middleware/validate");
const checkAuth = require("../middleware/authentication");

route.post(
  "/add",
  checkAuth(["admin"]),
  validate(validationGroup.signUp),
  user.add
);

route.post("/list",
//  checkAuth(["admin"]),
  user.list);

module.exports = route;

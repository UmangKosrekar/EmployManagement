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

route.post("/list", checkAuth(["admin"]), user.list);
route.get("/view/:id", checkAuth(["admin"]), user.view);
route.post("/update", checkAuth(["admin"]), user.update);
route.get("/getProfile", checkAuth(["admin", "employ"]), user.getProfile);

module.exports = route;

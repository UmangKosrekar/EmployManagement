const express = require("express");
const route = express.Router();
const user = require("../controllers/authController");
const validationGroup = require("../validation.js/auth");
const validate = require("../middleware/validate");

route.post("/sign-up", validate(validationGroup.signUp), user.singUp);
route.post("/log-in", user.login);
route.get("/check", user.check);

module.exports = route;
